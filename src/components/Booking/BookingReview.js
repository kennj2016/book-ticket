import style from './booking_review.css'
import React, {Component} from 'react'
import moment from 'moment'
import { Popover,AutoComplete, Button, Card, Checkbox, Col, Divider, Form, Icon, Input, message, Modal, notification, Row, Upload} from 'antd';
import {Link} from 'react-router-dom'
import {NOW, UTC_OFFSET} from '../../define'
import {getAllCharities, postBooking, getChartitySetting,getStyleCodeIconSetting} from '../../actions/bookActions'
import {connect} from 'react-redux'
import {getCards, setCardDefault} from '../../actions/paymentActions'
import {cleanSlug, cleanSlugTitleEvent, getPhotogapherName} from '../../utils/helper'
import SelectCard from './Include/SelectCard'
import {NavigateMobile, ProcessStep} from './ProcessStep'
import classnames from 'classnames'
import {addStyleCode, searchStyleCodes,saveNewStyleCode} from '../../actions/userActions'
import {resendEmailVerify} from '../../actions/authActions'
import {isMobile} from 'react-device-detect'
import Rate2 from './Include/Rate2'

import {Editor} from "react-draft-wysiwyg";
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {ContentState, convertFromHTML, EditorState} from 'draft-js';


import {stateToHTML} from 'draft-js-export-html';


// Require Editor JS files.

import {openNotificationWithIcon} from '../../HandleNotification'
import {
    InfoCircleOutlined,
} from '@ant-design/icons';
const InputGroup = Input.Group;
const FormItem = Form.Item;
const {TextArea} = Input;
const optionsCovidFund = [
    {"label": "Water Mission", "value": "water_mission"},
    {"label": "World Vision", "value": "world_vision"},
    {"label": "Americares", "value": "americares"},
    {"label": "Heart to Heart International", "value": "heart_to_heart_international"},
    {"label": "GlobalGiving", "value": "globalgiving"},
    {"label": "UNICEF USA", "value": "unicef_usa"},
    {"label": "Direct Relief", "value": "direct_relief"},
    {"label": "International Medical Corps", "value": "international_medical_corps"},
    {"label": "CDC Foundation", "value": "cdc_foundation"},
    {"label": "Lutheran World Relief", "value": "lutheran_world_relief"},
    {"label": "Good360", "value": "good360"},
    {"label": "MedShare", "value": "medshare"},
    {"label": "Giving Children Hope", "value": "giving_children_hope"},
    {"label": "Child Foundation", "value": "child_foundation"},
    {"label": "Brother's Brother Foundation", "value": "brothers_brother_foundation"},
    {"label": "American Red Cross", "value": "american_red_cross"},
    {"label": "Project HOPE", "value": "project_hope"},
    {"label": "World Hope International", "value": "world_hope_international"}
];
notification.config({
    duration: 6,
});
const openNotification = (type, placement, message) => {
    notification.destroy()
    notification[type]({
        message: `ERROR : Book PhotoSesh`,
        description: message,
        placement
    });
};


function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

const SaveStyleCodeForm = Form.create()(
    (props) => {
        const {visible, onCancel, onCreate, form, onStyleCodeCheckboxChange, isPublic, loadingAddStyleCode, isStyleCodeAdmin} = props;
        const {getFieldDecorator} = form;
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
                                {required: true, message: 'please enter style code'},
                                {min: 3, message: 'code at least 3 characters'},
                                {
                                    pattern: /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/,
                                    message: 'The code invalid (please don\'t use space or special character)'
                                }

                            ],
                        })(
                            <Input/>
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
                        <strong>Instructions</strong>: Save a template with your own PhotoSesh Style Code (Ex: BLOGSHOOT). Anytime you use this code for a new PhotoSesh request, it will load all of
                        the details and instructions that you've previously saved on this code. Each time you use a Style Code, you can submit as is or edit the details further.

                    </div>


                    <div>
                        <Button

                            loading={loadingAddStyleCode}
                            style={{
                                float: 'right',
                                borderRadius: 2,
                                background: 'black',
                                border: 0
                            }} type="primary" icon="save" onClick={onCreate}> Save</Button>
                    </div>


                </Form>
            </Modal>
        );
    }
);


class ShowDirectoryStyleCodeClass extends Component {

    constructor(props) {
        super(props);

        this.state = {
            draffText: '',
            filterKeyword: '',
            editorOptions: {
                options: [
                    'inline'
                ],
                inline: {
                    inDropdown: false,
                    className: undefined,
                    component: undefined,
                    dropdownClassName: undefined,
                    options: ['bold', 'italic', 'underline', 'monospace']
                }
            }

        }
    }




    render() {

        const {visible, onSelectStyleCode, onCancel, form} = this.props;
        const {getFieldDecorator} = form
        let {personalStyleCodes, publicStyleCodes} = this.props;
        let filterKeyword = form.getFieldValue('filterKeyword')
        let filterFN = (item, keyword) => {
            let {code, description} = item

            code = code.toLowerCase()
            description = description.toLowerCase()
            return code.indexOf(keyword) > -1 || description.indexOf(keyword) > -1
        }
        if (typeof filterKeyword != 'undefined' && filterKeyword != '') {
            filterKeyword = filterKeyword.toLowerCase()
            personalStyleCodes = personalStyleCodes.filter((item) => {
                return filterFN(item, filterKeyword)
            })
            publicStyleCodes = publicStyleCodes.filter((item) => {
                return filterFN(item, filterKeyword)
            })
        }

        return (
            <Modal
                width={800}
                visible={visible}
                title={
                    (
                        <div style={{textAlign: 'center'}}>
                            <h2>Booking Style Guide Codes </h2>
                            <p>(Directory)</p>
                        </div>
                    )
                }
                afterClose={() => {
                    this.props.form.setFields({
                        filterKeyword: {
                            value: ''
                        }
                    });
                }}
                okText="Create"
                onCancel={onCancel}
                footer={null}

            >
                <Row gutter={15}>
                    <Col xs={{span: 16, offset: 4}} sm={{span: 16, offset: 4}} md={{span: 16, offset: 4}}
                         lg={{span: 16, offset: 4}} xl={{span: 16, offset: 4}}>

                        {getFieldDecorator('filterKeyword', {})(
                            <Input
                                addonBefore={(<Icon type="search"/>)}
                                style={{marginBottom: 20}}
                                placeholder="Search"/>
                        )}


                    </Col>
                </Row>

                <Row gutter={15}>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                        <h3 style={{marginBottom: 10}}>Personal Style Guide Codes:</h3>


                        <div className={style.list_wrap}>
                            {personalStyleCodes.map(item => {
                                return (
                                    <div
                                        className={style.popup_item}
                                        key={item._id}
                                        onClick={() => {

                                            const blocksFromHTML = convertFromHTML(item.description);
                                            const state = ContentState.createFromBlockArray(
                                                blocksFromHTML.contentBlocks,
                                                blocksFromHTML.entityMap
                                            );


                                            this.setState({draffText:EditorState.createWithContent(state)})

                                        }}>
                                        <strong>{item.code}</strong>
                                        <span dangerouslySetInnerHTML={{__html:item.description}}>
                                        </span>
                                    </div>
                                )
                            })}

                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                        <h3 style={{marginBottom: 10}}> Public Style Guide Codes:</h3>
                        <div className={style.list_wrap}>
                            {publicStyleCodes.map(item => {
                                return (
                                    <div
                                        className={style.popup_item}
                                        key={item._id}
                                        onClick={() => {


                                            const blocksFromHTML = convertFromHTML(item.description);
                                            const state = ContentState.createFromBlockArray(
                                                blocksFromHTML.contentBlocks,
                                                blocksFromHTML.entityMap
                                            );


                                            this.setState({draffText:EditorState.createWithContent(state)})

                                        }}>
                                        <strong>{item.code}</strong>
                                        <span dangerouslySetInnerHTML={{__html:item.description}}>
                                        </span>
                                    </div>
                                )
                            })}
                        </div>

                    </Col>
                </Row>
                <Row>
                    <h3 style={{marginTop: 20}}>Preview of description and instructions for the photographer:</h3>


                    <Editor
                        editorState={this.state.draffText}
                        wrapperClassName="wrapper-description"
                        editorClassName="wrapper-editor"
                        onEditorStateChange={(html) => {

                            this.setState({
                                draffText: html
                            });
                        }}
                        toolbarClassName="toolbar-class"
                        toolbar={{
                            options: ['inline', 'link', 'embedded', 'emoji', 'history'],
                            inline: {
                                inDropdown: false,
                                options: ['bold', 'italic', 'underline']
                            },
                            textAlign: {
                                inDropdown: true,
                                options: [],
                            },
                            link: {
                                options: ['link']
                            }
                        }}
                    />

                </Row>


                <Row>
                    <div style={{textAlign: 'center'}}>
                        <a
                            className={style.btn_use_code}
                            onClick={() =>
                            {
                                let html = stateToHTML(this.state.draffText.getCurrentContent());

                                onSelectStyleCode(html)
                            }}>Use This Code</a>

                        <span style={{cursor: 'pointer'}} onClick={() => onCancel()}>Cancel</span>
                    </div>

                </Row>

            </Modal>
        )
    }


}

const ShowDirectoryStyleCode = Form.create()(ShowDirectoryStyleCodeClass)

class BookingReview extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visibleEditHourly: false,
            visibleShowDirectoryStyleCode: false,
            visibleSaveStyleCodeModal: false,
            visiblePhotoseshCovid: false,
            loading: false,
            loadingAddStyleCode: false,
            has_card_default: true,
            visibleModalCard: false,
            checked_set_card_default: false,
            dataSourceRender: [],
            charitiesChecked: [],
            dataSource: [],
            publicStyleCodes: [],
            wait: false,
            isPublic: false,
            description: EditorState.createEmpty(),

            previewVisible: false,
            previewImage: '',
            fileList: [],
            optionsCovidFund: [],
            showCharityPopup: false,
            contentCharitySetting: '',
            titleCharity: '',
            iconTitle: '',
            iconText: '',
            hour_from:75,
            hour_to:95
        };
    }
    hideEditHourly = () => {
        this.setState({
            visibleEditHourly: false,
        });
    };

    handleVisibleEditHourly = visibleEditHourly => {
        this.setState({ visibleEditHourly });
    };

    handleResendEmailVerify = (e) => {
        e.preventDefault()

        resendEmailVerify(this.props.user.email).then(res => {
            message.info('email has sent')
        })

    }

    handleCancel = () => this.setState({previewVisible: false});
    handleEditorChange = (html) => {
        this.setState({
            description: html
        });
    }
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };
    handleChangeFile = ({fileList}) => this.setState({fileList});

    onStyleCodeCheckboxChange = (e) => {
        this.setState({isPublic: e.target.checked})
    }
    showStyleCodeModal = () => {
        this.setState({visibleSaveStyleCodeModal: true});
    }

    handleStyleCodeCancel = () => {
        this.setState({visibleSaveStyleCodeModal: false});
    }

    handleStyleCodeCreate = () => {
        const styleCodeForm = this.styleCodeForm,
            {isPublic, description,publicStyleCodes} = this.state;

        let html = stateToHTML(description.getCurrentContent());

        styleCodeForm.validateFields((err, values) => {
            if (err) {
                return;
            }
            this.setState({loadingAddStyleCode: true})

            values.description = html;
            values.isPublic = isPublic;

            addStyleCode(values).then(res => {
                console.log(res.data);

                if(isPublic){
                    this.setState({
                        publicStyleCodes:[...publicStyleCodes,res.data.data]
                    })
                }else{
                    this.props.saveNewStyleCode(res.data.data)
                }

                message.success(res.data.message)
                styleCodeForm.resetFields()
                this.setState({visibleSaveStyleCodeModal: false, loadingAddStyleCode: false})
            }, error => {
                this.setState({visibleSaveStyleCodeModal: false, loadingAddStyleCode: false})
                let {response} = error
                message.error(response.data.message)
            })


        });
    }

    saveFormRef = (form) => {
        this.styleCodeForm = form;
    }

    handleSelect = (code) => {

        let item = this.state.dataSource.find(item => item.code == code)

        if (item.description != '') {


            const blocksFromHTML = convertFromHTML(item.description);
            const state = ContentState.createFromBlockArray(
                blocksFromHTML.contentBlocks,
                blocksFromHTML.entityMap
            );


            this.setState({
                description: EditorState.createWithContent(state),
            })
        }

    }
    handleSearch = (value) => {


        if (!this.state.wait) {
            this.setState({wait: true})
            searchStyleCodes(value).then(res => {

                let dataSourceRender = res.data.data.map(item => {
                    return item.code
                })
                this.setState({
                    dataSourceRender,
                    dataSource: res.data.data,
                    wait: false
                });
            }).catch(err => {
                this.setState({wait: false})
            })
        }

    }

    popupSelectCard = (e) => {
        e.preventDefault();

        this.setState({visibleModalCard: true})
    }

    hideModal = (e) => {
        e.preventDefault();

        this.setState({visibleModalCard: false})

    }

    goTo(route) {
        this.props.history.replace(route)
    }

    showFundCovidModal = e => {
        e.preventDefault();
        const {description} = this.state
        if (description.getCurrentContent().hasText()) {

            if (!this.props.is_ready_card_booking) {

                console.log('error : card not selected before booking');
                openNotification('error', 'topRight', 'Please Select Credit Card before Booking PhotoSesh')

                return;
            }
            this.setState({
                visiblePhotoseshCovid: true
            })
        } else {
            openNotification('error', 'topRight', 'Please enter Title/Description before booking PhotoSesh')
            return;
        }


    }


    handleSubmit = (e) => {
        e.preventDefault();

        const {description, fileList} = this.state
        let {charitiesChecked} = this.state


        charitiesChecked = charitiesChecked.filter(el => el);


        if (description.getCurrentContent().hasText()) {

            if (!this.props.is_ready_card_booking) {

                console.log('error : card not selected before booking');
                openNotification('error', 'topRight', 'Please Select Credit Card before Booking PhotoSesh')

                return;
            }


            let html = stateToHTML(description.getCurrentContent());

            if (this.state.checked_set_card_default) {

                if (this.props.payment.cards.filter(card => (card._id == this.props.card_booking._id) && card.isDefault).length == 0) {
                    this.props.setCardDefault(this.props.card_booking._id)
                }
            }

            let agentIds = this.props.bookinfo.info.photographers_request;

            console.log(agentIds);
            let formData = new FormData();

            if (fileList.length > 0) {
                let attachments = fileList.map(file => file.originFileObj)
                attachments.forEach(file => {
                    formData.append('attachments[]', file, file.name)
                })
            }
            if(this.props.smart_match && this.props.bookinfo.info.photographers_request.length < 5){
                // wwhen smart_match is active , any ids of agent will be removed
                // photosesh concierge team will assign agent later
                agentIds = ['xxx-smart-match-xxx']
            }

            formData.append('address', this.props.bookinfo.info.place);
            formData.append('agentIds', JSON.stringify(agentIds));
            formData.append('charities', JSON.stringify(charitiesChecked));
            formData.append('appointmentDate', moment(this.props.bookinfo.info.date).format('YYYY-MM-DD'));
            formData.append('appointmentTime', this.props.bookinfo.info.from);
            formData.append('appointmentEndTime', this.props.bookinfo.info.to);
            formData.append('agentType', this.props.bookinfo.info.photosesh_type_name);
            formData.append('eventType', this.props.bookinfo.info.photosesh_event_type);
            formData.append('longitude', this.props.bookinfo.info.position.lng);
            formData.append('latitude', this.props.bookinfo.info.position.lat);
            formData.append('photoSeshNow', (this.props.bookinfo.book_type == NOW) ? true : false);
            formData.append('offset', UTC_OFFSET);
            formData.append('bookingDevice', 'WEB');
            formData.append('isReschedule', false);
            formData.append('appointmentDuration', this.props.bookinfo.info.duration);
            formData.append('previousBookingId', '');
            formData.append('paymentCardId', this.props.card_booking._id);
            formData.append('titleOrDescription', html)
            if( this.props.smart_match){
                formData.append('smart_match', true)
            }
            if( this.props.smart_match && this.props.bookinfo.info.photographers_request.length < 5){
                // ids fake


                formData.append('hourlyRateFrom', this.state.hour_from)
                formData.append('hourlyRateTo',  this.state.hour_to)
            }

            this.setState({loading: true})
            postBooking(formData).then(res => {
                let data = res.data.data
                if (res.status == 200) {
                    let message = data.message
                }


                this.setState({loading: false})
                this.goTo('/book/success')


            }).catch(err => {
                let data = err.response.data
                if (data.message == "This invitation is expired.") {
                    message.error(data)
                }

            })
        } else {
            openNotification('error', 'topRight', 'Please enter Title/Description before booking PhotoSesh')


            return;
        }
    }

    componentWillReceiveProps(props) {

        if(!props.smart_match){
            if (props.bookinfo.info.photographers_request.length == 0 || props.bookinfo.photographers.length == 0) {
                this.goTo('/book/photographers')


            }
        }


    }

    componentDidMount() {
        getAllCharities().then(res => this.setState({optionsCovidFund: res.data.data}));
        const isAuthenticated = this.props.isAuthenticated
        getChartitySetting().then(res => {
            if (res.data.statusCode === 200) {
                const {data} = res.data;
                this.setState({showCharityPopup: data.status, contentCharitySetting: data.text, titleCharity: data.title});
            }
        }).catch(err => console.log(err));
        getStyleCodeIconSetting().then(res => {
            if (res.data.statusCode === 200) {
                const {data} = res.data;
                this.setState({iconTitle: data.style_code_icon_title, iconText: data.style_code_icon_text});
            }
        }).catch(err => console.log(err));


        if (isAuthenticated) {

            /*
             * get personal stylecode and public style code
             * */
            searchStyleCodes('').then(res => {

                let allStyleCode = res.data.data

                console.log(allStyleCode);
                console.log(listIds);


                let listIds = this.props.user.styleCodes.map(item => item._id)


                this.setState({publicStyleCodes: [...allStyleCode.filter(item => listIds.indexOf(item._id) == -1), ...this.props.user.styleCodes.filter(item => item.isPublic)]})

            });
            this.props.getCards()

        }
    }


    onSelectStyleCode = (description) => {

        this.setState({visibleShowDirectoryStyleCode: false})


        const blocksFromHTML = convertFromHTML(description);
        const state = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap
        );


        this.setState({
            description: EditorState.createWithContent(state),
        })

        message.success('Apply Style Guide Code Successfully')
    }
    toggleInputStyleCode = (e) => {
        e.preventDefault()
        this.setState(state => {

            return {
                showInputStyleCode: !state.showInputStyleCode
            }
        })
    }


    handleFormSubmit = (e) => {
        e.preventDefault()
        let {showCharityPopup} = this.state;
        if (showCharityPopup) {
            this.showFundCovidModal(e)
        } else {
            this.handleSubmit(e)
        }
    }

    render() {

        let {charitiesChecked, optionsCovidFund, contentCharitySetting, titleCharity,hour_from,hour_to} = this.state;


        charitiesChecked = charitiesChecked.filter(el => el);

        const {bookinfo, isAuthenticated} = this.props
        const {getFieldDecorator, getFieldValue} = this.props.form;

        let photographers_request = this.props.bookinfo.photographers.filter(p => {
            return this.props.bookinfo.info.photographers_request.indexOf(p._id) != '-1'
        })

        const {dataSourceRender, description} = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );


        let cost_from = parseFloat(bookinfo.info.duration * hour_from).toFixed(2)
        let cost_to = parseFloat(bookinfo.info.duration * hour_to).toFixed(2)

        console.log('s',this.props.bookinfo);

        let shouldShowSmartMatch  = this.props.smart_match && this.props.bookinfo.info.photographers_request.length < 5
        let shouldShowPhotographerList  = (this.props.smart_match && this.props.bookinfo.info.photographers_request.length > 5) ||
            (!this.props.smart_match)




        let styleOrangeText = {
            color:'#e9550f',
            fontWeight:'bold'
        }
        if (isAuthenticated) {
            return (
                <div className={style['full-height']}>
                    <NavigateMobile {...this.props} />
                    <ShowDirectoryStyleCode
                        visible={this.state.visibleShowDirectoryStyleCode}
                        onSelectStyleCode={this.onSelectStyleCode}
                        personalStyleCodes={this.props.user.styleCodes.filter(item => !item.isPublic)}
                        publicStyleCodes={this.state.publicStyleCodes}

                        onCancel={() => {
                            this.setState({visibleShowDirectoryStyleCode: false})
                        }}
                    />


                    <Modal
                        className={'covid-modal'}
                        width={700}
                        title={titleCharity}
                        visible={this.state.visiblePhotoseshCovid}
                        onOk={e => {}}
                        text-center
                        onCancel={e => {
                            this.setState({visiblePhotoseshCovid: false})
                        }}
                        footer={null}
                    >


                        <div dangerouslySetInnerHTML={{__html: contentCharitySetting}}/>

                        <div>

                            <Checkbox.Group style={{width: '100%'}}
                                            defaultValue={['']}
                                            onChange={checkedValues => {
                                                checkedValues = checkedValues.filter(el => el);
                                                if (checkedValues.length <= 3) {
                                                    this.setState({charitiesChecked: checkedValues})
                                                } else {
                                                    message.error('Please Choose up to 3 charities')
                                                }


                                            }}
                            >

                                <p><Checkbox disabled={charitiesChecked.length == 3 && charitiesChecked.indexOf('COVID-19-Response-Fund') == -1} value={'COVID-19-Response-Fund'}><strong>COVID-19
                                    Response Fund</strong> </Checkbox> (Organized by the Center for Disaster Philanthropy helps fund response and recovery efforts for those affected and for
                                    responders)</p>

                                <p>Below are other trustworthy charities to consider who are dedicating resources to the outbreak.</p>

                                <Row>
                                    {
                                        optionsCovidFund.length ? optionsCovidFund.map(obj => {


                                            return (

                                                <Col span={8}>
                                                    <Checkbox disabled={charitiesChecked.length == 3 && charitiesChecked.indexOf(obj.value) == -1} value={obj.value}>{obj.label}</Checkbox>
                                                </Col>


                                            )
                                        }) : []
                                    }
                                </Row>
                            </Checkbox.Group>


                        </div>
                        <Divider/>
                        <div>

                            <Button style={{float: 'right'}} disabled={!charitiesChecked.length} onClick={this.handleSubmit} type={'primary'} loading={this.state.loading}>Finalize Booking</Button>

                        </div>

                    </Modal>

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
                        ref={this.saveFormRef}
                    />


                    {!isMobile && (
                        <div style={{margin: '30px auto', padding: 5, maxWidth: '90%'}} className="sticky">
                            <ProcessStep current={4} {...this.props} />
                        </div>
                    )}


                    <div className={style.book_review}>

                        <Row>
                            <Col xs={{span: 24, offset: 0}}
                                 sm={{span: 18, offset: 3}}
                                 md={{span: 18, offset: 3}}
                                 lg={{span: 18, offset: 3}}
                                 xl={{span: 16, offset: 4}}>
                                <Card className={style['ant-card']}>
                                    <h2 className={style['title']}>Booking Review</h2>
                                    <Form onSubmit={this.handleFormSubmit}>

                                        <Row>
                                            <Col xs={{span: 18, offset: 0}}
                                                 sm={{span: 18, offset: 0}}
                                                 md={{span: 18, offset: 0}}
                                                 lg={{span: 18, offset: 0}}
                                                 xl={{span: 18, offset: 0}}>
                                                <label className={style['book-info-title']}>PhotoSesh Style Code :
                                                    <span style={{marginLeft: 5, cursor: 'pointer', color: 'red'}} onClick={this.toggleInputStyleCode}>Click Here to Enter Style Code</span> (Optional)


                                                    <Popover content={(<div> { this.state.iconText }</div>)} title={this.state.iconTitle}>
                                                             <span className="icon-info">
                                                            <img src="/images/icon_info_blue.png" alt="" />
                                                        </span>
                                                    </Popover>
                                                    </label>
                                                <FormItem style={{marginBottom: 0}}>
                                                    {this.state.showInputStyleCode && (
                                                        <AutoComplete
                                                            dataSource={dataSourceRender}
                                                            onSelect={this.handleSelect}
                                                            onSearch={this.handleSearch}
                                                            placeholder="Input or Search Style Guide Codes to prefill descriptions and instructions for your photographer."
                                                        />
                                                    )}

                                                </FormItem>
                                            </Col>
                                            <Col xs={{span: 6, offset: 0}}
                                                 sm={{span: 6, offset: 0}}
                                                 md={{span: 6, offset: 0}}
                                                 lg={{span: 6, offset: 0}}
                                                 xl={{span: 6, offset: 0}}>
                                                <a onClick={() => {
                                                    this.setState({visibleShowDirectoryStyleCode: true})
                                                }} className={classnames(style['btn-directory'])}>
                                                    <span style={{marginRight: 2}}><Icon type={'save'}/></span> Style Code Directory</a>
                                            </Col>
                                        </Row>

                                        <Row className={style.row}>
                                            <Col xs={{span: 18, offset: 0}}
                                                 sm={{span: 18, offset: 0}}
                                                 md={{span: 18, offset: 0}}
                                                 lg={{span: 18, offset: 0}}
                                                 xl={{span: 18, offset: 0}}>
                                                <label className={style['book-info-title']}>Title/Description</label>

                                                <FormItem>
                                                    <Editor
                                                        editorState={this.state.description}
                                                        wrapperClassName="wrapper-description"
                                                        editorClassName="wrapper-editor"
                                                        onEditorStateChange={this.handleEditorChange}
                                                        toolbarClassName="toolbar-class"
                                                        toolbar={{
                                                            options: ['inline', 'link', 'embedded', 'emoji', 'history'],
                                                            inline: {
                                                                inDropdown: false,
                                                                options: ['bold', 'italic', 'underline']
                                                            },
                                                            textAlign: {
                                                                inDropdown: true,
                                                                options: [],
                                                            },
                                                            link: {
                                                                options: ['link']
                                                            }
                                                        }}
                                                    />

                                                </FormItem>
                                            </Col>

                                            <Col xs={{span: 6, offset: 0}}
                                                 sm={{span: 6, offset: 0}}
                                                 md={{span: 6, offset: 0}}
                                                 lg={{span: 6, offset: 0}}
                                                 xl={{span: 6, offset: 0}}>
                                                <div style={{
                                                    marginLeft: 10,
                                                    textAlign: 'center',
                                                    fontSize: 12,
                                                    marginTop: 20
                                                }}>Save Template For Similar Bookings
                                                </div>

                                                <a onClick={this.showStyleCodeModal}
                                                   className={classnames(style['btn-directory'], (description) ? '' : 'disabled')}
                                                   style={{marginTop: 0}}
                                                ><Icon type={'save'}/> save</a>
                                            </Col>
                                        </Row>

                                        <div>
                                            <div><label>Attachments:</label></div>
                                            <Upload
                                                multiple={true}
                                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                                listType="picture-card"
                                                fileList={this.state.fileList}
                                                onPreview={this.handlePreview}
                                                onChange={this.handleChangeFile}
                                            >
                                                {this.state.fileList.length >= 3 ? null : uploadButton}
                                            </Upload>
                                            <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                                                <img alt="example" style={{width: '100%'}} src={this.state.previewImage}/>
                                            </Modal>
                                        </div>

                                        <Row className={style.row}>


                                            {!this.props.isVerified && (

                                                <Button

                                                    onClick={e => {

                                                        openNotificationWithIcon('ERROR !!! ', (<div>

                                                            You Must Verify Your Email Address Before Proceeding. Click <a onClick={this.handleResendEmailVerify}>HERE</a> to Resend Verification Email
                                                        </div>), 'info')

                                                    }}

                                                    className={'btn-submit'} type="primary">
                                                    Book PhotoSesh
                                                </Button>

                                            )}
                                            {this.props.isVerified && (<Button loading={this.state.loading}
                                                                               htmlType="submit" className={'btn-submit'} type="primary">
                                                Book PhotoSesh
                                            </Button>)}


                                        </Row>
                                        <Row className={style.row}>
                                            <Col xs={24} sm={10} md={10} lg={8} xl={8}>
                                                <label className="book-info-title">Event Type</label>
                                            </Col>

                                            <Col xs={24} sm={14} md={14} lg={16} xl={16}>
                                                <h2 className="title-medium">{cleanSlugTitleEvent(bookinfo.info.photosesh_event_type)}</h2>
                                            </Col>
                                        </Row>


                                        <Row className={style.row}>
                                            <Col xs={24} sm={10} md={10} lg={8} xl={8}>
                                                <label className="book-info-title">Photographer Type</label>
                                            </Col>
                                            <Col xs={24} sm={14} md={14} lg={16} xl={16}>
                                                <h2 className="title-medium">
                                                    {cleanSlug(bookinfo.info.photosesh_type_name).replace('photosesh', 'PhotoSesh')}
                                                </h2>
                                            </Col>
                                        </Row>


                                        <Row className={style.row}>
                                            <Col xs={24} sm={10} md={10} lg={8} xl={8}>
                                                <label className="book-info-title">Service Location</label>
                                            </Col>
                                            <Col xs={24} sm={14} md={14} lg={16} xl={16}>
                                                {bookinfo.info.place}
                                            </Col>
                                        </Row>


                                        <Row className={style.row}>
                                            <Col xs={24} sm={10} md={10} lg={8} xl={8}>
                                                <label className="book-info-title">Scheduled For</label>
                                            </Col>
                                            <Col xs={24} sm={14} md={14} lg={16} xl={16}>
                                                {moment(bookinfo.info.date).format("MM - DD - YYYY")}
                                            </Col>
                                        </Row>

                                        <Row className={style.row}>
                                            <Col xs={24} sm={10} md={10} lg={8} xl={8}>
                                                <label className="book-info-title">Time</label>
                                            </Col>
                                            <Col xs={24} sm={14} md={14} lg={16} xl={16}>
                                                {bookinfo.info.from} - {bookinfo.info.to} {bookinfo.info.duration}
                                                hour(s)
                                            </Col>
                                        </Row>

                                        {shouldShowSmartMatch && (
                                            <div>
                                                <Row className={style.row}>
                                                    <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                                        <label className="book-info-title" style={styleOrangeText}>Smart Match Details:</label>
                                                    </Col>
                                                    <Col xs={24} sm={16} md={16} lg={16} xl={16}>
                                                        <div style={styleOrangeText}>The PhotoSesh Concierge Team will assign the most suitable photographer to meet your needs.</div>

                                                    </Col>
                                                </Row>


                                                <Row className={style.row}>
                                                    <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                                        <label className="book-info-title" style={styleOrangeText}>Hourly Rate: </label>
                                                    </Col>
                                                    <Col xs={24} sm={16} md={16} lg={16} xl={16}>
                                                        <strong>$ {hour_from} - {hour_to}  / hr</strong>

                                                        <Popover
                                                            content={(<div>

                                                                <InputGroup size="large">
                                                                    <Row gutter={8}>
                                                                        <Col span={8}>
                                                                            <Input pattern="[0-9]*" value={hour_from} onChange={e=>this.setState({hour_from:e.target.value.replace(/\D/,'')})} defaultValue={hour_from} />
                                                                        </Col>
                                                                        <Col span={8}>
                                                                            <Input pattern="[0-9]*" value={hour_to} onChange={e=>this.setState({hour_to:e.target.value.replace(/\D/,'')})}  defaultValue={hour_to}/>
                                                                        </Col>
                                                                    </Row>
                                                                </InputGroup>

                                                                <Button type={'primary'} style={{marginTop:15}} onClick={this.hideEditHourly}>Ok</Button>

                                                                <Button style={{marginLeft:10}}  onClick={this.hideEditHourly}>Cancel</Button>




                                                            </div>)}
                                                            title="Edit Hourly Rate"
                                                            trigger="click"
                                                            visible={this.state.visibleEditHourly}
                                                            onVisibleChange={this.handleVisibleEditHourly}
                                                        >
                                                            <span style={{color:'#e9550f',marginLeft:10,cursor:'pointer'}}>edit</span>
                                                        </Popover>

                                                    </Col>
                                                </Row>


                                                <Row className={style.row}>
                                                    <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                                        <label className="book-info-title" style={styleOrangeText}>Estimated Cost: </label>
                                                    </Col>
                                                    <Col xs={24} sm={16} md={16} lg={16} xl={16}>
                                                       <strong> $ {cost_from} - {cost_to}</strong>
                                                    </Col>
                                                </Row>
                                            </div>
                                        )}


                                        {shouldShowPhotographerList && (
                                            <Row className={style.row}>
                                                <Col xs={24} sm={24} md={24} lg={24} xl={24} className={style.footer}>

                                                    <h4 className="book-info-title">Photographers Requested : </h4>


                                                    {photographers_request.map(photographer => {

                                                        return (
                                                            <div key={photographer._id}>
                                                                <div style={{width: '100%', overflow: 'hidden'}}>
                                                                    <span style={{float: 'left'}}>{getPhotogapherName(photographer.name)}</span>
                                                                    <span
                                                                        style={{float: 'right'}}>${photographer.agentPrice}/hr</span>
                                                                </div>
                                                                <div className={style['custom-card-booking-review']}>

                                                                    <div style={{float: 'left'}}><Rate2 count={6} defaultValue={photographer.rating}/></div>
                                                                    <span
                                                                        style={{float: 'right'}}> {moment(bookinfo.info.date).format("MMMM Do YYYY ")}
                                                                        at {bookinfo.info.from}</span>
                                                                </div>
                                                            </div>
                                                        )

                                                    })}


                                                </Col>
                                            </Row>
                                        )}







                                        {this.props.has_card && Object.keys(this.props.card_booking).length > 0 && (
                                            <Row>
                                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                                    <div style={{
                                                        padding: '20px 10px',
                                                        background: '#cecece',
                                                        textAlign: 'center',
                                                        fontSize: 18,
                                                        color: '#444140',
                                                        border: '1px solid #84878a',

                                                    }}>Card : ************ {this.props.card_booking.lastFourDigits}
                                                        ({this.props.card_booking.cardType})
                                                    </div>

                                                    <div>

                                                        <Checkbox onChange={(e) => {
                                                            this.setState({checked_set_card_default: e.target.checked});
                                                        }} defaultChecked={false}>Set Card Default</Checkbox>
                                                    </div>
                                                </Col>
                                            </Row>
                                        )}


                                        <Row className={style.row}>
                                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>

                                                <Button
                                                    style={{
                                                        background: 'none',
                                                        color: '#4b4b4b'
                                                    }}
                                                    onClick={this.popupSelectCard} className={'btn-submit'}
                                                    type="primary">


                                                    {!this.props.is_ready_card_booking && ('Select Card')}
                                                    {this.props.is_ready_card_booking && ('Select Another Card')}


                                                </Button>

                                            </Col>
                                        </Row>

                                    </Form>
                                </Card>


                                <Modal
                                    title="Select Card"
                                    visible={this.state.visibleModalCard}
                                    onOk={this.hideModal}
                                    onCancel={this.hideModal}
                                    width={900}
                                    footer={(
                                        <div style={{overflow: 'hidden'}}><Button style={{float: 'left'}} onClick={() => {
                                            this.setState({visibleModalCard: false})
                                        }} type={'primary'}> Done </Button></div>)}
                                >
                                    <SelectCard cardBooking={this.props.card_booking} cards={this.props.payment.cards}/>
                                </Modal>

                                <ul className="menu_simple">
                                    <li>Booking review</li>
                                    |
                                    <li><Link to={'/book/photographers'}>Photographers </Link></li>
                                    |
                                    <li><Link to={'/book/'}>Pick Another Address </Link></li>
                                    |
                                    <li><Link to={'/'}>Home Page</Link></li>
                                </ul>
                            </Col>

                        </Row>

                    </div>
                </div>
            )
        }
        return null;


    }

}

const mapStateToProps = (state) => {
    return {
        bookinfo: state.bookinfo,
        smart_match: state.bookinfo.smart_match,
        payment: state.payment,
        has_card: state.payment.cards.length > 0,
        card_booking: state.payment.card_booking,
        is_ready_card_booking: typeof state.payment.card_booking._id != 'undefined',
        user: state.auth.user,
        isAuthenticated: state.auth.isAuthenticated,
        isVerified: state.auth.user.isVerified,
    }
}
const WrappedBookingReview = Form.create()(BookingReview);
export default connect(mapStateToProps, {getCards, setCardDefault,saveNewStyleCode})(WrappedBookingReview)
