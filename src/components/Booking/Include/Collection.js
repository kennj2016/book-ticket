import React, {Component} from "react";
import qs from "qs";
import moment from "moment";
import LazyImage from "../../common/Include/LazyImage";
import {
    Layout,
    Row,
    Modal,
    Skeleton,
    notification,
    Form,
    Input,
    Button,
    Checkbox,
    Radio,
} from "antd";
import {Link} from "react-router-dom";

import {
    HeartOutlined,
    DownloadOutlined,
    LoadingOutlined,
    CheckCircleOutlined,
    HeartFilled, LockOutlined,
} from "@ant-design/icons";

import {startPusherNotificationWithSessionId} from "../../../HandleNotification";

import {validEmail} from "../../../utils/helper";
import {connect} from "react-redux";
import {
    getCollectionsBooking,
    getBaseInfoBooking,
} from "../../../actions/bookActions";
import "./collection.scss";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
import {
    downloadCollectionBooking,
    getArrayLikeImageCollection,
    likeImageCollectionBooking,
} from "../../../actions/userActions";
import {
    EmailShareButton,
    EmailIcon,
    FacebookShareButton,
    FacebookIcon,
    PinterestShareButton,
    PinterestIcon,
    TwitterShareButton,
    TwitterIcon,
} from "react-share";
import ListFavorites from "./CollectionFavorites";
import ImageCarousel from "./ImageCarousel";
import ModalAddCodePin from "./ModalAddCodePin";
import ModalChooseCategory from "./ModalChooseCategoryFavorite";
import PinInput from "react-pin-input";

const FormItem = Form.Item;
const {Footer, Content} = Layout;
const SERVER_DOMAIN = process.env.API_URL.split("/api/v1").shift();


const ShareIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="35px" height="25px" viewBox="0 0 551.000000 439.000000" preserveAspectRatio="xMidYMid meet">

    <g transform="translate(0.000000,439.000000) scale(0.100000,-0.100000)" fill="#ffffff" stroke="none">
        <path
            d="M3157 3989 c-43 -25 -47 -63 -47 -416 l0 -334 -392 2 c-403 1 -467 -3 -716 -46 -255 -45 -523 -149 -709 -276 -106 -73 -247 -216 -314 -319 -116 -177 -160 -317 -161 -505 0 -355 155 -677 476 -984 90 -87 136 -121 163 -121 36 0 39 25 13 124 -114 444 129 712 695 766 125 11 934 14 952 2 8 -5 12 -108 15 -375 l3 -369 33 -29 c34 -31 73 -36 142 -20 23 5 321 222 895 651 473 353 869 650 881 659 35 27 84 103 84 129 0 71 -2 73 -964 775 -506 369 -932 676 -946 684 -30 15 -78 16 -103 2z m584 -544 c249 -181 631 -460 848 -619 218 -158 396 -292 396 -296 0 -5 -173 -139 -385 -297 -990 -741 -1290 -963 -1304 -969 -14 -6 -16 23 -16 284 0 320 -8 383 -55 432 -14 15 -43 32 -64 39 -50 15 -872 15 -1048 0 -455 -38 -754 -245 -823 -568 -9 -41 -20 -76 -26 -77 -8 -3 -23 16 -99 126 -104 151 -165 290 -189 429 -20 117 -20 136 -1 246 31 175 115 325 275 486 220 223 502 354 900 419 196 31 339 39 697 39 461 -1 429 -30 426 389 -1 153 2 272 7 270 5 -2 213 -151 461 -333z"/>
    </g>
</svg>)
export const responsive = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: {max: 4000, min: 3000},
        items: 3
    },
    desktop: {
        breakpoint: {max: 3000, min: 1024},
        items: 3
    },
    tablet: {
        breakpoint: {max: 1024, min: 464},
        items: 3
    },
    mobile: {
        breakpoint: {max: 464, min: 0},
        items: 3
    }
};

class Collection extends Component {
    constructor(props) {
        super(props);

        this.state = {
            bookingId: "",
            accessToken: "",
            email: "",
            emailFavorites: "",
            userBooking: "",
            codePin: "",
            codePinInput: "",
            imagePreview: "",
            cachePin: "",
            url: "",
            visiblePreview: false,
            visibleShare: false,
            visibleFavorite: false,
            collectionIds: {},
            loading: false,
            step1: false,
            step2: false,
            step3: false,
            visibleListFavorite: false,
            modalInputPinCode: true,
            visibleSendMail: false,
            isChooseCategory: false,
            currentCollection: 0,
            collections: [],
            arrayLike: [],
            collectionFavorites: [],
            categoryLike: null,
            imageLike: null,
            categoryUnlike: null,
            typeImage: "original",
            imageUrl: "",
            isSingleDownload: false,
            dimensionsCover: {
                height: 0,
                width: 0,
            }
        };
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
        this.carousel = React.createRef();

        this.pinRef = React.createRef();
    }

    onImgLoadCover = (e) => {
        this.setState({
            dimensionsCover: {
                height: e.target.offsetHeight,
                width: e.target.offsetWidth,
            }
        });
    };

    next() {
        this.carousel.next();
    }

    previous() {
        this.carousel.prev();
    }

    componentDidMount() {
        setTimeout(() => {
            let queryObject = qs.parse(this.props.location.search, {
                ignoreQueryPrefix: true,
            });
            if (
                Object.keys(queryObject).length &&
                typeof queryObject.bookingId != "undefined" &&
                queryObject.bookingId
            ) {
                let {bookingId} = queryObject;
                this.setState({bookingId});
                getBaseInfoBooking(bookingId).then((res) => {
                    let data = res.data.data;
                    if (typeof data != "undefined") {
                        this.setState({titleGallery: data.titleGallery, userBooking: data.userId, codePin: data.codePin});
                    }
                });
                getCollectionsBooking(bookingId).then((res) => {
                    let email = sessionStorage.getItem("email");
                    if (email && typeof res.data.data != "undefined") {
                        getArrayLikeImageCollection({
                            collectionId: res.data.data[0]._id,
                            email,
                        }).then((res) => {

                            this.setArrayLike(res)


                        });
                        this.setState({emailFavorites: email});
                    }

                    let collections = []
                    if (typeof res.data.data != 'undefined') {
                        collections = res.data.data


                        collections = collections.map(item => {
                            item.images = item.images.map(i => {
                                i.collectionId = item._id
                                return i
                            })
                            return item
                        })

                        collections = [

                            {
                                collectionName: 'ALL',
                                images: collections.reduce((acc, currentValue) => {
                                    return [...acc, ...currentValue.images || []]
                                }, [])
                            },

                            ...collections
                        ]
                    }

                    this.setState({
                        collections: collections
                    });
                });




            } else {
                window.location = "/";
            }

            this.setState({loading: false});


            console.log (this.props);
            if( typeof this.props.user.email != 'undefined' && this.props.user.email)
            {

                console.log (this.props);
                sessionStorage.setItem("email", this.props.user.email);
            }


            

        }, 500);
    }

    updateCodePin = (pin) => {
        this.setState({codePin: pin});
    };

    handleStep1 = () => {


        let {isSingleDownload,urlImage,email} = this.state;

        if(validEmail(email))
        {
            sessionStorage.setItem('email',email)
            this.setState({step2: true, step1: false});
        }



    };



    handleStartDownloadOneImage = ()=>{


        let {isSingleDownload,urlImage,email} = this.state
        if(validEmail(email))
        {
            sessionStorage.setItem('email',email)
            this.setState({step2: true, step1: false});
        }

        this.setState({
            visibleSendMail: true,
            step3: true,
            step2: false,
            step1: false,
            loading: false,
            linkdownload: {
                url:urlImage,
                fileName:urlImage.split('/').pop()
            }
        });

    }
    handleDownloadOneImage = (image)=>{
        console.log (image);

        if(sessionStorage.getItem('email')){
            this.setState({
                visibleSendMail: true,
                step3: true,
                step2: false,
                step1: false,
                loading: false,
                isSingleDownload: true,
                urlImage:image.original,
                linkdownload: {
                    url:image.original,
                    fileName:image.original.split('/').pop()
                }
            });

        }else{

            this.setState({
                visibleSendMail: true,
                step3: false,
                step2: false,
                step1: true,
                isSingleDownload: true,
                urlImage:image.original
            });  

        }

   

    }

    handleDownloadCollection = (image) => {
        //this.setState({step3: true, step2: false, loading: true});

        let {
            bookingId,
            email,
            typeImage,
            collectionIds,
            isSingleDownload,
            urlImage,
        } = this.state;

        console.log({bookingId, email, typeImage, collectionIds});

        let dataPost = {};
        if (isSingleDownload) {
            this.setState({
                visibleSendMail: true,
                step3: true,
                step2: false,
                step1: false,
                loading: false,
                isSingleDownload: false,
                linkdownload: {
                    url:image.original,
                    fileName:image.original.split('/').pop()
                }
            });

            return ;
        } else {
            dataPost = {bookingId, email, typeImage, collectionIds};
        }

        downloadCollectionBooking(dataPost).then((res) => {
            console.log(res.data);
            console.log(res.data.data.sessionId);
            this.setState({
                step3: true,
                step2: false,
                step1: false,
                loading: true,
                isSingleDownload: false,
                urlImage: "",
            });

            /*
             * return session ID
             * */

            /*
             * lúc này server đang zip có thể mất 5phut
             * nên server response trước cái sessionId để bỏ vào pusher
             * pusher sẽ lắng nghe khi sự zip thành công thì sẽ có link,
             * khi đó chuyển sang màn hình download
             * */

            let sessionId = res.data.data.sessionId;
            let channel = startPusherNotificationWithSessionId(sessionId);

            channel.bind("DONE_DOWNLOAD_LINK", (data) => {
                console.log("đã có link", data);
                /*
                 * đã có thông báo pusher từ server nên lúc này client đã nhận đc link
                 * chuyển sang màn hình download link
                 *
                 * */

                this.setState({
                    loading: false,
                    linkdownload: data,
                });
            });
        });
    };

    openNotificationWithIcon = (type, description) => {
        notification.config({
            placement: 'bottomRight',
            bottom: 50,
            duration: 3,
            rtl: true,
        });

        notification[type]({
            message: "Favorites",
            description,
        });
    };

    handleChangeRadioSize = (e) => {
        this.setState({typeImage: e.target.value});
    };

    handleModalShare = (url) => {
        this.setState({visibleShare: true, url});
    };
    setArrayLike = (res) => {
        if (res.data.length) {
            let arrayLike = [];
            let categoryLike = {};
            res.data.forEach(item => {
                if (item.array_like) {
                    arrayLike = [...arrayLike, ...item.array_like];
                }
                if (item.category) {
                    categoryLike[item.category] = item.array_like;
                }
            })
            this.setState({arrayLike, categoryLike});
        }
    }
    handleAddFavorite = () => {
        sessionStorage.setItem("email", this.state.email);
        let data = {
            collectionId: this.state.collectionId,
            imageId: this.state.imageId,
            email: this.state.email,
        };
        likeImageCollectionBooking({...data, category: "MY FAVORITES"}).then((res) => {
            if (res.data.statusCode === 200) {
                getArrayLikeImageCollection({
                    collectionId: this.state.collectionId,
                    email: this.state.email,
                    category: 'MY FAVORITES'
                }).then((res) => {
                    this.setArrayLike(res);
                    this.openNotificationWithIcon("success", (<div>Added to <strong>MY FAVORITES</strong></div>));
                });
            }
        });
        this.props.history.push(`/collections/category?bookingId=${this.state.bookingId}`)
        this.setState({
            visibleFavorite: false,
            // visibleListFavorite: !this.state.visibleListFavorite,
        });
    };

    handleFavorite = (collectionId, image, isLike) => {
        if (this.state.emailFavorites) {
            let data = {
                collectionId,
                imageId: image._id || image.id,
                email: this.state.emailFavorites,
            };
            if (this.state.categoryLike) {
                if (isLike) {
                    let category = "";
                    if (this.state.categoryLike) {
                        for (const [key, value] of Object.entries(this.state.categoryLike)) {
                            if (value.includes(image._id || image.id)) {
                                category = key;
                            }
                        }
                    }
                    this.setState({categoryUnlike: category})
                }
                this.setState({isChooseCategory: true, imageLike: image, collectionId})
            } else {
                likeImageCollectionBooking({...data, category: "MY FAVORITES"}).then((res) => {
                    if (res.data.statusCode === 200) {
                        getArrayLikeImageCollection({
                            collectionId,
                            email: this.state.emailFavorites,
                            category: 'MY FAVORITES'
                        }).then((res) => {
                            this.setArrayLike(res);
                            this.openNotificationWithIcon("success", (<div>Added to <strong>MY FAVORITES</strong></div>));
                        });
                    }
                });

            }

        } else {
            this.setState({visibleFavorite: true, collectionId, imageId: image._id});
        }
    };

    toggleShowFavorite = () => {
        if (sessionStorage.getItem("email")) {
            this.props.history.push(`/collections/category?bookingId=${this.state.bookingId}`)
            // this.setState({visibleListFavorite: !this.state.visibleListFavorite});
        } else {
            this.setState({visibleFavorite: true});
        }
    };
    toggleDownloadModal = (image) => {


        this.setState({
            visibleSendMail: true,
            step3: true,
            step2: false,
            step1: false,
            loading: false,
            isSingleDownload: true,
            urlImage:image.original,
            linkdownload: {
                url:image.original,
                fileName:image.original.split('/').pop()
            }
        });
        
   
    }
    toggleAddCodePin = () => {
        this.setState({modalCodePin: !this.state.modalCodePin})
    }

    toggleChooseCategory = () => {
        this.setState({isChooseCategory: !this.state.isChooseCategory})
    }
    handleInputCodePin = () => {
        console.log (this.pinRef);

        this.setState({codePinInput: this.pinRef.current.state.value});
        if(this.pinRef.current.state.value == this.state.codePin){
            sessionStorage.setItem('codepin',this.state.codePin)
        }

 
    }
    updateCategoryLike = (data) => {
        this.setState({categoryLike: data})
    }

    render() {
        let {
            loading,
            collections,
            imageLike,
            categoryUnlike,
            categoryLike,
            url,
            visibleListFavorite,
            isChooseCategory,
            userBooking,
            codePinInput,
            codePin,
            modalCodePin,
            bookingId,
            modalInputPinCode,
            collectionId,
            emailFavorites
        } = this.state;
        let {user} = this.props;
        
        let optionListCollections = collections
            .filter((item) => item.images && item.images.length)
            .map((item) => {
                return {
                    label: item.collectionName,
                    value: item._id,
                };
            });

        let shouldShowCollection = false;
        if(sessionStorage.getItem('codepin') && sessionStorage.getItem('codepin') == codePin)    {
            shouldShowCollection = true
        }


        return (user._id && user._id === userBooking) || (codePin === codePinInput) || shouldShowCollection ? (
                <div id="collection-page">
                    {isChooseCategory ?
                        <ModalChooseCategory
                            modal={isChooseCategory}
                            toggle={this.toggleChooseCategory}
                            categoryLike={categoryLike}
                            imageLike={imageLike}
                            emailFavorites={emailFavorites}
                            categoryUnlike={categoryUnlike}
                            collection={collectionId}
                            setArrayLike={this.setArrayLike}
                            openNotificationWithIcon={this.openNotificationWithIcon}
                            updateCategoryLike={this.updateCategoryLike}
                            images={collections[
                                this.state.currentCollection
                                ].images}
                        /> : null
                    }
                    {
                        modalCodePin ?
                            <ModalAddCodePin
                                toggle={this.toggleAddCodePin}
                                modal={modalCodePin}
                                bookingId={bookingId}
                                pin={codePin}
                                updateCodePin={this.updateCodePin}
                            /> : null
                    }
                    <React.Fragment>
                        <Modal
                            wrapClassName={"wrap-modal-download"}
                            footer={null}
                            header={null}
                            width={400}
                            title=""
                            closeIcon
                            centered
                            visible={this.state.visibleFavorite}
                            onCancel={() => this.setState({visibleFavorite: false})}
                        >
                            <div
                                style={{
                                    textAlign: "left",
                                    color: "white",
                                    marginBottom: "20px",
                                }}
                            >
                                <h2>FAVORITES</h2>
                                <span>
                                  Save your favorite photos and revisit them at anytime using
                                  your email address. You can share this list with your
                                  photographer, family and friends.
                                </span>
                            </div>
                            <Form.Item
                                name="password"
                                style={{width: "100%"}}
                                rules={[
                                    {required: true, message: "Please input your password!"},
                                ]}
                            >
                                <Input
                                    onChange={(e) => this.setState({email: e.target.value})}
                                    placeholder="Your Email"
                                    className="input-copy"
                                />
                            </Form.Item>
                            <Button
                                className="btn-next"
                                type="primary"
                                htmlType="submit"
                                disabled={!validEmail(this.state.email)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginLeft: "auto",
                                }}
                                onClick={this.handleAddFavorite}
                            >
                                SIGN IN
                            </Button>
                        </Modal>
                        {this.state.visibleShare ?
                            <Modal
                                wrapClassName={"wrap-modal-share"}
                                footer={null}
                                header={null}
                                width={400}
                                title=""
                                closeIcon
                                centered
                                visible={this.state.visibleShare}
                                onCancel={() =>
                                    this.setState({
                                        visibleShare: false,
                                        step3: false,
                                        step2: false,
                                        copied:false
                                    })
                                }
                            >
                                <div className="form-photo">
                                    <h3>SHARE</h3>
                                </div>

                                <Form.Item
                                    name="password"
                                    style={{width: "100%"}}
                                    rules={[
                                        {required: true, message: "Please input your password!"},
                                    ]}
                                >
                                    <Input
                                        suffix={
                                            <Button
                                                style={{right:0}}
                                                type='primary'
                                                onClick={() =>{


                                                    this.setState({copied:true})
                                                    navigator.clipboard.writeText(url)
                                                }}
                                                className="btn-copy"
                                            >
                                                {!this.state.copied && (`COPY`)}
                                                {this.state.copied && (`COPIED`)}
                                                
                                            </Button>
                                        }
                                        value={`${url.slice(0, 30)}...`}
                                        disabled
                                        className="input-copy"
                                    />
                                </Form.Item>
                                <br/>
                                <div className="share-wrapper">
                                    <FacebookShareButton url={url}>
                                        <FacebookIcon size={32} className="border-radius-5"/>
                                        <br/>
                                        Facebook
                                    </FacebookShareButton>
                                    <TwitterShareButton url={url}>
                                        <TwitterIcon size={32} className="border-radius-5"/>
                                        <br/>
                                        Twitter
                                    </TwitterShareButton>
                                    <PinterestShareButton media={url} url={url}>
                                        <PinterestIcon size={32} className="border-radius-5"/>
                                        <br/>
                                        Pinterest
                                    </PinterestShareButton>
                                    <EmailShareButton url={url}>
                                        <EmailIcon size={32} className="border-radius-5"/>
                                        <br/>
                                        Email
                                    </EmailShareButton>
                                </div>
                            </Modal> : null}
                        <Modal
                            wrapClassName={"wrap-modal-download"}
                            footer={null}
                            header={null}
                            width={800}
                            title=""
                            closeIcon
                            centered
                            visible={this.state.visibleSendMail}
                            onCancel={() => {
                                this.setState({
                                    visibleSendMail: false,
                                    step3: false,
                                    step2: false,
                                    loading: false,
                                });
                            }}
                        >
                            {this.state.step3 ? (
                                <div>
                                    {this.state.loading ? (
                                        <React.Fragment>
                                            <div className={"text-center"}>
                                                <LoadingOutlined
                                                    style={{fontSize: 24, color: "white"}}
                                                    spin
                                                />
                                                <h2>WE'RE PREPARING YOUR PHOTOS</h2>

                                                <FormItem hasFeedback>
                                                    <span className="text-des">
                                                    Your will be notified by email once your download is
                                                    ready. You can also stay on this page if you prefer.
                                                  </span>
                                                </FormItem>
                                            </div>
                                        </React.Fragment>
                                    ) : (
                                        <React.Fragment>
                                            <div className="box-download">
                                                <CheckCircleOutlined
                                                    style={{fontSize: 24, color: "green"}}
                                                />
                                                <h2>YOUR PHOTOS ARE READY TO DOWNLOAD</h2>
                                                <p>Click the link below to start the download.</p>

                                                <div>
                                                    <a
                                                        className={"linkdownload"}
                                                        href={this.state.linkdownload.url}
                                                    >
                                                        {this.state.linkdownload.fileName}
                                                    </a>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    )}
                                </div>
                            ) : null}
                            {this.state.step1 ? (
                                <React.Fragment>
                                    <div className={"box-step1"}>
                                        <h2>DOWNLOAD PHOTOS</h2>

                                        <FormItem hasFeedback className={"wrap-formitem-download"}>
                                            <div className={"text-des"}>
                                                Your email will be used to notify you when the files
                                                ready for download
                                            </div>
                                            <Input
                                                type="email"
                                                value={this.state.email}
                                                onChange={(e) =>
                                                    this.setState({email: e.target.value})
                                                }
                                            />
                                        </FormItem>

                                        {this.state.isSingleDownload && this.state.urlImage && (
                                            <Button
                                                className="btn-next"
                                                type="primary"
                                                htmlType="submit"
                                                onClick={this.handleStartDownloadOneImage}
                                            >
                                                START DOWNLOAD
                                            </Button>
                                        )}

                                        {!this.state.isSingleDownload && !this.state.urlImage && (
                                            <Button
                                                className="btn-next"
                                                type="primary"
                                                htmlType="submit"
                                                disabled={!validEmail(this.state.email)}
                                                onClick={this.handleStep1}
                                            >
                                                NEXT
                                            </Button>
                                        )}
                                    </div>
                                </React.Fragment>
                            ) : null}
                            {this.state.step2 ? (
                                <React.Fragment>
                                    <div className={"step2-wrapper"}>
                                        <div className="form-photo">
                                            <h3>CHOOSE PHOTOS</h3>

                                            <Checkbox.Group
                                                style={{display: "contents"}}
                                                options={optionListCollections}
                                                defaultValue={[]}
                                                onChange={(collectionIds) => {
                                                    this.setState({collectionIds});
                                                }}
                                            />
                                        </div>
                                        <div className="form-size">
                                            <h3>CHOOSE DOWNLOAD SIZE</h3>
                                            <Radio.Group
                                                value={this.state.typeImage}
                                                onChange={this.handleChangeRadioSize}
                                            >
                                                <Radio className="color-white" value="original">
                                                    High Resolution
                                                </Radio>
                                                <Radio className="color-white" value="web_size">
                                                    Web Size
                                                </Radio>
                                            </Radio.Group>
                                        </div>
                                        <Button
                                            className="btn-next"
                                            type="primary"
                                            htmlType="submit"
                                            disabled={
                                                !Object.keys(this.state.collectionIds).length ||
                                                Object.keys(this.state.collectionIds).some(
                                                    (key) => !this.state.collectionIds[key]
                                                )
                                            }
                                            onClick={this.handleDownloadCollection}
                                        >
                                            START DOWNLOAD
                                        </Button>
                                    </div>
                                </React.Fragment>
                            ) : null}
                        </Modal>
                        <Layout>
                            <section className={"cover"}>
                                <div className={"logo-company"}>
                                    <Link to={"/"}>
                                        {" "}
                                        <img
                                            src="/images/momentfeed.png"
                                            alt=""
                                            style={{maxWidth: 250}}
                                        />
                                    </Link>
                                </div>

                                {collections.length > 0 && collections[0].images.length > 0 && (
                                    <div className='inner'>
                                        <img
                                            style={{
                                                opacity: 0,
                                                visibility: "visible",
                                                position: "absolute",
                                                zIndex: "-10",
                                                top: "-10000px",
                                            }}


                                            onLoad={this.onImgLoadCover}

                                            src={collections[0].images[0].original} alt=""/>


                                        <img

                                            style={{
                                                height:
                                                    this.state.dimensionsCover.height >= this.state.dimensionsCover.width
                                                        ? `600px`
                                                        : "auto",
                                                width: this.state.dimensionsCover.height > this.state.dimensionsCover.width ? "auto" : "100%"

                                            }}


                                            src={collections[0].images[0].original} alt=""/>

                                        <div className="info-cover">
                                            <h3>{this.state.titleGallery}</h3>

                                            <p>
                                                {" "}
                                                {moment(collections[0].collectionDate).format(
                                                    "MMM Do YYYY"
                                                )}{" "}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </section>

                            <section
                                style={{
                                    background: "#212025",
                                    padding: "30px 20px 25px 20px",
                                }}
                            >
                                <div className="wrap-menu">
                                    <div className="left-menu">
                                        <h4>{this.state.titleGallery}</h4>

                                        {collections.length > 0 && (
                                            <div className={"menu"}>
                                                {collections.map((item, i) => {
                                                    return (
                                                        <span
                                                            key={"collection" + item._id}
                                                            className={
                                                                i == this.state.currentCollection
                                                                    ? "active"
                                                                    : ""
                                                            }
                                                            onClick={(e) => {
                                                                this.setState({currentCollection: i});
                                                            }}
                                                        >
                                                              {item.collectionName}
                                                            </span>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    <div className="right-menu">
                                        {user._id && user._id === userBooking ?
                                            <div onClick={this.toggleAddCodePin}>
                                                <LockOutlined/>

                                                Pin Code
                                            </div> : null}
                                        <div onClick={this.toggleShowFavorite}>
                                            <HeartOutlined/>
                                            Favorites
                                        </div>

                                        {collections.length > 0 && (
                                            <div
                                                onClick={() =>
                                                    this.setState({
                                                        visibleSendMail: true,
                                                        step1: true,
                                                    })
                                                }
                                            >
                                                <DownloadOutlined/>
                                                Download
                                            </div>
                                        )}

                                        <div
                                            className='icon-share'
                                            onClick={() =>
                                                this.handleModalShare(
                                                    SERVER_DOMAIN + "/collections/" + this.state.bookingId
                                                )
                                            }
                                        >
                                            <ShareIcon/>
                                            Share
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <Content>
                                {this.state.visiblePreview ?
                                    <Modal
                                        style={{maxWidth: 1300}}
                                        footer={null}
                                        header={null}
                                        width={1000}
                                        wrapClassName={"wrap-modal-preview"}
                                        title=""
                                        centered
                                        visible={this.state.visiblePreview}
                                        onOk={() => this.setState({visiblePreview: false})}
                                        onCancel={() => this.setState({visiblePreview: false})}
                                    >
                                        <ImageCarousel
                                            handleClosePopup={() => this.setState({visiblePreview: false})}
                                            visiblePreview={this.state.visiblePreview}
                                            handleShare={this.handleModalShare}
                                            handleFavorite={this.handleFavorite}
                                            collections={collections}
                                            arrayLike={this.state.arrayLike}
                                            bookingId={this.state.bookingId}
                                            toggleDownloadModal={this.handleDownloadOneImage}
                                            currentCollection={this.state.currentCollection}
                                            images={collections.length > 0 &&
                                            collections[this.state.currentCollection].images
                                                .reduce((acc, element) => {
                                                    // chose the image on click and put it to the first item in array carousel
                                                    if (element.thumb === this.state.imagePreview) {
                                                        return [element, ...acc];
                                                    }
                                                    return [...acc, element];
                                                }, []).map((i, index) => ({
                                                    ...i
                                                }
                                            ))}/>
                                    </Modal> : null
                                }

                                {loading && (
                                    <Row>
                                        <Skeleton></Skeleton>
                                    </Row>
                                )}
                                {!loading && (
                                    <div>
                                        <div className={"list-masonry"}>
                                            <ResponsiveMasonry
                                                columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}
                                            >
                                                <Masonry>
                                                    {collections.length > 0 &&
                                                    collections[
                                                        this.state.currentCollection
                                                        ].images.map((image, i) => {
                                                        return (
                                                            <div
                                                                key={"list-image" + image._id}
                                                                className={"box-img pad5"}
                                                            >
                                                                <LazyImage
                                                                    src={image.thumb}
                                                                    alt=""
                                                                    handleOnClick={() => {
                                                                        this.setState({
                                                                            imagePreview: image.thumb,
                                                                            visiblePreview: true,
                                                                        });
                                                                    }}
                                                                />

                                                                <div className={"action"}>
                                                                        <span
                                                                            className={"like"}
                                                                            onClick={() =>
                                                                                this.handleFavorite(
                                                                                    image.collectionId,
                                                                                    image,
                                                                                    this.state.arrayLike.includes(
                                                                                        image._id
                                                                                    )
                                                                                )
                                                                            }
                                                                        >
                                                                          {this.state.arrayLike.includes(
                                                                              image._id
                                                                          ) ? (
                                                                              <HeartFilled/>
                                                                          ) : (
                                                                              <HeartOutlined/>
                                                                          )}
                                                                        </span>
                                                                    <span
                                                                        onClick={() =>
                                                                            this.handleDownloadOneImage(image)
                                                                        }
                                                                        className={"download"}
                                                                    >
                                      <DownloadOutlined
                                          style={{color: "white"}}
                                      />
                                    </span>

                                                                    <span
                                                                        className={"share"}
                                                                        onClick={() =>
                                                                            this.handleModalShare(
                                                                                SERVER_DOMAIN +
                                                                                "/collections/" +
                                                                                this.state.bookingId +
                                                                                "/" +
                                                                                image._id
                                                                            )
                                                                        }
                                                                    >
                                      <ShareIcon/>
                                    </span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </Masonry>
                                            </ResponsiveMasonry>

                                            {collections.length === 0 && (
                                                <div className={"text-center"}>
                                                    <br/>
                                                    Loading
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </Content>
                            <Footer/>
                        </Layout>
                    </React.Fragment>
                </div>
            ) :

            <React.Fragment>
                     <section className={"cover-pin"}>
                                <div className={"logo-company"}>
                                    <Link to={"/"}>
                                        {" "}
                                        <img
                                            src="/images/momentfeed.png"
                                            alt=""
                                            style={{maxWidth: 250,
                                            
                                     
                               
                                  
                                                position: 'absolute',
                                                left: "calc(50% - 120px)",
                                                top: 20
                                            
                                            }}
                                        />
                                    </Link>
                                </div>

                                {collections.length > 0 && collections[0].images.length > 0 && (
                                    <div className='inner' style={{

                                        backgroundImage:`url(${collections[0].images[0].original})`,


                                    }}>
                                

                                    
                                    </div>
                                )}
                            </section>
                            
                            <Modal
                wrapClassName={"wrap-modal-pin"}
                footer={null}
                header={null}
                title=""
                closeIcon
                centered
                visible={modalInputPinCode}
                maskStyle={{


                    backgroundColor: 'rgba(0, 0, 0, 0.75)'

                }}
            >
                <div className="wrap-pincode">
   
           
                    <FormItem hasFeedback className={"wrap-formitem-download"}>

                    <h3>{this.state.titleGallery}</h3>


                    <p className="p-guest">Guest Access. Enter password to view this collection.</p>

                        <Input
                            type="numeric"
                            placeholder="PIN"
                            ref={this.pinRef}
                        />

{codePinInput && codePin !== codePinInput ? <span className="error-pin" style={{color: 'red'}}>Pin Code Incorrect</span> : ""}

                    </FormItem>

                    <Button
                        className="btn-next"
                        type="primary"
                        htmlType="submit"
                       // disabled={!this.state.codePinInput || this.state.codePinInput.length < 4}
                        onClick={this.handleInputCodePin}
                    >
                        Enter
                    </Button>
                </div>
            </Modal>
            </React.Fragment>
          ;
    }
}

const mapStateToProps = (state, props) => {
    return {
        user: state.auth.user,
    };
};

export default connect(
    mapStateToProps,
    {}
)(Collection);
