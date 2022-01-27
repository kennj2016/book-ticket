import React, {Component} from 'react'
import {Alert, Card, Col, Icon, Input, Layout, Popover, Row, Spin} from 'antd';
import {connect} from 'react-redux'
import classnames from 'classnames'
import {Link} from 'react-router-dom'
import {LATER, NO_FOUND_PHOTOGRAPHERS, NOW, UTC_OFFSET} from '../../../define'
import {getPhotogapherName, getTimeForBookNow, updateUrlHttpsForImage} from '../../../utils/helper'
import {
    getBookingCornerBookLater,
    getBookingCornerbookNow,
    initSetPhotographerForRequest,
    setCurrentStep,
    setDataBooking,
    setPhotographerForRequest,
    setPhotographers,
    setSmartMatch,
    getSmartMatchIconSetting

} from '../../../actions/bookActions'
import moment from 'moment'
import style from './list_photographers.css'
import ChangeDateTime from './FormDateTime'
import Rate2 from './Rate2'
import {isMobile} from 'react-device-detect'
import Slider from "react-slick";
import {NavigateMobile} from '../ProcessStep'

const {Header} = Layout;


class PhotographerList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,
            loading: false,
            photographers: [],
            searchKeyword: '',
            slideIndex: 0,
            current: 0,
        };
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);


    }


    searchPhotographer(e) {
        this.setState({searchKeyword: e.target.value})

    }

    next() {
        this.slider.slickNext();

    }

    previous() {
        this.slider.slickPrev();

    }


    goTo(route) {
        this.props.history.replace(route)
    }

    handleNext(e) {
        e.preventDefault()
        this.props.setCurrentStep(4)
        this.goTo('/book/booking-review')
    }

    handleSelectPhotographer(e, id) {
        this.props.setPhotographerForRequest(id)
    }


    getPhotographers(props) {

        let {duration, date, from, to, photosesh_type_name, photosesh_event_type, place, position} = props.bookinfo.info
        let {lat, lng} = position;
        let {book_type} = props.bookinfo
        let appointmentEndTime = to;
        let appointmentTime = (book_type == NOW) ? getTimeForBookNow() : from;
        let appointmentDate = (book_type == NOW) ? moment().format('YYYY-MM-DD') : moment(date).format('YYYY-MM-DD');


        let baseForm = {
            address: place,
            agentType: photosesh_type_name,
            eventType: photosesh_event_type.toUpperCase(),
            latitude: lat,
            longitude: lng,
            offset: UTC_OFFSET,
        }

        if (book_type == NOW) {
            let form = {...baseForm, appointmentDuration: duration, appointmentTime, appointmentDate}
            return getBookingCornerbookNow(form);

        } else {

            let form = {...baseForm, appointmentTime, appointmentDate, appointmentEndTime}
            return getBookingCornerBookLater(form)

        }
    }

    handleSmartMatch = ()=> {

        let {photographers} = this.state
        let allPhotographer = photographers.filter(p=>p.liveDistance < 35)


        let likePhotographers = allPhotographer.filter(photographer=>photographer.liveDistance <= 20 && photographer.rating >= 5)

        /*
         * set photographer request after reload
         *
         * */

        console.log({likePhotographers});

        let idsLikePhotographers = likePhotographers.map(item=> item._id )

        if(likePhotographers.length < 5 || this.props.photographers_request.length > 5 ){
            this.props.setSmartMatch(true)
            this.props.setCurrentStep(4)
            this.goTo('/book/booking-review')
        }else{
            idsLikePhotographers.forEach((id,index) => {
                if(this.props.photographers_request.indexOf(id) == -1 && index < 10)
                {
                    this.props.setPhotographerForRequest(id)
                }
            })
            this.props.setSmartMatch(true)
            this.props.setCurrentStep(4)
            this.goTo('/book/booking-review')

        }

    }
    componentWillMount() {

        this.props.setSmartMatch(false)
        this.props.setCurrentStep(3)

    }

    sortPhotographer= (array)=>{
        return array.sort(function (a, b) {



            let a_r = a.isRecommendedPhotographer ? 1: 0
            let b_r = b.isRecommendedPhotographer ? 1: 0




            if(a.liveDistance < 30){
                return  b_r - a_r ;
            }
            return 0;

        })

       /* return array.sort(function (a, b) {

            var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
            if (nameA < nameB) //sort string ascending
                return -1;
            if (nameA > nameB)
                return 1;
            return 0; //default return value (no sorting)
        })
            .sort((a, b) => a.liveDistance - b.liveDistance)
            .sort(function (a, b) {



                let a_r = a.isRecommendedPhotographer ? 1: 0
                let b_r = b.isRecommendedPhotographer ? 1: 0




                if(a.liveDistance < 30){
                    return  b_r - a_r ;
                }
                return 0;

            })*/
    }

    componentWillReceiveProps(props) {

        console.log({props});
        if (props.bookinfo.photographers.length > 0 && props.photographers_request.length == 0) {
            let photographers = this.sortPhotographer(props.bookinfo.photographers)
            this.setState({has_error: false, photographers})
        }
    }


    componentDidMount() {

        getSmartMatchIconSetting().then(res => {
            if (res.data.statusCode === 200) {
                const {data} = res.data;
                this.setState({smartIconTitle: data.smart_match_icon_title, smartIconText: data.smart_match_icon_text});
            }
        }).catch(err => console.log(err));


        if (!this.props.photographers.length) {
            this.setState({loading: true})
            this.props.setPhotographers([])
            this.getPhotographers(this.props).then(res => {
                let photographers = res.data.data

                photographers = this.sortPhotographer(photographers)

                this.props.photographers_request.forEach(id => {
                    if (photographers.filter(p => p._id == id).length == 0) {
                        this.props.setPhotographerForRequest(id)
                    }
                })

                this.props.setPhotographers(photographers)

                let xxx = this.props.favoritePhotographers.filter(id => photographers.filter(p => p._id == id).length > 0)
                this.props.initSetPhotographerForRequest(xxx)




                this.setState({loading: false, photographers})
            }).catch((err) => {

                console.log(err);
                this.props.initSetPhotographerForRequest([])
                this.setState({has_error: true, loading: false})
            })
        } else {


            let photographers = this.props.photographers
            photographers = this.sortPhotographer(photographers)
            this.props.photographers_request.forEach(id => {
                if (photographers.filter(p => p._id == id).length == 0) {
                    this.props.setPhotographerForRequest(id)
                }
            })

            this.setState({loading: false, photographers})

        }


    }

    render() {

        const {photographers, searchKeyword, slideIndex, current} = this.state;

        let photographerLiked = []


        if (this.props.photographers_request.length >= (isMobile ? 4 : 6)) {
            photographerLiked = [...this.props.photographers_request]
        } else {
            let tmp = []
            for (let i = 1; i <= (isMobile ? 4 : 6) - this.props.photographers_request.length; i++) {
                tmp.push('no-avatar');
            }

            photographerLiked = [...this.props.photographers_request, ...tmp]

        }


        const settings = {
            dots: false,
            infinite: false,
            speed: 500,
            draggable: this.props.photographers_request.length <= (isMobile ? 4 : 6) ? false : true,
            slidesToShow: isMobile ? 4 : 6,
            slidesToScroll: isMobile ? 4 : 6,
            beforeChange: (current, next) => this.setState({slideIndex: next, current})
        };


        let photographersFilter = photographers.filter(photographer => {
            let name = photographer.name.toLowerCase();
            return name.indexOf(searchKeyword) != -1;
        })


        let needShowChangeDateForm = this.state.has_error && this.props.book_type == LATER


        return (

            <div className={classnames("photosesh-type", needShowChangeDateForm ? 'needShowChangeDateForm' : '')} id="list_photographers" style={{padding: 10}}>

                <NavigateMobile  {...this.props}/>

                <ul className="menu_simple">
                    <li>List Photographers</li>
                    |
                    <li><Link to={'/book/need-a-photosesh'}> Back </Link></li>
                    |
                    <li><Link to={'/book/photosesh-type'}>PhotoSesh Type</Link></li>
                    |
                    <li><Link to={'/book/'}>Select Another address</Link></li>
                </ul>


                {
                    (photographerLiked.length > 0) && (

                        <div className={classnames(style.box_favorite_photographer_liked, 'sticky')} style={{top: 37}}>
                            <div>
                                <div>

                                    <div className={classnames(style.box_favorite_photographer_liked_header)}>
                                        <span>  <Icon component={RedHeart}/>Favorite Photographers</span>
                                    </div>
                                    <div className={classnames(style.wrap_favorite_list)}>


                                        <div
                                            className={classnames("wrap-slider", slideIndex == (isMobile ? 4 : 6) && (photographerLiked.length != (isMobile ? 4 : 6)) ? "cut-left" : "", slideIndex == 0 && (photographerLiked.length != (isMobile ? 4 : 6)) ? 'cut-right' : '')}>
                                            <Slider ref={c => (this.slider = c)} {...settings}>
                                                {photographerLiked.map((photographer_id, i) => {

                                                    if (photographer_id == 'no-avatar') {
                                                        return (
                                                            <div key={'slider-no-avatar-' + photographer_id}>
                                                                <a className="viewprofile-label" style={{opacity: 0}}>
                                                                    View Profile
                                                                </a>
                                                                <div className="box-1-1 ">
                                                                    <div className="content">
                                                                        <img style={{width: "100%", height: "100%"}} src={'/images/no-image.jpeg'} alt=""/>
                                                                    </div>
                                                                </div>

                                                                <div className={'name-box'} style={{opacity: 0, display: isMobile ? 'none' : ''}}>
                                                                    <div><strong>no-avatar</strong></div>
                                                                    <span>Remove</span>
                                                                </div>
                                                            </div>
                                                        )
                                                    } else {
                                                        let photo = this.state.photographers.find(p => p._id == photographer_id)

                                                        if (typeof photo == 'undefined') {
                                                            return null;
                                                        } else {
                                                            return (
                                                                <div key={'key-slider-' + photo._id}>
                                                                    <Link className="viewprofile-label" to={'/book/photographers/' + photo._id}>
                                                                        View Profile
                                                                    </Link>

                                                                    <div className="box-1-1 ">
                                                                        <div className="content">
                                                                            <img style={{width: "100%", height: "100%"}} src={updateUrlHttpsForImage(photo.profilePicURL.thumb)} alt=""/>
                                                                        </div>
                                                                    </div>


                                                                    <div>

                                                                        <div>
                                                                            <Link className="viewprofile-label-name" to={'/book/photographers/' + photo._id}>
                                                                                <strong>{getPhotogapherName(photo.name)}</strong>
                                                                            </Link>


                                                                        </div>
                                                                        <span style={{cursor: 'pointer', color: 'red'}} onClick={(e) => this.handleSelectPhotographer(e, photo._id)}>Remove</span>
                                                                    </div>

                                                                </div>
                                                            )
                                                        }


                                                    }


                                                })}

                                            </Slider>
                                        </div>


                                        {this.props.photographers_request.length > (isMobile ? 4 : 6) && (
                                            <div className="control-slide" style={{textAlign: "center"}}>
                                                <Icon className="left" onClick={this.previous} type="left-circle"/>
                                                <Icon className="right" onClick={this.next} type="right-circle"/>
                                            </div>
                                        )}

                                    </div>


                                </div>
                            </div>


                            <div style={{

                                textAlign: "center",
                                padding: "20px 0 0px 0"


                            }}>
                                <Input style={{maxWidth: 400}} placeholder="Search by name" onChange={(e) => this.searchPhotographer(e)}/>
                            </div>

                        </div>

                    )
                }


                <div className={'text-center smartmatch'}>

                    <h2>Want us to find you a photographer?</h2>
                    <h2>Try Smart Match!</h2>

                    { !this.state.loading && (
                        <div onClick={this.handleSmartMatch}><img src="/images/button-light.png" alt=""/>

                            <Popover content={(<div> {this.state.smartIconText}</div>)} title={this.state.smartIconTitle}>
                                                             <span className="icon-info">
                                                            <img  src="/images/icon_info_blue.png" alt="" />
                                                        </span>
                            </Popover>
                        </div>
                    )}


                </div>
                <h2 className={'text-center'}>or choose your own</h2>
                <h2 className="head-title-center">
                    "Like" Your Favorite Photographers
                </h2>
                <p
                    style={{
                        maxWidth: 600,
                        textAlign: 'center',
                        margin: '0 auto',
                        marginBottom: 20,
                        display: needShowChangeDateForm ? 'none' : ''
                    }}
                >
                    Request 3 or more of your favorite photographers and the first one to accept will shoot your PhotoSesh. The more you include in your request, the faster you'll secure your
                    photographer.

                </p>


                {this.state.has_error && (
                    <Row>


                        <Col xs={{span: 24, offset: 0}} sm={{span: 18, offset: 3}} md={{span: 18, offset: 3}}>
                            <Alert style={{
                                textAlign: 'center',
                                padding: '50px 10px',
                                fontSize: 15,
                                marginTop: 20
                            }} message={NO_FOUND_PHOTOGRAPHERS} type="info"/>

                            {(this.props.book_type == LATER) && <ChangeDateTime style={{
                                maxWidth: 300,
                                margin: '50px auto'
                            }}/>}
                        </Col>
                    </Row>
                )}


                <Row>
                    {this.state.loading && (<div style={{textAlign: 'center'}}><Spin/></div>)}
                </Row>

                {(this.state.photographers.length > 0) && (

                    <Row>

                        <div>

                            {
                                (this.state.photographers.length > 4) && (
                                    <a className={classnames(style.btn_next_sticky, (this.props.photographers_request.length) ? '' : 'disabled')}
                                       onClick={(e) => this.handleNext(e)}>Next </a>
                                )
                            }


                        </div>

                        <Col xs={{span: 24, offset: 0}} sm={{span: 20, offset: 2}} md={{span: 18, offset: 3}}
                             lg={{span: 20, offset: 2}} xl={{span: 16, offset: 4}}
                        >

                            {photographersFilter.map((photo, i) => {


                                return (
                                    <Card
                                        className={classnames(style.card, 'card-pgr')}
                                        key={i}>

                                           <span className="wrap-heart">

                                               {(this.props.photographers_request.indexOf(photo._id) != -1) ? (

                                                   <Icon onClick={(e) => this.handleSelectPhotographer(e, photo._id)}

                                                         component={RedHeart}
                                                   />
                                               ) : (

                                                   <Icon
                                                       component={BlackHeart}
                                                       onClick={(e) => this.handleSelectPhotographer(e, photo._id)}
                                                   />


                                               )}
                                           </span>


                                        <div className={style.thumbnail}
                                             onClick={(e) => this.goTo('/book/photographers/' + photo._id)}
                                        >
                                            <img src={updateUrlHttpsForImage(photo.profilePicURL.thumb)} alt=""/>


                                        </div>

                                        <div className={style.right_info}
                                             onClick={(e) => this.goTo('/book/photographers/' + photo._id)}
                                        >
                                            <h2>{getPhotogapherName(photo.name)}


                                                {photo.isRecommendedPhotographer && (
                                                    <img src="/images/recommended-con.png" alt="" className={style.recommended_img}/>
                                                )}
                                            </h2>

                                            <div>
                                                <Rate2 count={6} defaultValue={photo.rating}/>
                                            </div>
                                            <h3>{moment(this.props.bookinfo.info.date).format('MMMM Do YYYY') + ' '}
                                                at {photo.startingTime}</h3>


                                            <h2>${photo.agentPrice}/hr</h2>
                                            <h3>{photo.liveDistance} miles away</h3>
                                        </div>





                                        <Link to={'/book/photographers/' + photo._id}
                                              className={style.button_view_profile}>View Profile</Link>

                                    </Card>

                                )
                            })
                            }
                        </Col>

                        <Col xs={{span: 24, offset: 0}} sm={{span: 20, offset: 2}} md={{span: 18, offset: 3}}
                             lg={{span: 14, offset: 5}} xl={{span: 10, offset: 7}}
                             style={{marginBottom: 30}}
                        >
                            <a className={classnames(style.btn_next, (this.props.photographers_request.length) ? '' : 'disabled')}
                               onClick={(e) => this.handleNext(e)}>Next </a>
                        </Col>
                    </Row>
                )}


            </div>

        )


    }

}

const mapStateToProps = (state) => {
    return {
        bookinfo: state.bookinfo,
        book_type: state.bookinfo.book_type,
        photographers_request: state.bookinfo.info.photographers_request,
        photographers: state.bookinfo.photographers,
        isAuthenticated: state.auth.isAuthenticated,
        favoritePhotographers: state.auth.user.favoritePhotographers
    }
}


export const RedHeart = () => (
    <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
        <path
            fill="#de1414"
            d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z"

        >

        </path>
        <path
            fill="red"
            d="M679.7 201c-73.1 0-136.5 40.8-167.7 100.4C480.8 241.8 417.4 201 344.3 201c-104 0-188.3 82.6-188.3 184.5 0 201.2 356 429.3 356 429.3s356-228.1 356-429.3C868 283.6 783.7 201 679.7 201z"

        >
        </path>
    </svg>
)
export const BlackHeart = () => (
    <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
        <path
            fill="#cccccc"
            d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z"

        >

        </path>
        <path

            fill="#d8d7d7"
            d="M679.7 201c-73.1 0-136.5 40.8-167.7 100.4C480.8 241.8 417.4 201 344.3 201c-104 0-188.3 82.6-188.3 184.5 0 201.2 356 429.3 356 429.3s356-228.1 356-429.3C868 283.6 783.7 201 679.7 201z"

        >
        </path>
    </svg>
)

export default connect(mapStateToProps, {setPhotographers, setPhotographerForRequest, setDataBooking, initSetPhotographerForRequest, setCurrentStep,setSmartMatch})(PhotographerList)
