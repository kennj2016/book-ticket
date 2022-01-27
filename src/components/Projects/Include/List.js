import style from './list.css'
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {
    Table,
    Icon,
    Spin,
    Row,
    Col,
    Card,
    Badge,
    Tag,
    Modal,
    Select,
    Button,
    message,
    notification,
    Popover, Input, Form
} from 'antd';
import {
    ScheduleOutlined,
    SmileOutlined,

} from '@ant-design/icons';

import {connect} from 'react-redux';
import {NOW, STATUS, UTC_OFFSET} from '../../../define'
import {
    getPhotogapherName,
    getFirstWordsOfText,
    updateUrlHttpsForImage,
    cleanSlugTitleEvent
} from '../../../utils/helper'
import moment from 'moment'
import classnames from 'classnames'
import {isMobile} from 'react-device-detect'
import {EditorState, convertToRaw, ContentState} from 'draft-js';
import {Editor} from 'react-draft-wysiwyg';
import {ReviewBooking} from '../DetailBooking'
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {
    getBookingCornerBookLater,
    getBookingCornerbookNow,
    addMorePhotographerIntoRequest,
    postBooking
} from "../../../actions/bookActions";
import Rate2 from "../../Booking/Include/Rate2";
import {BlackHeart, RedHeart} from "../../Booking/Include/ListPhotographers";
import {reloadBookings,setBookings,getBookings} from "../../../actions/projectAction";
import {SET_PROJECTS} from "../../../actions/types";
import { Slider, InputNumber } from 'antd';
import {stateToHTML} from "draft-js-export-html";
const Option = Select.Option;
const InputGroup = Input.Group;
const FormItem = Form.Item;
const RenderHTML = (props) => (<span dangerouslySetInnerHTML={{__html:props.HTML}}></span>)


class List extends Component {






    constructor(props) {
        super(props);

        this.state = {
            currentSmartMatchBooking: {},
            currentBookingAddMore: {},
            reviewBooking: {},
            addmoreBooking: {},
            morePhotographers: [],
            expandedRowKeys: [],
            photographers_request_tmp: [],


            addMorePhotographerModal: false,
            loadingPhotographer: false,
            rebook_smart_match: false,
            successRebook: false,
            loadingAddMore: false,
            visibleModalReview: false,
            currentNumberPerPageupcoming: 25,
            currentNumberPerPageprevious: 25,
            hour_from:45,
            hour_to:75,
            editHourly:false

        };
    }


    handleAddMorePhotographer = (e) => {
        this.setState({loadingAddMore:true})


        if(this.state.photographers_request_tmp.length){
            addMorePhotographerIntoRequest({

                agentIds:this.state.photographers_request_tmp,
                bookingId: this.state.addmoreBooking._id
            }).then(res=>{




                getBookings().then(res=>{
                    if (res.data.data) {
                        let {upcomingAppointment,pastAppointment} = res.data.data


                        upcomingAppointment = upcomingAppointment.map(item=>{ item.type = 'upcoming' ; return item })
                        pastAppointment = pastAppointment.map(item=>{ item.type = 'previous' ; return item })

                        let data = [...upcomingAppointment,...pastAppointment];
                        this.props.setBookings(data)
                        notification.open({
                            message: (<div><SmileOutlined /> Successfully Added Photographer(s)</div>),
                            description:
                                'This photographer has been successfully added to consider your job request. The first photographer who accepts your request will be the one confirmed for your booking.',
                            onClick: () => {

                            },
                            placement:'bottomRight',
                            duration:20
                        });


                        this.setState({

                            addMorePhotographerModal:false,
                            loadingAddMore:false,
                            photographers_request_tmp: []
                        })

                    }
                },err=>{
                    this.setState({

                        addMorePhotographerModal:false,
                        loadingAddMore:false,
                        photographers_request_tmp: []
                    })
                })




            })
        }


    }
    toggleAddPhotographerTmp = (photoId) => {


        let {photographers_request_tmp} = this.state
        let index = photographers_request_tmp.indexOf(photoId);

        if(index == -1){
            this.setState({

                photographers_request_tmp :[...photographers_request_tmp,photoId]
            })
        }else{

            photographers_request_tmp = photographers_request_tmp.filter(e=>e != photoId)

            this.setState({

                photographers_request_tmp :photographers_request_tmp
            })
        }

    }

    handleSubmitRebookSmartMatch = (e) => {
        e.preventDefault();

        console.log(this.state.currentSmartMatchBooking);
        let formData = new FormData();
        let agentIds = ['xxx-smart-match-xxx']
        formData.append('address', this.state.currentSmartMatchBooking.location);
        formData.append('agentIds', JSON.stringify(agentIds));




        formData.append('appointmentDate', moment.parseZone(this.state.currentSmartMatchBooking.appointmentDate).format('YYYY-MM-DD'));

        console.log('ss',moment.parseZone(this.state.currentSmartMatchBooking.appointmentDate).format('YYYY-MM-DD'))
        formData.append('appointmentTime', this.state.currentSmartMatchBooking.starTime);
        formData.append('appointmentEndTime', this.state.currentSmartMatchBooking.endTime);
        formData.append('agentType', this.state.currentSmartMatchBooking.agentType);
        formData.append('eventType', this.state.currentSmartMatchBooking.eventType  );
        formData.append('longitude', this.state.currentSmartMatchBooking.position[0]);
        formData.append('latitude', this.state.currentSmartMatchBooking.position[1]);
        formData.append('photoSeshNow', this.state.currentSmartMatchBooking.isPhotoSeshNow);
        formData.append('offset', this.state.currentSmartMatchBooking.offset);
        formData.append('bookingDevice', 'WEB');
        formData.append('isReschedule', false);
        formData.append('appointmentDuration', this.state.currentSmartMatchBooking.appointmentDuration );
        formData.append('previousBookingId', '');
        formData.append('paymentCardId', this.state.currentSmartMatchBooking.paymentCardId );
        formData.append('titleOrDescription',  this.state.currentSmartMatchBooking.title)
        formData.append('smart_match', true)
        formData.append('hourlyRateFrom', this.state.hour_from * this.state.currentSmartMatchBooking.appointmentDuration)
        formData.append('hourlyRateTo',  this.state.hour_to * this.state.currentSmartMatchBooking.appointmentDuration)

        this.setState({loadingRebook: true})
        console.log({formData});
        postBooking(formData).then(res => {

            this.setState({loadingRebook: false,successRebook:true})

        }).catch(err => {
            let data = err.response.data
            this.setState({loadingRebook: false})
            if (data.message == "This invitation is expired.") {
                message.error(data)
            }

        })


    }


    loadPhotographers = (booking) => {
        console.log({booking});

        let {
            appointmentDate,
            location,
            agentType,
            eventType,
            starTime,isPhotoseshNow,endTime,appointmentDuration,
            appointmentLongLat
        }= booking


        let [longitude,latitude] = appointmentLongLat

        this.setState({loadingPhotographer: true,morePhotographers:[],currentSmartMatchBooking:booking,hour_from:booking.hourlyRateFrom ? booking.hourlyRateFrom : 45,hour_to:booking.hourlyRateTo ? booking.hourlyRateTo: 75 })





        if (isPhotoseshNow) {
            let form = {  offset: UTC_OFFSET,longitude,latitude,eventType:eventType.toUpperCase(),address:location,agentType:agentType, appointmentDuration: appointmentDuration, appointmentTime:starTime, appointmentDate:moment().format('YYYY-MM-DD')}

            return getBookingCornerbookNow(form);

        } else {

            let form = { offset: UTC_OFFSET,longitude,latitude,eventType:eventType.toUpperCase(),address:location,agentType:agentType, 
                appointmentTime:starTime,appointmentEndTime:endTime, appointmentDate:moment.parseZone(appointmentDate).format('YYYY-MM-DD')}


            let msgErr = `Currently there are no photographers available for your requested job.  Consider using Smart Match where our systems along with the Concierge Team can help you secure the next available photographer for this job.`
            return getBookingCornerBookLater(form).then(res => {
                let morePhotographers = res.data.data


                console.log(res.data.data);
                let isIngroup = (id)=>{
                    return booking.groups.filter(p=>p.agentId == id).length > 0
                }
                morePhotographers = morePhotographers.filter(p1=>{
                    return !isIngroup(p1._id)
                })

                if(morePhotographers.length){
                    this.setState({loadingPhotographer: false, morePhotographers,messageLoadphotographer:''})
                }else{



                    this.setState({loadingPhotographer: false, morePhotographers,messageLoadphotographer:msgErr})
                }

            }).catch((err) => {
                this.setState({ loadingPhotographer: false,messageLoadphotographer:msgErr})
            })

        }


    }
    hideModalReview = (e) => {
        e.preventDefault();

        this.setState({visibleModalReview: false})

    }

    goTo(route) {
        this.props.history.replace(route)
    }

    render() {

        let ColColumn_first = {
            xs: {span: 24, offset: 0},
            sm: {span: 24, offset: 0},
            md: {span: 24, offset: 0},
            lg: {span: 24, offset: 0},
            xl: {span: 24, offset: 0},
        }

        let ColColumn = {
            xs: {span: 24, offset: 0},
            sm: {span: 12, offset: 0},
            md: {span: 12, offset: 0},
            lg: {span: 12, offset: 0},
            xl: {span: 12, offset: 0},
            className: style.item_wrapper
        }


        const columns = [{
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        }, {
            title: 'Start Time',
            dataIndex: 'starTime',
            key: 'starTime',
        }, {
            title: 'End Time',
            dataIndex: 'endTime',
            key: 'endTime',
        }, {
            title: 'Title / Description',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => {
                if(text){
                    let length = text.length

                    text = getFirstWordsOfText(text,100)

                    if(length > 100){
                        text+= '...'
                    }

                    return  (
                        <span
                            style={{maxWidth: 200, overflow: 'hidden', display: 'inline-block'}}
                            dangerouslySetInnerHTML={{__html: text }}
                        ></span>
                    )
                }
                return ''

            }
        }, {
            title: 'Service Location',
            dataIndex: 'location',
            key: 'location',
        },
            {
                title: 'Photographer',
                dataIndex: 'name',
                key: 'name',
            }, /*{
                title: 'Hourly Rate',
                dataIndex: 'rate',
                key: 'rate',
            }, {
                title: 'Total',
                dataIndex: 'total',
                key: 'total',
            }, {
                title: 'Saves You',
                dataIndex: 'save',
                key: 'save',
            },  */
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                render: (text, record) => {


                    let Status = () => {
                        let tmp_status = 'processing'
                        switch (record.status) {
                            case STATUS['PENDING']:
                                tmp_status = 'processing'
                                break;
                            case STATUS['ACTIVE']:
                                tmp_status = 'error'
                                break;
                            case STATUS['CANCELLED']:
                                tmp_status = 'default'
                                break;
                            case STATUS['EXPIRED']:
                                tmp_status = 'error'
                                break;
                            case STATUS['CHANGE_REJECTED']:
                                tmp_status = 'error'
                                break;
                            case STATUS['REJECTED']:
                                tmp_status = 'error'
                                break;
                            case STATUS['COMPLETED']:
                                tmp_status = 'default'
                                break;
                            case STATUS['ACCEPTED']:
                                tmp_status = 'success'
                                break;
                        }
                        return <Badge className={style.status_icon} status={tmp_status}/>

                    }


                    return (<span
                        style={{fontSize: isMobile ? 7 : 10}}>{(record.isModified && record.status == STATUS['PENDING']) ? 'CHANGE PENDING' : record.status.replace('_', ' ')}<Status/></span>)


                },
            } /*, {
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                    <span>
                  <Link to={record.link}>View Details</Link>


                        {
                            (record.status == STATUS.COMPLETED) &&
                            (
                                <div>
                                    <Tag style={{cursor: 'pointer'}} onClick={e => this.setState({visibleModalReview: true, reviewBooking: record})}
                                         color="#87d068">{record.isReviewedByUser ? 'Edit Rating' : 'Rating'}</Tag>
                                </div>

                            )
                        }


                </span>
                ),
            }*/

            ];

        let sortByStatus = (a, b) => {
            /*    let order = ['ACCEPTED','PENDING','COMPLETED','REJECTED','CANCELLED','EXPIRED'];
             return order.indexOf(a.appointmentStatus) - order.indexOf(b.appointmentStatus)*/

            //don't sort
            return null;
        }
        const listUpcomimg = this.props.bookings.filter(item => item.type == 'upcoming').sort(sortByStatus)
        const listPrevious = this.props.bookings.filter(item => item.type == 'previous').sort(sortByStatus)

        let groupBookingById = this.props.bookings.reduce((r, a) => {
            if(typeof a.agentData._id != 'undefined' ){
                r[a._id] = [...r[a._id] || [], a];
            }

            return r;
        }, {});


        console.log({groupBookingById});

        const formatDataTable = (booking) => {

            let {galleryUrl,appointmentLongLat,offset,paymentCardId,agentType,eventType,isModified, appointmentDuration, titleOrDescription, _id, uuid, appointmentAddress, agentPrice, agentSaves, appointmentEndTime, appointmentDate, appointmentStartTime, appointmentStatus} = booking


            let countPhotographers = '0 Photographers'

            if(typeof groupBookingById[booking._id] != 'undefined'){
                countPhotographers = groupBookingById[booking._id].length > 0 ? (<span style={{color:'#fb7a04'}}>{ groupBookingById[booking._id].length + ' Photographer(s)'}</span>) : getPhotogapherName(booking.agentData.name.firstName + ' ' + booking.agentData.name.lastName)

                groupBookingById[booking._id].forEach(requestBooking=>{
                    if(requestBooking.appointmentStatus == 'PENDING'){
                        appointmentStatus = 'PENDING'
                    }
                })
            }





            appointmentStatus == 'WAITING_ADMIN_ASSIGN' ? 'PENDING' : appointmentStatus

            let hourlyRateTo = booking.hourlyRateTo
            let hourlyRateFrom = booking.hourlyRateFrom

            return {
                _id: booking._id,
                key: _id + uuid,
                hourlyRateTo,
                hourlyRateFrom,
                uuid: uuid,
                galleryUrl: galleryUrl,
                position:appointmentLongLat.coordinates,
                agentData: booking.agentData,
                link: `/bookings/${booking._id + '_' + booking.agentData._id}`,
                isModified: isModified,
                date: moment.parseZone(appointmentDate).format('MMMM Do YYYY'),
                starTime: appointmentStartTime,
                paymentCardId: paymentCardId,
                offset: offset,
                endTime: appointmentEndTime,
                title: titleOrDescription,
                name:countPhotographers,
                name_: (typeof booking.agentData.name != 'undefined') ? getPhotogapherName(booking.agentData.name.firstName + ' ' + booking.agentData.name.lastName) : '',
                location: appointmentAddress,
                rate: '$' + agentPrice + '/hr',
                total: '$' + agentPrice * appointmentDuration,
                status: appointmentStatus,
                save: agentSaves + '%',
                isReviewedByUser: booking.isReviewedByUser,
                reviewByUser: booking.reviewByUser,
                isPhotoSeshNow: booking.isPhotoSeshNow,
                appointmentLongLat: booking.appointmentLongLat.coordinates,
                groups:groupBookingById[booking._id],


                appointmentDate,
                appointmentDuration,
                appointmentEndTime,
                agentType,eventType

            }
        }
        let upcomingData = listUpcomimg.map(formatDataTable).filter((thing, index, self) =>
            index === self.findIndex((t) => (
                t._id === thing._id
            ))
        )
        console.log({upcomingData});
        let previousData = listPrevious.map(formatDataTable).filter((thing, index, self) =>
            index === self.findIndex((t) => (
                t._id === thing._id
            ))
        )










        let TYPE_FILTERS = ['upcoming', 'previous']

        if (this.props.active_type == 'previous') TYPE_FILTERS = TYPE_FILTERS.reverse()

        let styleLabel = {
            background: '#ececeb',
            padding: '3px 20px',
            marginBottom: 10,
            display: 'inline-block',
            color: 'black',
            borderLeft: '5px solid #f77800'
        }
        const RenderDropdownNumberPerPage = (props) => {
            return (
                <Select defaultValue={this.state['currentNumberPerPage' + props.type]} style={{width: 120, float: 'right'}} onChange={(value) => {
                    this.setState({
                        ['currentNumberPerPage' + props.type]: parseInt(value)
                    })
                }}>
                    <Option value={25}>25</Option>
                    <Option value={50}>50</Option>
                    <Option value={10000}>ALL</Option>
                </Select>
            )
        }





        const ListWrapper = (
            <div className={'list-bookings'}>


                <Modal
                    title={!this.state.rebook_smart_match ? 'Add More Photographer' : 'Rebook Smart Match'}
                    visible={this.state.addMorePhotographerModal}
                    onOk={this.handleAddMorePhotographerModal}
                    onCancel={()=>{
                        this.setState({editHourly:false,rebook_smart_match:false,addMorePhotographerModal:false,photographers_request_tmp:[]})
                    }}
                    width={800}
                    footer={null}
                >

                    {this.state.successRebook && (
                        <div>
                            <div style={{textAlign:'center',fontSize: 80,color: '#98d23d'}}>
                                <Icon style={{color:'dark-green'}} type="check-circle" />
                            </div>

                            <div style={{textAlign:'center',margin:'30px 20px'}}>
                                Great! We'll get to work on this for you!  Keep an eye out in your inbox, junk email, or text for a confirmation when a photographer accepts your job.
                            </div>


                            <Button onClick={e=>{
                                this.setState({successRebook:false,editHourly:false,rebook_smart_match:false,addMorePhotographerModal:false,photographers_request_tmp:[]})


                                window.location = '/bookings'


                            }}>Done !</Button>
                        </div>
                    )}


                    {!this.state.successRebook && (
                        <div>

                            <div style={{maxHeight:!this.state.rebook_smart_match ? 'initial':'500px',overflow:!this.state.rebook_smart_match ? 'auto':'scroll',padding:20}}>

                                {this.state.loadingPhotographer && (
                                    <div>
                                        ... Please wait for search the best photographer
                                    </div>
                                )}
                                {!this.state.loadingPhotographer && (
                                    <div >



                                        {this.state.morePhotographers.length > 0 && (
                                            <div  style={{maxHeight:'550px',overflow:'scroll'}}>

                                                {this.state.morePhotographers.map((photo,i)=>{

                                                    return (<div>

                                                        <Card
                                                            className={'cardPhoto'}
                                                            key={i}>

                                           <span className="wrap-heart">

                                               {(this.state.photographers_request_tmp.indexOf(photo._id) != -1) ? (

                                                   <Icon onClick={(e) => this.toggleAddPhotographerTmp(photo._id)}

                                                         component={RedHeart}
                                                   />
                                               ) : (

                                                   <Icon
                                                       component={BlackHeart}
                                                       onClick={(e) => this.toggleAddPhotographerTmp(photo._id)}
                                                   />


                                               )}
                                           </span>


                                                            <div className={'avatar-left'}
                                                                 onClick={(e) => this.toggleAddPhotographerTmp(photo._id)}
                                                            >
                                                                <img src={updateUrlHttpsForImage(photo.profilePicURL.thumb)} alt=""/>

                                                                {photo.isRecommendedPhotographer && (
                                                                    <img style={{width:150}} src="/images/recommended-con.png" alt=""/>
                                                                )}
                                                            </div>

                                                            <div className={'right-card'}
                                                                 onClick={(e) => this.toggleAddPhotographerTmp(photo._id)}
                                                            >
                                                                <h2>
                                                                    {getPhotogapherName(photo.name)}



                                                                </h2>

                                                                <div>
                                                                    <Rate2 count={6} defaultValue={photo.rating}/>
                                                                </div>
                                                                <h3>

                                                                    {moment.parseZone(this.state.addmoreBooking.appointmentDate).format('MMMM Do YYYY') + ' '}
                                                                    at {photo.startingTime}</h3>


                                                                <h2>${photo.agentPrice}/hr</h2>
                                                                <h3>{photo.liveDistance} miles away</h3>
                                                            </div>

                                                        </Card>


                                                    </div>)

                                                })}

                                            </div>
                                        )}




                                        {!this.state.rebook_smart_match && !this.state.morePhotographers.length && (<div style={{padding:'40px 20px'}}>

                                            <div style={{textAlign:'center'}}>
                                                <ScheduleOutlined style={{fontSize:'50px',marginBottom:20}} />
                                            </div>

                                            <div style={{fontSize: 18}}>{this.state.messageLoadphotographer}</div>

                                        </div>)}

                                        {this.state.rebook_smart_match && (<div>

                                            <h2>APPOINTMENT INFORMATION</h2>

                                            <Row>
                                                <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                                    <label className="book-info-title" style={{
                                                        color:'#e9550f',
                                                        fontWeight:'bold'
                                                    }}>Appointment Date: </label>
                                                </Col>
                                                <Col xs={24} sm={16} md={16} lg={16} xl={16}>
                                                    {this.state.currentSmartMatchBooking.date}
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                                    <label className="book-info-title" style={{
                                                        color:'#e9550f',
                                                        fontWeight:'bold'
                                                    }}>Event Type: </label>
                                                </Col>
                                                <Col xs={24} sm={16} md={16} lg={16} xl={16}>
                                                    <span style={{ textTransform: "uppercase"}}>{cleanSlugTitleEvent(this.state.currentSmartMatchBooking.eventType)}</span>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                                    <label className="book-info-title" style={{
                                                        color:'#e9550f',
                                                        fontWeight:'bold'
                                                    }}>Appointment Time: </label>
                                                </Col>
                                                <Col xs={24} sm={16} md={16} lg={16} xl={16}>
                                                    {this.state.currentSmartMatchBooking.starTime} -
                                                    {this.state.currentSmartMatchBooking.endTime}
                                                </Col>
                                            </Row>


                                            <Row>
                                                <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                                    <label className="book-info-title" style={{
                                                        color:'#e9550f',
                                                        fontWeight:'bold'
                                                    }}>Title: </label>
                                                </Col>
                                                <Col xs={24} sm={16} md={16} lg={16} xl={16}>



                                                    <RenderHTML HTML={ this.state.currentSmartMatchBooking.title}  ></RenderHTML>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                                    <label className="book-info-title" style={{
                                                        color:'#e9550f',
                                                        fontWeight:'bold'
                                                    }}>Address: </label>
                                                </Col>
                                                <Col xs={24} sm={16} md={16} lg={16} xl={16}>
                                                    {this.state.currentSmartMatchBooking.location}
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                                    <label className="book-info-title" style={{
                                                        color:'#e9550f',
                                                        fontWeight:'bold'
                                                    }}>Duration: </label>
                                                </Col>
                                                <Col xs={24} sm={16} md={16} lg={16} xl={16}>
                                                    {this.state.currentSmartMatchBooking.appointmentDuration} hour
                                                </Col>
                                            </Row>


                                            <Row>
                                                <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                                    <label className="book-info-title" style={{
                                                        color:'#e9550f',
                                                        fontWeight:'bold'
                                                    }}>Estimated Cost: </label>
                                                </Col>
                                                <Col xs={24} sm={16} md={16} lg={16} xl={16}>



                                                    <div>
                                                        <strong> $ {this.state.hour_from * this.state.currentSmartMatchBooking.appointmentDuration} - {this.state.hour_to * this.state.currentSmartMatchBooking.appointmentDuration}</strong>

                                                        <span style={{cursor:'pointer',
                                                            color: '#fa4914',
                                                            margin: '0 10px',
                                                            fontWeight: 'bold',

                                                        }} onClick={e=>this.setState({editHourly:true})}>Edit</span>

                                                    </div>

                                                    {this.state.editHourly && (


                                                        <div>
                                                            <Row>
                                                                <Col span={6}>
                                                                    Hourly rate from
                                                                </Col>
                                                                <Col span={9}>
                                                                    <Slider
                                                                        min={35}
                                                                        max={120}
                                                                        marks={

                                                                            {
                                                                                [this.state.hour_from]:'$ '+ this.state.hour_from
                                                                            }
                                                                        }

                                                                        onChange={ value => {
                                                                            this.setState({
                                                                                hour_from: value,
                                                                            });
                                                                        }}
                                                                        value={this.state.hour_from}
                                                                    />
                                                                </Col>

                                                            </Row>
                                                            <Row>
                                                                <Col span={6}>
                                                                    Hourly rate to
                                                                </Col>
                                                                <Col span={12}>
                                                                    <Slider
                                                                        min={35}
                                                                        max={120}
                                                                        marks={

                                                                            {
                                                                                [this.state.hour_to]:'$ '+this.state.hour_to
                                                                            }
                                                                        }
                                                                        onChange={ value => {

                                                                            if(value > this.state.hour_from){
                                                                                this.setState({
                                                                                    hour_to: value,
                                                                                });
                                                                            }else{
                                                                                message.info('hourly rate to should be great than hourly rate from')
                                                                            }


                                                                        }}
                                                                        value={this.state.hour_to}
                                                                    />
                                                                </Col>

                                                            </Row>
                                                        </div>
                                                    )}


                                                </Col>
                                            </Row>

                                            <hr/>
                                            <div>
                                                <Button onClick={this.handleSubmitRebookSmartMatch} style={{float:'right'}} type={'primary'}>Submit</Button>
                                            </div>

                                        </div>)}



                                    </div>
                                )}

                            </div>
                            <div>



                                {!this.state.loadingPhotographer &&  this.state.morePhotographers.length > 0 && (
                                    <div>
                                        <hr/>
                                        <Button
                                            loading={this.state.loadingAddMore}
                                            onClick={this.handleAddMorePhotographer}
                                            type={'primary'}>

                                            Add photographer(s)

                                        </Button>
                                    </div>
                                )}
                                {!this.state.rebook_smart_match && !this.state.loadingPhotographer &&  !this.state.morePhotographers.length && (<div style={{textAlign:'center'}}>

                                    <Button
                                        style={{marginRight:10,width: 400}}
                                        type={'primary'}
                                        onClick={e=>{
                                            this.setState({photographers_request_tmp:[], rebook_smart_match:true})


                                        }}>Smart Match</Button>

                                    <Button onClick={e=>{
                                        this.setState({successRebook:false,editHourly:false,rebook_smart_match:false,addMorePhotographerModal:false,photographers_request_tmp:[]})

                                    }}>Cancel</Button>

                                </div>)}

                            </div>

                        </div>
                    )}






                </Modal>

                <Modal
                    title={this.state.reviewBooking.isReviewedByUser ? "Edit Rating" : "Rating"}
                    visible={this.state.visibleModalReview}
                    onOk={this.hideModalReview}
                    onCancel={this.hideModalReview}
                    width={500}
                    footer={null}
                >

                    <ReviewBooking booking={this.state.reviewBooking}/>


                </Modal>


                <Row>
                    <Col {...ColColumn_first}>
                        <Card className={classnames(style.first_item, 'firstitem')}>
                            <h2><Link className={style.new_project_text} to={'/book'}>New PhotoSesh</Link></h2>
                            <Link className={style.icon_wrapper} to={'/book'}><Icon type="plus"/></Link>
                            <Link to={'/book'} className={style.item_btn}>E-Z BOOK</Link>
                            <Link to={'/advanced'} className={style.item_btn}>Advanced</Link>
                        </Card>
                    </Col>

                </Row>

                {(this.props.loading) ? (<div style={{textAlign: 'center', padding: '100px 0'}}><Spin/></div>) : ''}
                {TYPE_FILTERS.map(type => {
                        return (
                            <Row key={type}>
                                <h3><span style={styleLabel}>{type.toUpperCase()}</span></h3>


                                <div style={{width: '100%', overflow: 'hidden', paddingBottom: 10}}>
                                    <RenderDropdownNumberPerPage type={type}/>
                                </div>

                               
                                <Table
                                    class={'list-table-booking'}
                                    rowClassName={record => typeof record.groups == 'undefined'  ? 'hide-expand-icon' : ''}
                                    onRow={(record, rowIndex) => {
                                        return {
                                            onClick: event => {
                                                console.log(record.key);


                                                let {expandedRowKeys} = this.state
                                                let index = expandedRowKeys.indexOf(record.key);
                                                console.log({expandedRowKeys});
                                                console.log({index});
                                                if(index == -1){
                                                    this.setState({

                                                        expandedRowKeys :[...expandedRowKeys,record.key]
                                                    })
                                                }else{

                                                    expandedRowKeys = expandedRowKeys.splice(index+1,1)

                                                    this.setState({

                                                        expandedRowKeys :expandedRowKeys
                                                    })
                                                }


                                            }

                                        };
                                    }}

                                    locale={{
                                        emptyText: (
                                            <strong style={{color: '#403f3f', fontSize: '1.3em'}}>No {type} bookings
                                                found.</strong>)
                                    }}

                                    onExpandedRowsChange={expandedRows=>{
                                        this.setState({
                                            expandedRowKeys:expandedRows
                                        })
                                        console.log(expandedRows);
                                    }}
                                    expandedRowKeys={this.state.expandedRowKeys}
                                    expandedRowRender={record => {


                                        console.log({record});

                                        let shouldShowAddMore = false

                                        if(typeof record.groups != 'undefined' && record.groups.length){
                                              record.groups.forEach(requestBooking=>{
                                            if(requestBooking.appointmentStatus == 'PENDING'){
                                                shouldShowAddMore = true
                                            }
                                        })
                                        }
                                      



                                        return  typeof record.groups == 'undefined' ? null: (

                                            <div style={{ margin: 0 }}>

                                                <table>
                                                    <thead>
                                                    <tr>
                                                        <th></th>
                                                        <th>Photographer Name</th>
                                                        <th>Hourly Rate</th>
                                                        <th>Total</th>

                                                        <th>Saves You</th>
                                                        <th>Status</th>
                                                        <th>Action</th>
                                                    </tr>

                                                    </thead>
                                                    <tbody>
                                                    {typeof record.groups != 'undefined' && record.groups.map(booking=>{

                                                        if(typeof booking.agentData._id == 'undefined')
                                                        {
                                                            return null
                                                        }
                                                        return (
                                                            <tr key={'addingphotographer'+booking.agentData._id }>
                                                                <td><img style={{borderRadius:'50%'}} width={50} src={booking.agentData.profilePicURL.thumb} alt=""/></td>
                                                                <td>  {getPhotogapherName(booking.agentData.name.firstName + ' ' + booking.agentData.name.lastName)}</td>
                                                                <td>  {'$' + booking.agentPrice + '/hr'}</td>

                                                                <td>{'$' + booking.agentPrice * booking.appointmentDuration}</td>
                                                                <td>{booking.agentSaves + '%'}</td>
                                                                <td>

                                                                    {
                                                                        booking.appointmentStatus
                                                                    }
                                                                </td>
                                                                <td>

                                                                    <div>
                                                                        <Button style={{marginBottom:5}} type={'primary'}><Link to={`/bookings/${booking._id + '_' + booking.agentData._id}`}>Details</Link></Button>
                                                                    </div>


                                                                    {booking.appointmentStatus == STATUS['COMPLETED'] && (
                                                                        <div>

                                                                            {booking.collections.length > 0 && (

                                                                                <Link to={`/collections?bookingId=${booking._id}`}>
                                                                                    <Button type={'primary'}>Gallery</Button>

                                                                                </Link>

                                                                               )}
                                                                            {booking.collections.length == 0 && (<span className={'grayBtn'} >Gallery</span>)}

                                                                        </div>

                                                                    )}


                                                                </td>
                                                            </tr>
                                                        )




                                                    })}
                                                    </tbody>


                                                </table>

                                                {shouldShowAddMore && (
                                                    <Button

                                                        style={{margin:'10px 0'}}
                                                        type={'primary'}
                                                        onClick={e=>{
                                                            this.setState({addMorePhotographerModal:true,addmoreBooking:record})


                                                            this.loadPhotographers(record)

                                                        }}>Add More</Button>
                                                )}




                                            </div>
                                        )


                                    }}

                                    columns={columns}
                                    style={{width: '100%'}}
                                    dataSource={eval(type + 'Data')}
                                    pagination={{
                                        pageSize: this.state['currentNumberPerPage' + type]
                                    }}

                                />

                            </Row>
                        )
                    }
                )}

            </div>
        )


        return ListWrapper


    }

}

const mapStateToProps = (state) => {

    let active_status = state.projects.active_status
    return {
        user:state.auth.user,
        active_type: state.projects.active_type,
        bookings: (active_status == STATUS['ALL']) ? state.projects.bookings : state.projects.bookings.filter(booking => booking.appointmentStatus == active_status)
    }
}


export default connect(mapStateToProps, {setBookings})(List)

