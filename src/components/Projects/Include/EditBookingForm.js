/* global google */
import style from './edit_booking.css'
import React,{Component} from 'react'
import {connect} from 'react-redux'
import {Radio,AutoComplete,Form,Input,Select,Row,Col,Tag,DatePicker,Button,message,Popconfirm,Icon,Alert,Modal,Checkbox} from 'antd';

import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import {stateToHTML} from 'draft-js-export-html';
import {TIME,STATUS,UTC_OFFSET} from '../../../define'
import PropTypes from 'prop-types';
import moment from 'moment'
import classnames from 'classnames'
import {updateBooking,setBookings,getBookings,cancelBooking,addExtraTime,tipAgent} from '../../../actions/projectAction'
import {isDefine} from '../../../utils/helper'
import ReactDOM from 'react-dom'
import Map, {Marker, GoogleApiWrapper} from 'google-maps-react'
import {addStyleCode,searchStyleCodes} from '../../../actions/userActions'

// Require Editor JS files.
import { Editor } from 'react-draft-wysiwyg';
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState,ContentState,convertFromHTML,convertToRaw } from 'draft-js';
// Require Editor JS files.

const { compose, withProps } = require("recompose");
const {
    withScriptjs,
} = require("react-google-maps");


/* ----------- google map config -------------*/
const GG_MAP_APIKEY = process.env.GG_MAP_APIKEY;
const GG_MAP_VERSION = process.env.GG_MAP_VERSION


/* ----------- google map config -------------*/

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SaveStyleCodeForm = Form.create()(
    (props) => {
        const { visible, onCancel, onCreate, form,onStyleCodeCheckboxChange,isPublic,loadingAddStyleCode,isStyleCodeAdmin } = props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={visible}
                title="Save PhotoSesh Style Code"
                okText="Create"
                onCancel={onCancel}
                onCreate={onCreate}
                footer={null}

            >
                <Form layout="vertical">
                    <FormItem label="PhotoSesh Style Code">
                        {getFieldDecorator('code', {
                            rules: [
                                { required: true, message: 'please enter style code' },
                                {min:3, message: 'code at least 3 characters'},
                                {pattern:/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/ ,message:'The code invalid (please don\'t use space or special character)'}

                            ],
                        })(
                            <Input />
                        )}
                    </FormItem>

                    {(isStyleCodeAdmin) && (
                        <FormItem
                            label=""
                        >
                            <Checkbox
                                checked={isPublic}
                                onChange={onStyleCodeCheckboxChange}>public (anyone with code can use)</Checkbox>
                        </FormItem>
                    )}


                    <div>
                        <Button

                            loading={loadingAddStyleCode}
                            style={{
                                float:'right',
                                borderRadius: 2,
                                background: 'black',
                                border: 0
                            }}  type="primary" icon="save" onClick={onCreate}> Save</Button>
                    </div>



                </Form>
            </Modal>
        );
    }
);
const AddExtraTimeForm = Form.create()(
    (props) => {
        const { visible, onCancel, onCreate, currentExtraTime,onExtraTimeChange,extraTime,loadingExtraTime,title } = props;
        return (
            <Modal
                visible={visible}
                title={title}
                okText="Create"
                onCancel={onCancel}
                onCreate={onCreate}
                footer={null}

            >
                <Form layout="vertical">
                    <FormItem label="">
                        <RadioGroup onChange={onExtraTimeChange} value={extraTime}>
                            <RadioButton value={30}>30 Minutes</RadioButton>
                            <RadioButton value={60}>60 Minutes</RadioButton>
                            <RadioButton value={90}>90 Minutes</RadioButton>
                            <RadioButton value={120}>120 Minutes</RadioButton>
                        </RadioGroup>
                    </FormItem>


                    <div>
                        <Button
                            loading={loadingExtraTime}
                            style={{
                                float:'right',
                                borderRadius: 2,
                                background: 'black',
                                border: 0
                            }}  type="primary" icon="save" onClick={onCreate}> Add</Button>
                    </div>



                </Form>
            </Modal>
        );
    }
);


const TipForm = Form.create()(
    (props) => {
        const { visible, onCancel, onCreate, form,loadingTipForAgent } = props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={visible}
                title="Tip for Photographer"
                okText="Create"
                onCancel={onCancel}
                onCreate={onCreate}
                footer={null}

            >

                <Form layout="vertical" style={{textAlign:'center'}}>
                    <FormItem label="">
                        {getFieldDecorator('amount_tip', {
                            rules: [
                                { required: true, message: '' }
                            ],
                            initialValue:2
                        })(
                            <Input  style={{
                                maxWidth:'200px',
                                margin: '0 auto',
                                display: 'block'
                            }} addonBefore={<span>$</span>} type={'number'} min="1" />
                        )}
                    </FormItem>
                    <div>
                        <Popconfirm
                            title="Are you sure？"
                            okText="Yes"
                            cancelText="No"
                            onConfirm={onCreate}
                            onCancel={onCancel}
                        >
                            <Button
                                loading={loadingTipForAgent}
                                style={{
                                    borderRadius: 2,
                                    background: '#ff6a00',
                                    border: 0,
                                    width: 200,
                                    fontSize: 20,
                                    padding: 4,
                                    height: 40
                                }}  type="primary" icon="save"> Tip</Button>
                        </Popconfirm>


                    </div>



                </Form>
            </Modal>
        );
    }
);


class EditBookingForm extends Component{
    constructor(props) {
        super(props);
        this.state = {

            visibleAddExtraTime: false,
            visibleSaveStyleCodeModal: false,
            visibleTipFormModal: false,
            loadingAddStyleCode: false,
            loadingExtraTime: false,
            loadingTipForAgent: false,
            dataSourceRender: [],
            dataSource: [],
            isPublic:false,
            extraTime:30,
            booking: {
                titleOrDescription:EditorState.createEmpty(),
                address: '',
                longitude: '',
                latitude: '',
                appointmentScheduledStartTime:props.booking.appointmentStartTime,
                appointmentScheduledEndTime:props.booking.appointmentEndTime,
            },
            loading:false,
            error:{}
        }

    }

    goTo(route) {
        this.props.history.replace(`${route}`)
    }

    renderAutoComplete (location) {
        if (!google) return;
        const aref = this.refs.autocomplete;
        const node = ReactDOM.findDOMNode(aref);
        var autocomplete = new google.maps.places.Autocomplete(node);
        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (!place.geometry) {
                return;
            }
            this.setState({
                booking: {...this.state.booking,
                    address:place.formatted_address,
                    longitude: place.geometry.location.lng(),
                    latitude:  place.geometry.location.lat(),
                }

            })
        })
    }

    saveStyleCodeFormRef = (form) => {
        this.styleCodeForm = form;
    }

    saveExtraFormRef = (form) => {
        this.extraFormRef = form;
    }
    saveTipFormRef = (form) => {
        this.tipFormRef = form;
    }
    handleSelect = (code) => {

        let item = this.state.dataSource.find(item=>item.code == code)

        if(item.description != ''){

            message.success('Apply PhotoSesh Style Code Successful')

            const contentBlock = htmlToDraft(item.description);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const outputEditorState = EditorState.createWithContent(contentState);

                this.setState (state=>{
                    return {
                        booking : { ...state.booking, titleOrDescription:outputEditorState }
                    }

                });
            }

        }

    }

    handleSearch = (value) => {


        if(!this.state.wait){
            this.setState({wait:true})
            searchStyleCodes(value).then(res=>{

                let dataSourceRender  = res.data.data.map(item=>{
                    return item.code
                })
                this.setState({
                    dataSourceRender,
                    dataSource:res.data.data,
                    wait:false
                });
            }).catch(err=>{
                this.setState({wait:false})
            })
        }

    }


    showStyleCodeModal = () => {
        this.setState({ visibleSaveStyleCodeModal: true });
    }

    handleStyleCodeCancel = () => {
        this.setState({ visibleSaveStyleCodeModal: false });
    }
    handleExtraTimeCancel = () => {
        this.setState({ visibleAddExtraTime: false });
    }

    handleStyleCodeCreate = () => {
        const styleCodeForm = this.styleCodeForm,
            mainForm =  this.props.form,
            {getFieldValue} = mainForm,
            {isPublic} = this.state;

        styleCodeForm.validateFields((err, values) => {
            if (err) {
                return;
            }
            this.setState({loadingAddStyleCode:true})

            const {titleOrDescription} = this.state.booking
            if (titleOrDescription.getCurrentContent().hasText()) {


                let html = stateToHTML(titleOrDescription.getCurrentContent());


                values.description = html;
                values.isPublic = isPublic;

                addStyleCode(values).then(res=> {
                    message.success(res.data.message)
                    styleCodeForm.resetFields()
                    this.setState({visibleSaveStyleCodeModal: false, loadingAddStyleCode: false})
                }, error=> {
                    this.setState({visibleSaveStyleCodeModal: false, loadingAddStyleCode: false})
                    let {response} = error
                    message.error(response.data.message)
                })
            }


        });
    }

    handleExtraTimeCreate = () => {
        this.setState({loadingExtraTime:true})
        let {_id} = this.props.booking
        addExtraTime(_id,this.state.extraTime).then(res=>{



            getBookings().then(res=>{
                if (res.data.data) {
                    let {upcomingAppointment,pastAppointment} = res.data.data
                    let data = [...upcomingAppointment,...pastAppointment];
                    upcomingAppointment = upcomingAppointment.map(item=>{ item.type = 'upcoming' ; return item })
                    pastAppointment = pastAppointment.map(item=>{ item.type = 'previous' ; return item })

                    this.props.setBookings(data)
                    message.success(res.data.message)
                    this.setState({visibleAddExtraTime: false,loadingExtraTime:false})
                }
            },err=>{
                this.setState({loading:false})
            })


        },error=>{
            this.setState({visibleAddExtraTime: false,loadingExtraTime:false})
            let {response} = error
            message.error(response.data.message)
        })

    }

    cancelBooking = () => {
        let {_id} = this.props.booking

        cancelBooking(_id).then(res=>{

            let new_booking = this.props.bookings.map(booking=>{
                if(booking._id == _id)
                {
                    return {...booking,
                        appointmentStatus : STATUS.CANCELLED
                    }
                }
                return booking;
            })



            this.props.setBookings(new_booking)
            message.success('Update booking successful')
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const {titleOrDescription} = this.state.booking

        if (titleOrDescription.getCurrentContent().hasText()) {


            let html = stateToHTML(titleOrDescription.getCurrentContent());

            this.setState({loading:true,error:{}})

            let {appointmentStartTime,appointmentDate,appointmentEndTime,_id,uuid,appointmentStatus} = this.props.booking

            let data = {
                appointmentScheduledStartTime:appointmentStartTime,
                appointmentScheduledEndTime:appointmentEndTime,
                appointmentScheduledStartDate:appointmentDate, //old time and date
                offset:UTC_OFFSET,
                ...this.state.booking ,
                titleOrDescription:html
            }


            if(data.address == '' || data.longitude == '' || data.latitude == ''){
                delete data.address
                delete data.longitude
                delete data.latitude
            }

            updateBooking(_id,data)
                .then(res=>{


                    getBookings().then(res=>{
                        if (res.data.data) {
                            this.setState({loading:false})
                            let {upcomingAppointment,pastAppointment} = res.data.data


                            upcomingAppointment = upcomingAppointment.map(item=>{ item.type = 'upcoming' ; return item })
                            pastAppointment = pastAppointment.map(item=>{ item.type = 'previous' ; return item })

                            let data = [...upcomingAppointment,...pastAppointment];


                            this.props.setBookings(data)
                            message.success('Update Booking Successful')
                            //  this.goTo('/')
                        }
                    },err=>{
                        this.setState({loading:false})
                    })
                }).catch(({response})=>{

                if(typeof response.data != 'undefined'){
                    message.error(response.data.message)

                    if(['book_date','book_time'].indexOf(response.data.error_field) != '-1'){
                        this.setState({error:{[response.data.error_field]:response.data.message}});
                    }

                }
                this.setState({loading:false})

            })

        }


    }
    handleChange(data){

        let new_info = {...this.state.booking}


        let keyChange = Object.keys(data)[0];


        if(keyChange == 'appointmentScheduledStartTime' || keyChange == 'appointmentScheduledEndTime'){

            /*
             * adjust time end later than start 1hour
             * when user change start time
             *
             * */

            switch (keyChange){
                case 'appointmentScheduledStartTime':
                {
                    let to_index =  TIME.indexOf(data[keyChange]) + 2
                    new_info['appointmentScheduledEndTime'] = TIME[to_index]
                    new_info['appointmentScheduledStartTime'] = data[keyChange]

                    break;
                }
                case 'appointmentScheduledEndTime':
                {

                    if(TIME.indexOf(new_info.appointmentScheduledStartTime) > TIME.indexOf(data[keyChange])) {
                        message.error('Opps , End Time should be great than Start Time');
                        return;
                    }
                    new_info['appointmentScheduledEndTime'] = data[keyChange]
                    new_info['appointmentScheduledStartTime'] = new_info.appointmentScheduledStartTime

                    break;
                }
            }


        }



        new_info[keyChange] = data[keyChange]



        this.setState({
            booking: new_info
        })
    }

    handleChangeDuration(type,change_type){
        let new_info = {...this.state.booking}


        switch (type){
            case 'from':
            {
                let from_index = (change_type == 'increase') ? TIME.indexOf(this.state.booking.appointmentScheduledStartTime) + 1 : TIME.indexOf(this.state.booking.appointmentScheduledStartTime) -1;
                let to_index =  from_index + 2;
                new_info['appointmentScheduledStartTime'] = TIME[from_index]
                new_info['appointmentScheduledEndTime'] = TIME[to_index]

                break;
            }
            case 'to':
            {
                let to_index =  (change_type == 'increase') ? TIME.indexOf(this.state.booking.appointmentScheduledEndTime) +1 : TIME.indexOf(this.state.booking.appointmentScheduledEndTime) -1;
                if(TIME.indexOf(this.state.booking.appointmentScheduledStartTime) > to_index -1) {
                    message.error('Opps , End Time should be great than Start Time');
                    return;
                }
                new_info['appointmentScheduledEndTime'] = TIME[to_index]
                break;
            }
        }
        this.setState({
            booking: new_info
        })
    }

    onExtraTimeChange = (e)=>{
        this.setState({
            extraTime:e.target.value
        })
    }


    handleTipForAgentCancel = ()=>{
        this.setState({ visibleTipFormModal: false });

    }

    handleTipForAgentCreate = ()=>{
        const tipFormRef = this.tipFormRef
        tipFormRef.validateFields((err, values) => {
            if (err) {
                return;
            }
            this.setState({loadingTipForAgent:true})

            let amount = values.amount_tip
            tipAgent(this.props.booking.agentData._id,amount).then(res=>{
                message.success(res.data.message)
                tipFormRef.resetFields()
                this.setState({visibleTipFormModal: false,loadingTipForAgent:false})
            },error=>{
                this.setState({visibleTipFormModal: false,loadingTipForAgent:false})
                let {response} = error
                message.error(response.data.message)
            })


        });
    }






    componentDidMount() {

        console.log(1);

       if(this.props.booking.titleOrDescription){
            const contentBlock = htmlToDraft(this.props.booking.titleOrDescription);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const outputEditorState = EditorState.createWithContent(contentState);

                this.setState (state=>{
                    return {
                        booking : { ...state.booking, titleOrDescription:outputEditorState }
                    }

                });
            }
        }


        this.renderAutoComplete()
    }

    handleEditorChange = (html)=>{


        this.setState (state=>{

            return {
                booking : {
                    ...state.booking,
                    titleOrDescription:html
                }
            }


        });
    }

    componentWillReceiveProps(newProps){




        if( typeof  newProps.booking.extraTime != 'undefined' && newProps.booking.extraTime ){

            this.setState({

                extraTime:newProps.booking.extraTime
            })

        }

    }

    render() {
        const props = this.props;
        const {google} = this.props;

        const {getFieldDecorator} = props.form;

        const Time_Options = TIME.map((d, i)=> {
            return (
                <Option  key="i" value={d}>{d}</Option>
            )
        })

        let {appointmentStatus,isModified} = this.props.booking;


        let [clientDate] = moment(new Date()).utcOffset(UTC_OFFSET).format('YYYY-MM-DD/HH:mm A').split('/');
        let shouldShowAddExtraTime = (new Date(this.props.booking.appointmentDate) - new Date(clientDate)) >= 0 ;

        let Disable = ([STATUS.EXPIRED,STATUS.CANCELLED,STATUS.REJECTED,STATUS.COMPLETED].indexOf(appointmentStatus) > -1)

        let Status = ()=>{
            let color = '#2db7f5'
            switch (appointmentStatus){
                case STATUS['PENDING']:
                    color = '#108ee9'
                    break;
                case STATUS['ACTIVE']:
                    color = '#f50'
                    break;
                case STATUS['ACCEPTED']:
                    color = '#00a854'
                    break;
                case STATUS['REJECTED']:
                    color = '#ffbf00'
                    break;
                case STATUS['CHANGE_REJECTED']:
                    color = '#ffbf00'
                    break;
                case STATUS['COMPLETED']:
                    color = '#87d068'
                    break;
            }
            return <Tag color={color} >{(isModified && appointmentStatus == STATUS['PENDING'])? 'CHANGE PENDING' : appointmentStatus.replace('_',' ')}</Tag>
        }

        const { dataSourceRender} = this.state;


        return (
            <div id="editbookingform">

                <SaveStyleCodeForm
                    visible={this.state.visibleSaveStyleCodeModal}
                    title="Save PhotoSesh Style Code"
                    okText="Save"
                    onCancel={this.handleStyleCodeCancel}
                    onCreate={this.handleStyleCodeCreate}
                    onStyleCodeCheckboxChange={this.onStyleCodeCheckboxChange}
                    isPublic={this.state.isPublic}
                    isStyleCodeAdmin={this.props.user.isStyleCodeAdmin}
                    loadingAddStyleCode={this.state.loadingAddStyleCode}
                    ref={this.saveStyleCodeFormRef}
                />
                <TipForm
                    visible={this.state.visibleTipFormModal}
                    title="Tip for photographer"
                    okText="Save"
                    onCancel={this.handleTipForAgentCancel}
                    onCreate={this.handleTipForAgentCreate}
                    loadingTipForAgent={this.state.loadingTipForAgent}
                    ref={this.saveTipFormRef}
                />
                <AddExtraTimeForm
                    visible={this.state.visibleAddExtraTime}
                    title="Add Extra Time"
                    okText="Save"
                    onCancel={this.handleExtraTimeCancel}
                    onCreate={this.handleExtraTimeCreate}
                    onExtraTimeChange={this.onExtraTimeChange}
                    extraTime={this.state.extraTime}
                    loadingExtraTime={this.state.loadingExtraTime}
                    ref={this.saveExtraFormRef}
                />



                <Form style={{maxWidth:1000}}  onSubmit={this.handleSubmit}>

                    <div className={style.box}>


                        <div className={classnames(style.header,style.inner_box)}>
                            <div className={style.status_wrap}>
                                {isDefine(appointmentStatus) && ( <Status /> )}
                            </div>

                            { !Disable && (
                                <div className={style.cancel_booking}>
                                    <Popconfirm title="Are you sure CANCEL this booking?"
                                                onConfirm={this.cancelBooking}
                                                okText="Yes"
                                                cancelText="No">
                                        <span>Cancel Booking</span>
                                    </Popconfirm>

                                </div>
                            )}

                            { STATUS.COMPLETED == appointmentStatus && (



                                <div className={style.extra_time}>
                                    {shouldShowAddExtraTime &&   <span onClick={(e)=>{
                                        e.preventDefault()

                                        this.setState((old_state)=>{

                                            return {
                                                visibleAddExtraTime : !old_state.visibleAddExtraTime
                                            }


                                        })


                                    }}>Add Extra Time</span>}

                                    <span onClick={(e)=>{
                                        e.preventDefault()

                                        this.setState((old_state)=>{

                                            return {
                                                visibleTipFormModal : !old_state.visibleTipFormModal
                                            }


                                        })


                                    }}>Tip For Photographer</span>
                                </div>
                            )}




                        </div>

                        <div className={style.inner_box}>



                            <div>
                                <label className={style['book-info-title']}>PhotoSesh Style Code (Optional)</label>
                                <FormItem style={{marginBottom:0}}>
                                    <AutoComplete
                                        dataSource={dataSourceRender}
                                        onSelect={this.handleSelect}
                                        onSearch={this.handleSearch}
                                        placeholder="Input or Search Style Guide Codes to prefill descriptions and instructions for your photographer."
                                    />
                                </FormItem>
                            </div>






                            <FormItem
                                label={(<span>Title / Description</span>)}
                                hasFeedback
                            >

                                <Editor
                                    editorState={this.state.booking.titleOrDescription}
                                    wrapperClassName="wrapper-description"
                                    editorClassName="wrapper-editor"
                                    onEditorStateChange={this.handleEditorChange}
                                />

                              {/*
                                {getFieldDecorator('titleOrDescription', {
                                    rules: [{
                                        required: true, message: 'Title or Description is not empty',
                                    },
                                    ],
                                    initialValue: this.props.booking.titleOrDescription
                                })(
                                    <TextArea disabled={Disable} rows={4} />
                                )}*/}
                            </FormItem>

                            {!Disable && (
                                <div>
                                    <a
                                        style={{
                                            float: 'right',
                                            marginTop: -15,
                                            background: '#fff',
                                            padding: '0 5px',
                                            border: '1px solid #fff',
                                        }}

                                        onClick={this.showStyleCodeModal} className={classnames(style['btn-save'])}><Icon type={'save'} /> save</a>
                                </div>
                            )}



                            {isDefine(this.props.booking.appointmentDate) && (

                                <FormItem
                                    label="Book Date"
                                    hasFeedback
                                >

                                    <DatePicker
                                        disabled={Disable}
                                        style={{width:'100%'}}
                                        disabledDate={(startValue) => {
                                            return startValue.valueOf() < new Date().setHours(0,0,0,0);
                                        }}
                                        format="YYYY-MM-DD"
                                        defaultValue={moment(this.props.booking.appointmentDate).subtract(UTC_OFFSET,'minutes')}
                                        onChange={(date,new_date)=>{this.handleChange({appointmentScheduledStartDate:new_date})}}
                                        allowClear={false}
                                    />


                                    {(this.state.error.book_date) && (
                                        <Alert
                                            message=""
                                            description={this.state.error.book_date}
                                            type="error"
                                        />
                                    )}





                                </FormItem>)}


                                <Row gutter={10}>
                                    <Col span={12}>
                                        {isDefine(this.props.booking.appointmentStartTime)&& (
                                            <FormItem
                                                label="Start Time"
                                                hasFeedback
                                                style={{width: '100%'}}
                                            >

                                                <Select
                                                    disabled={Disable}
                                                    style={{width: (Disable) ? '100%' : 'calc(100% - 30px)'}}
                                                    onChange={(time)=>this.handleChange({appointmentScheduledStartTime:time})}
                                                    defaultValue={this.props.booking.appointmentStartTime}
                                                    value={this.state.booking.appointmentScheduledStartTime}

                                                >
                                                    {Time_Options}
                                                </Select>

                                                <div
                                                    style={{width: '30px',float:'right',display:(Disable) ? 'none' : 'block'}}
                                                    className="wrap-icon-increase"
                                                >
                                                    <Icon
                                                        onClick={(e)=>this.handleChangeDuration('from','increase')}

                                                        type="plus-square-o" />

                                                    <Icon
                                                        onClick={(e)=>this.handleChangeDuration('from','decrease')}
                                                        type="minus-square-o" />
                                                </div>



                                            </FormItem>)}
                                    </Col>
                                    <Col span={12}>
                                        {isDefine(this.props.booking.appointmentEndTime)&& (
                                            <FormItem
                                                label="End Time"
                                                hasFeedback
                                                style={{width: '100%'}}
                                            >
                                                <Select
                                                    disabled={Disable}
                                                    style={{width: (Disable) ? '100%' : 'calc(100% - 30px)'}}
                                                    onChange={(time)=>this.handleChange({appointmentScheduledEndTime:time})}
                                                    defaultValue={this.props.booking.appointmentEndTime}
                                                    value={this.state.booking.appointmentScheduledEndTime}
                                                >
                                                    {Time_Options}
                                                </Select>

                                                <div
                                                    style={{width: '30px',float:'right',display:(Disable) ? 'none' : 'block'}}
                                                    className="wrap-icon-increase"


                                                >
                                                    <Icon
                                                        onClick={(e)=>this.handleChangeDuration('to','increase')}

                                                        type="plus-square-o" />

                                                    <Icon
                                                        onClick={(e)=>this.handleChangeDuration('to','decrease')}
                                                        type="minus-square-o" />
                                                </div>


                                            </FormItem>   )}

                                    </Col>

                                    {(this.state.error.book_time) && (
                                        <Alert
                                            message=""
                                            description={this.state.error.book_time}
                                            type="error"
                                        />
                                    )}

                                </Row>



                            <div>

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

                                    <FormItem label="Address">
                                        <Input
                                            disabled={Disable}
                                            ref='autocomplete'
                                            placeholder="Enter your location"
                                            defaultValue={this.props.booking.appointmentAddress}
                                            onChange={()=>{
                                                this.renderAutoComplete()
                                            }} />
                                    </FormItem>

                                </Map>

                            </div>


                            {!Disable && (
                                <div>
                                    <Popconfirm placement="top" title={'Are you sure you want to make this change?'} onConfirm={(e)=>{
                                        this.handleSubmit(e)
                                    }} okText="Yes" cancelText="No">
                                        <Button
                                            type="primary"
                                            icon="save"
                                            loading={this.state.loading}  className={style.btn_update_booking}>Update</Button>
                                    </Popconfirm>

                                </div>
                            )}


                        </div>


                    </div>

                </Form>
            </div>
        )
    }

}



EditBookingForm.propTypes = {
    booking: PropTypes.object.isRequired,
}


const XXX = Form.create()(EditBookingForm);
const WrapEditBookingForm = compose(
    withProps({
        googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${GG_MAP_APIKEY}&v=3.exp&libraries=geometry,drawing,places`,
        loadingElement: <div style={{ height: `100%` }} />,
        mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs
)(props => <XXX {...props} />);



const mapStateToProps = (state)=>{
    return {
        bookings : state.projects.bookings,
        user:state.auth.user
    }
}



export default connect(mapStateToProps,{setBookings})(WrapEditBookingForm)