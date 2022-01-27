import style from './form_date_time.css'
import React, {Component} from 'react'
import {Row, Col, Button, Input, message, Select, Form,DatePicker} from 'antd';
import {setDataBooking} from '../../../actions/bookActions'
import {connect} from 'react-redux';
import {TIME,DURATIONS,UTC_OFFSET} from '../../../define'
import moment from 'moment'
import {NOW} from '../../../define'
import {getTimeForBookNow,isDefine,isAvailableTime} from '../../../utils/helper'
import {BrowserView, MobileView, isBrowser, isMobile} from 'react-device-detect'
import {getBookingCornerbookNow, getBookingCornerBookLater,setPhotographers,setTimeBooking,setDateBooking} from '../../../actions/bookActions'

const InputGroup = Input.Group;

const FormItem = Form.Item;

const Option = Select.Option;
message.config({
    top: 50,
    duration: 4,
    maxCount: 3,
});
class FormDateTime extends Component {
    constructor(props) {
        super(props);
        this.state = {loading:false}

    }


    handleChange(data){

        let new_info = {...this.props.info}


        let keyChange = Object.keys(data)[0];


        console.log(keyChange);
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

                    let timeAvailable = isAvailableTime(data[keyChange])



                    if(timeAvailable.isAvailable  || moment(new_info['date']).isAfter(new Date)){
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
    
    handleSubmit = (e) => {

        let new_info = {...this.props.info}
        let data = {
            book_type:this.props.book_type,
            info: new_info
        }

        this.setState({loading:true})


        this.getPhotographers(data).then(res=>{
            let photographers = res.data.data
            let data = {
                book_type:this.props.book_type,
                info: new_info,
                photographers
            }
            this.props.setDataBooking(data)
            this.setState({loading:false})
        }).catch(err=>{
            console.log(err.response);
            message.error(err.response.data.message)
            this.props.setPhotographers([])
            this.setState({loading:false})
        })
        
        
    }

    render() {

        const {getFieldDecorator} = this.props.form;
        const {props} = this.props;

        const Time_Options = TIME.map((d, i)=> {
            return (
                <Option  key="i" value={d}>{d}</Option>
            )
        })

        return (
            <div style={this.props.style}>
                <Form  layout="horizontal"  className={style.sidebar} style={{

                    paddingBottom:isMobile ? '100px' : ''
                }}>

                    <div className="booklater-duration">
                        <FormItem label="Select Date">

                            {(isDefine(this.props.info)) && (
                                <DatePicker
                                    style={{width:'100%'}}
                                    format="MM-DD-YYYY"
                                    placeholder="Select Date"
                                    disabledDate={(startValue) => {
                                        return startValue.valueOf() < new Date().setHours(0,0,0,0);
                                    }}
                                    defaultValue={moment(this.props.info.date)}
                                    onChange={(date)=>this.handleChange({date:date})}
                                />
                            )}




                        </FormItem>

                        <FormItem label="From" className={'from'}>
                            {(isDefine(this.props.info)) && (
                                <Select
                                    onChange={(from)=>this.handleChange({from})}
                                    value={this.props.info.from}
                                    defaultValue={this.props.info.from} style={{ width: '100%' }}>
                                    {Time_Options}
                                </Select>
                            )}


                        </FormItem>

                        <FormItem label="To" className={'to'}>
                            {(isDefine(this.props.info)) && (
                                <Select
                                    onChange={(to)=>this.handleChange({to})}
                                    value={this.props.info.to}
                                    defaultValue={this.props.info.to} style={{ width: '100%' }}>
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
                            Search Photographer
                        </Button>

                    </FormItem>
                </Form>
            </div>

        )
    }
}




const mapStateToProps = (state)=> {
    return {
        info:state.bookinfo.info,
        book_type: state.bookinfo.book_type,
    }
}
const WrappedFormDateTime = Form.create()(FormDateTime);
export default connect(mapStateToProps, {setDataBooking,setPhotographers,setTimeBooking,setDateBooking})(WrappedFormDateTime)
