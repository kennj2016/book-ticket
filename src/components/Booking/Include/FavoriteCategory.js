import React, {useEffect, useState} from 'react';
import {CheckCircleOutlined, DoubleLeftOutlined, DownloadOutlined, HeartFilled, HeartOutlined, LoadingOutlined, ShareAltOutlined} from "@ant-design/icons";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
import {getImageByCategory} from "../../../actions/bookActions";
import qs from "qs";
import {withRouter} from 'react-router-dom';
import {downloadCollectionBooking, unlikeImageCollectionBooking} from "../../../actions/userActions";
import {Button, Input, Modal, Form, notification} from "antd";
import {startPusherNotificationWithSessionId} from "../../../HandleNotification";
import {EmailIcon, EmailShareButton, FacebookIcon, FacebookShareButton, PinterestIcon, PinterestShareButton, TwitterIcon, TwitterShareButton} from "react-share";

const SERVER_DOMAIN = process.env.API_URL.split("/api/v1").shift();

const FormItem = Form.Item;
const FavoriteCategory = (props) => {
    const [arrayLike, setArrayLike] = useState([]);
    const [images, setImages] = useState([]);
    const [email, setEmail] = useState(null);
    const [urlImage, setUrlImage] = useState(null);
    const [linkdownload, setLinkdownload] = useState(null);
    const [loading, setLoading] = useState(false);
    const [step2, setStep2] = useState(false);
    const [visibleShare, setVisibleShare] = useState(false);
    const [urlShare, setUrlShare] = useState("");
    const [visibleDownload, setVisibleDownload] = useState(false);
    useEffect(() => {
        let queryObject = qs.parse(props.location.search, {
            ignoreQueryPrefix: true,
        });
        if (
            Object.keys(queryObject).length &&
            typeof queryObject.collectionId != "undefined" &&
            queryObject.collectionId
        ) {
            let query = {
                collectionId: queryObject.collectionId,
                category: queryObject.cate
            }
            getImageByCategory(query).then(res => {
                if (res.data.length) {
                    setImages(res.data[0].collectionId.images.filter(item => res.data[0].array_like.includes(item._id)));
                    setArrayLike(res.data[0].array_like);
                }
            })
        }
    }, []);
    const handleFavorite = (imageId, isLike) => {
        let queryObject = qs.parse(props.location.search, {
            ignoreQueryPrefix: true,
        });
        let data = {
            collectionId: queryObject.collectionId,
            imageId,
            email: localStorage.getItem('email'),
            category: queryObject.cate
        };
        let query = {
            collectionId: queryObject.collectionId,
            email: localStorage.getItem('email'),
            category: queryObject.cate
        }
        unlikeImageCollectionBooking(data).then((res) => {
            if (res.data.statusCode === 200) {
                getImageByCategory(query).then(res => {
                    if (res.data.length) {
                        setImages(res.data[0].collectionId.images.filter(item => res.data[0].array_like.includes(item._id)));
                        setArrayLike(res.data[0].array_like);
                    }
                });
                notification.config({
                    placement: 'topRight',
                    bottom: 50,
                    duration: 3,
                    rtl: true,
                });

                notification['success']({
                    message: "Favorite",
                    description: `Removed from ${queryObject.cate} `,
                });
            }
        });

    }

    const handleDownloadCollection = () => {
        let queryObject = qs.parse(props.location.search, {
            ignoreQueryPrefix: true,
        });

        let dataPost = {
            bookingId: queryObject.bookingId,
            email: localStorage.getItem('email'),
            typeImage: "original",
            urlImage: urlImage,
        };

        downloadCollectionBooking(dataPost).then((res) => {
            setLoading(true);
            setStep2(true);
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
                setLinkdownload(data);
                setLoading(false);
            });
        });
    }
    const handleModalShare = (url) => {
        setVisibleShare(true);
        setUrlShare(url);
    };
    return (
        <div id="collection-page">
            {visibleShare ?
                <Modal
                    wrapClassName={"wrap-modal-download"}
                    footer={null}
                    header={null}
                    width={400}
                    title=""
                    closeIcon
                    centered
                    visible={visibleShare}
                    onCancel={() =>
                        setVisibleShare(false)
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
                                    onClick={() => navigator.clipboard.writeText(urlShare)}
                                    className="btn-copy"
                                >
                                    COPY
                                </Button>
                            }
                            value={`${urlShare.slice(0, 30)}...`}
                            disabled
                            className="input-copy"
                        />
                    </Form.Item>
                    <br/>
                    <div className="share-wrapper">
                        <FacebookShareButton url={urlShare}>
                            <FacebookIcon size={32} className="border-radius-5"/>
                            <br/>
                            Facebook
                        </FacebookShareButton>
                        <TwitterShareButton url={urlShare}>
                            <TwitterIcon size={32} className="border-radius-5"/>
                            <br/>
                            Twitter
                        </TwitterShareButton>
                        <PinterestShareButton media={urlShare} url={urlShare}>
                            <PinterestIcon size={32} className="border-radius-5"/>
                            <br/>
                            Pinterest
                        </PinterestShareButton>
                        <EmailShareButton url={urlShare}>
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
                visible={visibleDownload}
                onCancel={() => {
                    setStep2(false);
                    setVisibleDownload(false);
                }}
            >
                <React.Fragment>

                    {step2 ? (
                        <div>
                            {loading ? (
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
                                                href={linkdownload.url}
                                            >
                                                {linkdownload.fileName}
                                            </a>
                                        </div>
                                    </div>
                                </React.Fragment>
                            )}
                        </div>
                    ) : <div className={"box-step1"}>
                        <h2>DOWNLOAD PHOTOS</h2>

                        <FormItem hasFeedback className={"wrap-formitem-download"}>
                            <div className={"text-des"}>
                                Your mail will be used to notify you when the files
                                ready for download
                            </div>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                            />
                        </FormItem>

                        <Button
                            className="btn-next"
                            type="primary"
                            htmlType="submit"
                            onClick={handleDownloadCollection}
                        >
                            START DOWNLOAD
                        </Button>
                    </div>}
                </React.Fragment>
            </Modal>
            <div className="favorite-wrapper">
                <h2><DoubleLeftOutlined style={{cursor: 'pointer'}} onClick={() => {
                    console.log (1);
                    let queryObject = qs.parse(props.location.search, {
                        ignoreQueryPrefix: true,
                    });
                    props.history.push(`/collections/category?bookingId=${queryObject.bookingId}`)
                }}/> FAVORITES</h2>
                <span>Curated by <strong>{localStorage.getItem("email")}</strong></span>
                <span className="icon-shared" title="Share Category">
                    <ShareAltOutlined
                      onClick={() => {
                        let queryObject = qs.parse(props.location.search, {
                          ignoreQueryPrefix: true,
                        });
                        handleModalShare(SERVER_DOMAIN +
                          "/collections/favorite/" +
                          queryObject.bookingId +
                          "/" +
                          queryObject.collectionId +
                          "/" +
                          queryObject.cate
                        )
                      }}
                    />
                </span>
                <div className="list-masonry">
                    <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}>
                        <Masonry>
                            {
                                images.length ? images.map((item, i) => {
                                    return <div
                                        key={i}
                                        className={"box-img pad5"}
                                        style={{marginRight: 10}}
                                    >
                                        <img src={item.thumb}/>
                                        <section className={"favorite-action"}>
                                                  <span
                                                      onClick={() => {
                                                          setVisibleDownload(true);
                                                          setUrlImage(item.thumb);
                                                      }}
                                                      className={"download"}
                                                  >
                                                    <DownloadOutlined style={{color: "white"}}/>
                                                  </span>

                                            <span
                                                className={"like"}
                                                onClick={() => {
                                                    handleFavorite(item._id)
                                                }}
                                            >
                                                        {arrayLike.includes(item._id) ? (
                                                            <HeartFilled/>
                                                        ) : (
                                                            <HeartOutlined/>
                                                        )}
                                                      </span>

                                                        <span
                                                            className="share"
                                                            onClick={() => {
                                                                let queryObject = qs.parse(props.location.search, {
                                                                    ignoreQueryPrefix: true,
                                                                });
                                                                handleModalShare(SERVER_DOMAIN +
                                                                    "/collections/favorite/" +
                                                                    queryObject.bookingId +
                                                                    "/" +
                                                                    queryObject.collectionId +
                                                                    "/" +
                                                                    queryObject.cate +
                                                                    "/" +
                                                                    item._id
                                                                )
                                                            }}
                                                        >
                                                        <ShareAltOutlined/>
                                                      </span>
                                        </section>
                                    </div>
                                }) : null
                            }
                        </Masonry>
                    </ResponsiveMasonry>
                </div>
            </div>
        </div>

    );
};

export default withRouter(FavoriteCategory);
