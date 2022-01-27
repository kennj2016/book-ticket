/* global google */
import style from  './Include/edit_booking.css'
import React,{Component} from 'react'
import {connect} from 'react-redux';
import EditBookingForm from './Include/EditBookingForm';
import {Row, Col, Button,Modal,Rate,Form,Input,Tag,Avatar} from 'antd';
import {Route,Link} from 'react-router-dom'
import {cleanSlugTitleEvent,formatMoney,getPhotogapherName} from '../../utils/helper'
import moment from 'moment'
import UpdateCard from './Include/UpdateCard'
import {getCards} from '../../actions/paymentActions'
import {reviewBooking} from '../../actions/projectAction'
import Rate2 from '../Booking/Include/Rate2.js'
import {STATUS,TIME,UTC_OFFSET} from '../../define'

const FormItem = Form.Item;
const { TextArea } = Input;

const { compose, withProps, lifecycle } = require("recompose");
const {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    DirectionsRenderer,
} = require("react-google-maps");



class DetailBooking extends Component{
    constructor(props) {
        super(props);
        this.state = {
            booking: {
                agentName: {}
            },
            visibleModalCard:false,
            visibleModalReview:false,
            mapVisible:false
        };
    }

    setMapVisible(mapVisible) {
        this.setState({ mapVisible });
    }

    popupSelectCard = (e) => {
        e.preventDefault();

        this.setState({visibleModalCard:true})
    }

    hideModal = (e) => {
        e.preventDefault();

        this.setState({visibleModalCard:false})

    }
    hideModalReview = (e) => {
        e.preventDefault();

        this.setState({visibleModalReview:false})

    }

    componentWillReceiveProps(newProps){
        this.setState({booking:newProps.booking})
    }

    componentWillMount(){

        if(!this.props.booking){
            this.props.history.replace('/')
        }
        this.props.getCards()
    }

    render() {

        let {booking} = this.state;



        if(typeof booking.agentData !='undefined'){
            let photographer = booking.agentData,
                [agent_long,agent_lat] = (typeof photographer.currentLocation != 'undefined') ? photographer.currentLocation.coordinates : [],
                [booking_lng,booking_lat] = booking.appointmentLongLat.coordinates;


            if(!booking.isPhotoSeshNow){
                [agent_long,agent_lat] = (typeof photographer.location != 'undefined') ? photographer.location.coordinates : [];
            }



            let ColumnLeft = {

                xs:{span:24,offset:0},
                sm:{span:24,offset:0},
                md:{span:12,offset:0},
                lg:{span:8,offset:0},
                xl:{span:8,offset:0},
            }
            let ColumnRight = {

                xs:{span:24,offset:0},
                sm:{span:24,offset:0},
                md:{span:12,offset:0},
                lg:{span:16,offset:0},
                xl:{span:16,offset:0},
            }





            const MapWithADirectionsRenderer = compose(
                withProps({
                    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${process.env.GG_MAP_APIKEY}&v=3.exp&libraries=geometry,drawing,places`,
                    loadingElement: <div style={{ height: `100%` }} />,
                    mapElement: <div style={{ height: `100%` }} />,
                }),
                withScriptjs,
                withGoogleMap,
                lifecycle({
                    componentDidMount() {
                        const DirectionsService = new google.maps.DirectionsService();

                        DirectionsService.route({
                            origin: new google.maps.LatLng(agent_lat, agent_long),
                            destination: new google.maps.LatLng(booking_lat, booking_lng),
                            travelMode: google.maps.TravelMode.DRIVING,
                        }, (result, status) => {
                            if (status === google.maps.DirectionsStatus.OK) {
                                this.setState({
                                    directions: result,
                                });
                            } else {
                                console.error(`error fetching directions ${result}`);
                            }
                        });
                    }
                })
            )(props =>
                <GoogleMap
                    defaultZoom={7}
                    defaultCenter={new google.maps.LatLng(booking_lat, booking_lng)}
                >
                    {props.directions && <DirectionsRenderer directions={props.directions} />}
                </GoogleMap>
            );

            let Disable = (typeof booking.appointmentStatus !='undefined') ? ([STATUS.EXPIRED,STATUS.CANCELLED,STATUS.REJECTED].indexOf(booking.appointmentStatus) > -1) :false;


            let originEndTime = (typeof booking.appointmentStatus !='undefined' && booking.totalExtraTime > 0) ? TIME[TIME.indexOf(booking.appointmentEndTime) - (booking.totalExtraTime / 30)] : booking.appointmentEndTime


            return (
                <div className={style.container}>

                    {(booking.appointmentStatus == STATUS.COMPLETED) && (typeof booking.extraTime != "undefined") && (booking.extraTime != 0) && (
                        <div className={style.msgbox_extratime}>
                            Your booking is Completed and You have requested {booking.extraTime} Minutes extra successful. Please wait photographer accept extra time
                        </div>
                    )}
                    {(typeof booking.appointmentStatus !='undefined') && (
                        <Row>
                            <Col {...ColumnLeft}>
                                <EditBookingForm {...this.props}  booking={booking} />
                            </Col>
                            <Col {...ColumnRight}>

                                <div className={style.box}>
                                    <div className={style.inner_box}>


                                        <div className={style.agent_media}>

                                            <Row>
                                                <Col
                                                    xs={{span:24,offset:0}}
                                                    sm={{span:24,offset:0}}
                                                    md={{span:24,offset:0}}
                                                    lg={{span:6,offset:0}}
                                                    xl={{span:6,offset:0}}
                                                >
                                                    <div className={style.agent_thumbnail}>
                                                        <img src={booking.profilePicURL.thumb} alt=""/>
                                                    </div>

                                                </Col>


                                                <Col
                                                    xs={{span:24,offset:0}}
                                                    sm={{span:24,offset:0}}
                                                    md={{span:24,offset:0}}
                                                    lg={{span:11,offset:0}}
                                                    xl={{span:11,offset:0}}
                                                >
                                                    <div className={style.agent_info}>



                                                        <div className={style.name}>{getPhotogapherName(booking.agentName.firstName + ' ' + booking.agentName.lastName)}</div>

                                                        {([STATUS.ACCEPTED,STATUS.CHANGE_REJECTED,STATUS.COMPLETED].indexOf(booking.appointmentStatus) != -1) && (
                                                            <div>
                                                                <div className={style.email}><span>Email : </span><a target="_blank" href={"mailto:" + booking.agentEmailId }>{booking.agentEmailId}</a></div>
                                                                <div className={style.agent_type}><span>Phone Number : </span>  <a target="_blank" href={"tel:" + booking.agentData.phoneNumber}>{booking.agentData.phoneNumber}</a> </div>
                                                            </div>
                                                        )}

                                                        <div className={style.agent_type}><span>Type Of PhotoSesh :</span> {cleanSlugTitleEvent(booking.agentType).replace('photosesh','PhotoSesh')}</div>
                                                        <div className={style.agent_type}><span>Event Type :</span> {cleanSlugTitleEvent(booking.eventType).replace('photosesh','PhotoSesh')}</div>
                                                        <div className={style.agent_type}><span>Hourly Rate :</span> {formatMoney(booking.agentPrice,'$')} / hour</div>

                                                        <Link to={`${this.props.match.url}/view-agent-profile`} className="btn-black">View Profile</Link>


                                                        {booking.appointmentStatus == STATUS.COMPLETED && (
                                                            <div>
                                                                <Tag  style={{cursor:'pointer',marginTop:20}}  onClick={e=> this.setState({visibleModalReview:true})} color="#87d068">Rate</Tag>

                                                            </div>

                                                        )}



                                                        <Modal
                                                            title="review booking"
                                                            visible={this.state.visibleModalReview}
                                                            onOk={this.hideModalReview}
                                                            onCancel={this.hideModalReview}
                                                            width={500}
                                                            footer={null}
                                                        >




                                                            <ReviewBooking booking={this.state.booking} />


                                                        </Modal>

                                                    </div>

                                                </Col>



                                                <Col
                                                    xs={{span:24,offset:0}}
                                                    sm={{span:24,offset:0}}
                                                    md={{span:24,offset:0}}
                                                    lg={{span:7,offset:0}}
                                                    xl={{span:7,offset:0}}
                                                >
                                                    <div className={style.agent_map}>


                                                        <div className={style.wrap_map} onClick={(e)=>{this.setMapVisible(true);}}>
                                                            <MapWithADirectionsRenderer
                                                                containerElement={ <div style={{ height: `200px` }} />}

                                                            />
                                                        </div>

                                                        <Modal
                                                            width={960}
                                                            title="Distance between Photographer and You"
                                                            style={{ top: 20 }}
                                                            visible={this.state.mapVisible}
                                                            footer={null}
                                                            onCancel={() => this.setMapVisible(false)}
                                                        >
                                                            <MapWithADirectionsRenderer
                                                                containerElement={ <div style={{ height: `500px` }} />}
                                                            />
                                                        </Modal>

                                                    </div>

                                                </Col>
                                            </Row>






                                        </div>

                                        <div className={style.note_booking}>


                                            <strong>Date :</strong> <span>{moment(booking.appointmentDate).subtract(UTC_OFFSET,'minutes').format('MM-DD-YYYY')} </span><br/>
                                            <strong>Time : </strong><span> {booking.appointmentStartTime} - {originEndTime} {typeof booking.totalExtraTime != 'undefined' && booking.totalExtraTime != 0 && ( <span style={{

                                            fontWeight: 'bold',
                                            color: '#dc5b0d'

                                            }}>( + {booking.totalExtraTime} extra minutes )</span>) }</span><br/>
                                            <strong>Address :</strong> <span>{booking.appointmentAddress}  </span><br/>
                                            <strong>Total Cost :</strong> <span>{'$' + booking.agentPrice * booking.appointmentDuration}  </span><br/>
                                        </div>

                                        <Button
                                            style={{
                                                background: 'none',
                                                display:Disable ? 'none' : 'block',
                                                marginTop: 20,
                                                color: '#4b4b4b'
                                            }}
                                            onClick={this.popupSelectCard} className={'btn-submit'}
                                            type="primary">
                                            Select Another Card
                                        </Button>

                                        <Modal
                                            title="Change Card"
                                            visible={this.state.visibleModalCard}
                                            onOk={this.hideModal}
                                            onCancel={this.hideModal}
                                            width={900}
                                            footer={( <div style={{overflow:'hidden'}}> <Button style={{float:'left'}} onClick={()=>{this.setState({visibleModalCard:false})}} type={'primary'}> Done </Button> </div>)}
                                        >
                                            <UpdateCard booking={this.props.booking} cardBooking={this.props.card_booking} cards={this.props.payment.cards} />
                                        </Modal>


                                    </div>
                                </div>

                            </Col>
                        </Row>
                    )}
                </div>
            )
        }


        return null;






    }

}

const mapStateToProps = (state,props)=>{
    return {}
}

class Review_Booking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rate:5,
        }
    }
    componentWillReceiveProps(props){
        const {reviewByUser,isReviewedByUser,_id} = props.booking
        if(_id != this.props.booking._id){

            let rate = isReviewedByUser ? reviewByUser.ratingStars : 5
            let comments = isReviewedByUser ? reviewByUser.comments : ""

            this.setState({
                rate
            })
            this.props.form.setFields({
                comment: {
                    value:comments
                },
            });
        }




    }

    componentDidMount(){
        console.log('componentDidMount');
       const {reviewByUser,isReviewedByUser} = this.props.booking

        if(isReviewedByUser){

           this.setState({
               rate:reviewByUser.ratingStars
           })
            this.props.form.setFields({
                comment: {
                    value:reviewByUser.comments
                },
            });
        }

    }


    handleSubmit = (e)=>{
        e.preventDefault;
        this.setState({loading:true})
        this.props.form.validateFieldsAndScroll((err, inputs) => {

            let {rate} = this.state

            reviewBooking(this.props.booking._id,rate,inputs.comment,this.props.booking.isPhotoSeshNow).then(res=>{
                this.setState({loading:false,['success_'+this.props.booking._id]:true,message:res.data.message})
            }).catch(err=>{
                console.log(err);
                this.setState({loading:false,rate:0})
            })
        })
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const {loading,success,message} = this.state
        const {booking} = this.props

        const isReviewedByUser = false || booking.isReviewedByUser



        return (

            <div>

                {(this.state['success_'+this.props.booking._id]) &&
                    (
                        <div>
                            {message}



                            <br/>
                            <Tag  style={{cursor:'pointer',marginTop:20}} onClick={()=>this.setState({['success_'+this.props.booking._id]:false})} color="#87d068">Edit Rating</Tag>
                        </div>
                    )
                }

                <Form className="login-form" style={{display:this.state['success_'+this.props.booking._id] ? 'none' :'block'}}>
                    <div style={{textAlign:'center'}}>
                        <Avatar size={100} src={this.props.booking.agentData.profilePicURL.thumb} /> <br/>
                        <Rate value={this.state.rate} allowHalf={true} onChange={val=>this.setState({rate:val})} count={6} /> <span style={{marginLeft:10}}>({this.state.rate})</span>

                    </div>


                    <FormItem
                        label="Comment"
                    >

                        {getFieldDecorator('comment', {
                            initialValue:''
                        })(
                            <TextArea rows={4} />
                        )}


                    </FormItem>

                    <Button

                        loading={loading}
                        type="primary" icon="wechat" onClick={this.handleSubmit}> Rating</Button>
                </Form>
            </div>


        );
    }

}


export const ReviewBooking = Form.create()(Review_Booking);



export default connect(mapStateToProps,{getCards,reviewBooking})(DetailBooking)

