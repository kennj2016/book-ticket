import style from './mobile_choose_address.css'
import React from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'
import {Redirect,Link} from 'react-router-dom'
import {Icon,message} from  'antd'
import createClass from 'create-react-class'
import {Row, Col, Button, Input, Radio, Select, Form,DatePicker} from 'antd';
import moment from 'moment'
import Map, {Marker, GoogleApiWrapper} from 'google-maps-react'
import {NOW, LATER, DURATIONS,TIME} from '../../../define'
import {setDataBooking,setBooktype,setTimeBooking} from '../../../actions/bookActions'



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
        let {place,position}  = this.props.info

        let address = `${lat},${lng}`;

        if(place){
            setTimeout(()=>{
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

            // if (place.geometry.viewport) {
            //
            //     map.fitBounds(place.geometry.viewport);
            //     console.log(place.geometry.viewport);
            // } else {
            //
            //     console.log(place.geometry.location);
            //     map.setCenter(place.geometry.location);
            //     map.setZoom(15);
            // }

            console.log(place);

            this.setState({
                place: place.formatted_address,
                position: {lat:place.geometry.location.lat(),lng:place.geometry.location.lng(),}
            })
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

            this.goTo('/book/schedule')

            this.props.setDataBooking(data)

        } else this.setState({
            addressRequired: 'address is required !'
        })

    },

    handleAddressChange(evt){
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

                            <div>

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

                            </div>

                        </Form>
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

export default connect(mapStateToProps,{setDataBooking,setBooktype,setTimeBooking})(ChooseAddress)

const css = `
    .error{
        color: red
    }
    
`


