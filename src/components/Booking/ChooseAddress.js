import style from './choose_address.css'
import React from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'
import {Redirect,Link} from 'react-router-dom'
import {Icon,message} from  'antd'
import createClass from 'create-react-class'
import {Row, Col, Button, Input, Radio, Select, Form,DatePicker} from 'antd';
import moment from 'moment'
import Map, {Marker, GoogleApiWrapper} from 'google-maps-react'
import {NOW, LATER, DURATIONS,TIME} from '../../define'
import {isAvailableTime} from '../../utils/helper'
import {setDataBooking,setBooktype,setTimeBooking,setDateBooking,setCurrentStep} from '../../actions/bookActions'

import {ProcessStep} from './ProcessStep'
/* ----------- google map config -------------*/
const GG_MAP_APIKEY = process.env.GG_MAP_APIKEY;

const GG_MAP_VERSION = process.env.GG_MAP_VERSION

/* ----------- google map config -------------*/
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const Contents = createClass({
    getInitialState() {

        let {info} = this.props;
        return {
            place: '',
            position: {},
            info,
            addressRequired : '',
            isAddress : false,
        }
    },

    goTo(route) {
        this.props.history.replace(`${route}`)
    },


    componentDidUpdate(prevProps) {

        const {map} = this.props;

        if (map !== prevProps.map) {
            this.renderAutoComplete();
        }
    },


    fetchLocation(lat,lng){

        let address = `${lat},${lng}`;

        if(this.props.info.place){
            setTimeout(()=>{
                let {place,position}  = this.props.info
                this.setState({place,position : {lat:position.lat,lng:position.lng}});
            },1000)
            return;
        }
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&sensor=true&key=`+GG_MAP_APIKEY)
            .then(res=>res.json())
            .then((data)=>{
                setTimeout(()=>{
                    if(data.status == 'OK'){
                        this.setState({place:data.results[0].formatted_address,position : {lat:data.results[0].geometry.location.lat,lng:data.results[0].geometry.location.lng}})
                    }

                },1000)
            })
    },
    componentWillMount(){
        this.props.setCurrentStep(0)
    },
    componentDidMount(){



    },

    renderAutoComplete: function (location) {
        const {google, map} = this.props;

        if (!google || !map) return;

        const aref = this.refs.autocomplete;
        const node = ReactDOM.findDOMNode(aref);
        var autocomplete = new google.maps.places.Autocomplete(node);
        autocomplete.bindTo('bounds', map);


        autocomplete.addListener('place_changed', () => {

            const place = autocomplete.getPlace();

            if (!place.geometry) {
                return;
            }


            this.setState({
                place: place.formatted_address,
                position: {lat:place.geometry.location.lat(),lng:place.geometry.location.lng(),}
            })



            let new_info = {...this.state.info,place:place.formatted_address,position:{lat:place.geometry.location.lat(),lng:place.geometry.location.lng()}}

            if(this.props.book_type == NOW){

                new_info.date = moment()
            }else{
                new_info.duration = DURATIONS[TIME.indexOf(new_info.to) - TIME.indexOf(new_info.from) -1]

            }

            let data = {
                book_type:this.props.book_type,
                info: new_info,photographers:[]
            }


            this.props.setDataBooking(data)




        })
    },


    handleNext(e) {

        if(this.props.place != ''){

            let {place,position} = this.state
            let new_info = {...this.state.info,place,position}

            if(this.props.book_type == NOW){

                new_info.date = moment()
            }else{
                new_info.duration = DURATIONS[TIME.indexOf(new_info.to) - TIME.indexOf(new_info.from) -1]

            }

            let data = {
                book_type:this.props.book_type,
                info: new_info,photographers:[]
            }

            this.goTo('/book/photosesh-type')

            this.props.setDataBooking(data)

        } else this.setState({
            addressRequired: 'address is required !'
        })

    },
    handleChange(data){

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
    },
    handleAddressChange(evt){
        console.log('evt.target.value',evt.target.value);
        let isAddress = false;
        if(evt.target.value != '') isAddress = true
        this.setState({
            addressRequired: ''
        })
        this.setState({
            isAddress: isAddress
        })
    },




    componentWillReceiveProps: function(nextProps) {
        const {google, map} = this.props;
        if(typeof nextProps.info.position != 'undefined' && nextProps.info.position && typeof nextProps.info.position.lat != 'undefined' ){

            console.log('#1',nextProps.info.position.lat,nextProps.info.position.lng);
            this.fetchLocation(nextProps.info.position.lat,nextProps.info.position.lng)

        }else{

            console.log('nextProps.info',nextProps.info);
            /*
             *
             * show current location by client device
             *
             * */

            if (navigator.geolocation) {




                navigator.geolocation.getCurrentPosition((info_location)=> {

                    console.log(info_location.coords.latitude,info_location.coords.longitude);

                    this.fetchLocation(info_location.coords.latitude,info_location.coords.longitude)

                }, function() {

                });
            }
        }
    },
    render: function () {
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
                        name={'date'}
                        placeholder="Select Date"
                        disabledDate={(startValue) => {
                            return startValue.valueOf() < new Date().setHours(0,0,0,0);
                        }}
                        allowClear={false}
                        defaultValue={moment(props.info.date)}
                        onChange={(date)=>this.handleChange({date:date})}
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
                    <Map {...props}
                         clickableIcons={false}
                         containerStyle={{
                             position: 'relative',
                             height: 'calc(100vh - 0px)',
                             width: '100%'
                         }}
                         center={this.state.position}
                         zoom={16}
                         centerAroundCurrentLocation={true}>
                        <Marker position={this.state.position}/>
                    </Map>

                    <div className={style.box_input_address}>

                        <h2 className={style.title}>Book a PhotoSesh</h2>

                        <Form layout="vertical" onSubmit={this.onSubmit}  className={style.sidebar}>
                            <FormItem label="Address/Location of PhotoSesh">

                                <Input
                                    value={this.state.place}
                                    onChange={(e)=> this.setState({place:e.target.value}) }
                                    defaultValue={this.props.info.place}
                                    ref='autocomplete'
                                    placeholder="Enter location"
                                    onBlur={this.handleAddressChange} />
                                <label className="error">{this.state.addressRequired}</label>
                            </FormItem>

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
                                    style={{width: '100%',
                                        borderRadius: 0}}
                                    type="primary"

                                    className={'btn-submit'}
                                    disabled={this.state.place == '' || this.state.position.lat == '' || this.state.position.lng == ''}

                                    onClick={this.handleNext}
                                >
                                    Next
                                </Button>

                            </FormItem>
                        </Form>

                        <ul className="menu_simple">
                            <li>Book PhotoSesh</li> |
                            <li><Link to={'/'}> Home Page</Link></li>


                        </ul>
                    </div>

                    <div className={style.step_process}>
                        <ProcessStep current={0} {...props} />
                    </div>
                </Col>

                <style>{css}</style>
            </Row>
        )
    }
})

const MapWrapper = createClass({
    render: function () {
        const props = this.props;
        const {google} = this.props;

        return (

            <div className="choose-address">
                <Map
                    clickableIcons={false}
                    google={google}
                    className={'map'}
                    visible={false}
                    containerStyle={{
                        height: 'initial',
                        position:'relative'
                    }}
                >
                    <Contents {...props} />
                </Map>
            </div>
        );
    }
})


const mapStateToProps = (state)=>{
    return {
        book_type: state.bookinfo.book_type,
        info:state.bookinfo.info
    }
}


const ChooseAddress = GoogleApiWrapper({
    apiKey: GG_MAP_APIKEY,
    version: GG_MAP_VERSION
})(MapWrapper)

export default connect(mapStateToProps,{setDataBooking,setBooktype,setTimeBooking,setDateBooking,setCurrentStep})(ChooseAddress)

const css = `
    .error{
        color: red
    }
    
`


