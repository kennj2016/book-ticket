import style from './rebook_form_date_time.css'
import React, {Component} from 'react'
import {Row, Col, Button, Input, message, Select, Form,DatePicker} from 'antd';
import {setDataBooking} from '../../../actions/bookActions'
import {connect} from 'react-redux';
import {TIME,DURATIONS,UTC_OFFSET,NOW,LATER} from '../../../define'
import moment from 'moment'

import {getTimeForBookNow,isDefine,isAvailableTime,cleanSlugTitleEvent} from '../../../utils/helper'
import {getBookingCornerbookNow, getBookingCornerBookLater,setPhotographers,setTimeBooking,setDateBooking} from '../../../actions/bookActions'

const InputGroup = Input.Group;
const FormItem   = Form.Item;
const Option     = Select.Option;

class RebookFormDateTime extends Component {
    constructor(props) {
        super(props);
        this.state = {loading:false}

    }
    getPhotographers(data) {

        let {duration, date, from, to, photosesh_type_name, photosesh_event_type, place, position} = data.info
        let {lat, lng} = position;
        let {book_type} = data
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
    componentDidMount(){

        if(typeof this.props.oldBook == 'undefined'){
            this.props.history.replace('/')
        }

    }
    handleChange(data){

        let new_info = this.props.bookinfo.info
        let keyChange = Object.keys(data)[0];

        if(keyChange == 'from' || keyChange == 'to'){

            /*
             * adjust time end later than start 1hour
             * when user change start time
             *
             * */

            switch (keyChange){
                case 'from':
                {


                    let to_index =  TIME.indexOf(data[keyChange]) + 3
                    new_info['to'] = TIME[to_index]


                    let timeAvailable = isAvailableTime(data[keyChange] )

                    console.log(new_info['date']);
                    if(timeAvailable.isAvailable || moment(new_info['date']).isAfter(new Date)){
                        this.props.setTimeBooking({to:TIME[to_index],from:data[keyChange]})
                        break;
                    }else{
                        message.error('Opps , From Time should be from '+ timeAvailable.ampmNOW);
                        return;

                    }


                }
                case 'to':
                {

                    if(TIME.indexOf(new_info.from) > TIME.indexOf(data[keyChange])) {
                        message.error('Opps , End Time should be great than Start Time');
                        return;
                    }

                    this.props.setTimeBooking({to:data[keyChange],from:new_info.from})
                    break;
                }

            }

        }else if(keyChange == 'date'){
            this.props.setDateBooking({date:data[keyChange]})
        }

    }

    handleSubmit = (e) => {

        let new_info = {...this.props.bookinfo.info}
        let [lng,lat] = this.props.oldBook.appointmentLongLat.coordinates
        new_info.place = this.props.oldBook.appointmentAddress
        new_info.position = {lat,lng}
        new_info.photographers_request =[this.props.oldBook.agentData._id]
        new_info.photosesh_type_name =this.props.oldBook.agentType
        new_info.photosesh_event_type =this.props.oldBook.eventType

        new_info.duration = DURATIONS[TIME.indexOf(new_info.to) - TIME.indexOf(new_info.from) -1]

        let data = {
            book_type:this.props.oldBook.isPhotoSeshNow ? 'now':'later',
            info: new_info,
            photographers:[this.props.oldBook.agentData]
        };

        this.setState({loading:true})

        console.log(data);
        this.getPhotographers(data).then(res=>{
            data.photographers = res.data.data

            let isPhotographerAvailable = data.photographers.filter(p=>{
                return p._id == this.props.oldBook.agentData._id
            }).length

            if(isPhotographerAvailable){
                this.props.setDataBooking(data)
                this.props.history.replace('/book/booking-review')
            }else{
                message.error('sorry, photographer not available for your booking schedule')
            }


            this.setState({loading:false})


        }).catch(err=>{
            this.setState({loading:false})

            if(typeof  err.response != 'undefined'){
                message.error(err.response.data.message);
            }


        });



    }



    render() {

        const {getFieldDecorator} = this.props.form;
        const props = this.props;
        console.log(this.props);
        const {info} = this.props.bookinfo;
        const Time_Options = TIME.map((d, i)=> {
            return (
                <Option  key="i" value={d}>{d}</Option>
            )
        })


        return (
            <div>
                <Row gutter={16}>
                    <Col className="gutter-row" span={12}>
                        <Form style={{maxWidth:300,margin: 'auto'}}  layout="horizontal"  className={style.sidebar}>

                            <div>
                                <h2>Re-select Date Time for new booking</h2>
                            </div>
                            <div className="booklater-duration">
                                <FormItem label="Select Date">

                                    {(isDefine(info)) && (
                                        <DatePicker
                                            style={{width:'100%'}}
                                            format="MM-DD-YYYY"
                                            placeholder="Select Date"
                                            disabledDate={(startValue) => {
                                                return startValue.valueOf() < new Date().setHours(0,0,0,0);
                                            }}
                                            defaultValue={moment(info.date)}
                                            onChange={(date)=>this.handleChange({date:date})}
                                        />
                                    )}


                                </FormItem>

                                <FormItem label="From" className={'from'}>

                                    {(isDefine(info)) && (
                                        <Select
                                            onChange={(from)=>this.handleChange({from})}
                                            value={info.from}
                                            style={{ width: '100%' }}>
                                            {Time_Options}
                                        </Select>
                                    )}


                                </FormItem>

                                <FormItem label="To" className={'to'}>
                                    {(isDefine(info)) && (
                                        <Select
                                            onChange={(to)=>this.handleChange({to})}
                                            value={info.to}
                                            style={{ width: '100%' }}>
                                            {Time_Options}
                                        </Select>
                                    )}
                                </FormItem>

                            </div>

                            <FormItem>

                                <Button
                                    style={{width: '100%',
                                        borderRadius: 0}}
                                    type="primary"
                                    loading={this.state.loading}
                                    className={'btn-submit'}
                                    onClick={this.handleSubmit}
                                >
                                    Submit
                                </Button>

                            </FormItem>
                        </Form>
                    </Col>
                    <Col className="gutter-row" span={12}>

                        {typeof this.props.oldBook != 'undefined' && (


                            <div style={{    padding: '50px 20px',background: '#f1f1f1'}}>
                                <div>Address: {this.props.oldBook.appointmentAddress} </div>
                                <div>Photographer: {this.props.oldBook.agentName.firstName +this.props.oldBook.agentName.lastName } </div>
                                <div>Phone Number: {this.props.oldBook.agentPhoneNumber} </div>
                                <div>Event Type: {cleanSlugTitleEvent(this.props.oldBook.eventType)} </div>
                                <div>Agent Price: $ {this.props.oldBook.agentPrice} / hour </div>

                            </div>
                        )}


                    </Col>

                </Row>


            </div>

        )
    }
}

const mapStateToProps = (state)=> {
    return {
        bookinfo: state.bookinfo,
        book_type: state.bookinfo.book_type,
    }
}
const WrappedRebookFormDateTime = Form.create()(RebookFormDateTime);
export default connect(mapStateToProps, {setDataBooking,setPhotographers,setTimeBooking,setDateBooking})(WrappedRebookFormDateTime)
