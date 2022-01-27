import style from './mobile_schedule.css'
import React,{Component} from 'react'

import ReactDOM from 'react-dom'
import {connect} from 'react-redux'
import {Redirect,Link} from 'react-router-dom'
import {Icon,message} from  'antd'
import createClass from 'create-react-class'
import {Row, Col, Button, Input, Radio, Select, Form,DatePicker} from 'antd';
import moment from 'moment'
import {NOW, LATER, DURATIONS,TIME} from '../../../define'
import {isAvailableTime} from '../../../utils/helper'
import {NavigateMobile} from '../ProcessStep'
import {setDataBooking,setBooktype,setTimeBooking,setCurrentStep} from '../../../actions/bookActions'



const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

class Schedule extends Component {

    constructor(props) {
        super(props);

        let {info} = props;
        this.state = {
            info
        };

    }

    goTo(route) {
        this.props.history.replace(`${route}`)
    }


    handleNext = (e) => {
        this.goTo('/book/photosesh-type')
    }
    handleChange = (data)=>{



        let new_info = {...this.state.info}

        let keyChange = Object.keys(data)[0];



        if(keyChange == 'from' || keyChange == 'to'||keyChange == 'date'){

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

                    console.log('onchange',this.state.info['date']);
                    console.log('onchange',timeAvailable);
                    console.log('onchange',data[keyChange]);
                    console.log('onchange');
                    console.log(timeAvailable.isAvailable,moment(this.state.info['date']).isAfter(new Date));

                    if(timeAvailable.isAvailable || moment(this.state.info['date']).isAfter(new Date)){
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

                case 'date':
                {
                    console.log(data[keyChange]);
                    let new_info = {...this.props.info }

                    new_info.date = data[keyChange];
                    let data_ = {
                        book_type:this.props.book_type,
                        info: new_info,photographers:[]
                    }
                    this.props.setDataBooking(data_)
                    break;
                }

            }


        }

        new_info[keyChange] = data[keyChange]

        this.setState({
            info: new_info
        })
    }


    componentWillReceiveProps(nextProps) {
    if(typeof nextProps.info.position != 'undefined' && nextProps.info.position && typeof nextProps.info.position.lat != 'undefined' ){
        let {duration,date,to,from}  = nextProps.info
        this.setState({duration,date,to,from})
    }
}

    componentWillMount(){
        this.props.setCurrentStep(0)
    }
    render () {
    const props = this.props;

    const Duration_Options = DURATIONS.map((d, i)=> {
        return (
            <Option key="i" value={d}>{d} hours</Option>
        )
    })
    const Time_Options = TIME.map((d, i)=> {
        return (
            <Option  key="i" value={d}>{d}</Option>
        )
    })


    const BookNow = (
        <FormItem label="Estimated Duration">
            <Select
                style={{width: '100%'}}
                onChange={(duration)=>this.handleChange({duration})}
                defaultValue={props.info.duration}
            >
                {Duration_Options}
            </Select>
        </FormItem>
    )
    const BookLater = (
        <div className="booklater-duration">
            <FormItem label="Select Date">


                <DatePicker
                    style={{width:'49%'}}
                    format="MM-DD-YYYY"
                    placeholder="Select Date"
                    disabledDate={(startValue) => {
                        return startValue.valueOf() < new Date().setHours(0,0,0,0);
                    }}
                    name={'date'}
                    allowClear={false}
                    defaultValue={moment(props.info.date)}
                    onChange={(date)=>{
                        console.log(date);

                        this.handleChange({date:date})
                    }}
                />

            </FormItem>

            <FormItem label="Start" className={'from'}>
                <Select
                    onChange={(from)=>this.handleChange({from})}
                    value={props.info.from}
                    style={{ width: '100%' }}>
                    {Time_Options}
                </Select>
            </FormItem>

            <FormItem label="End" className={'to'}>
                <Select
                    onChange={(to)=>this.handleChange({to})}
                    value={props.info.to}

                    style={{ width: '100%' }}>
                    {Time_Options}
                </Select>
            </FormItem>

        </div>
    )



    return (
        <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <NavigateMobile  {...this.props}/>
                <div className={style.box_input_address}>
                    <Form layout="vertical" onSubmit={this.onSubmit}  className={style.sidebar}>
                        <FormItem label="Do you need a PhotoSesh now or later?">
                            <RadioGroup onChange={(e)=>{
                                props.setBooktype(e.target.value)
                            }} defaultValue={props.book_type}>
                                <RadioButton value={LATER}>PhotoSesh LATER</RadioButton>
                                <RadioButton value={NOW}>PhotoSesh NOW</RadioButton>

                            </RadioGroup>
                        </FormItem>

                        {(props.book_type == NOW) ? BookNow : BookLater }

                        <FormItem>

                            <Button
                                style={{width: '100%', borderRadius: 0}}
                                type="primary"
                                className={'btn-submit'}
                                onClick={this.handleNext}
                            >
                                Next
                            </Button>

                        </FormItem>
                    </Form>

                    <ul className="menu_simple">
                        <li><Link to={'/book'}> Back Choose Address</Link></li>  |
                        <li>Home</li>
                    </ul>
                </div>
            </Col>

            <style>{css}</style>
        </Row>
    )
}
}


const mapStateToProps = (state)=>{
    return {
        book_type: state.bookinfo.book_type,
        info:state.bookinfo.info
    }
}


export default connect(mapStateToProps,{setDataBooking,setBooktype,setTimeBooking,setCurrentStep})(Schedule)

const css = `
    .error{
        color: red
    }
    
`


