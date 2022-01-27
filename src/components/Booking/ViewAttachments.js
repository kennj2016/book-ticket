import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom'
import {Row, Form, Input, Checkbox, Button, Col, message, Modal} from 'antd';
import {connect} from 'react-redux'
import {Layout, Menu, Icon, Avatar} from 'antd';

import {agentLogin, filterUserData, login,fetchBookingAttachment} from '../../actions/authActions';
import style from "../Settings/Login/login.css";
import {getStorage, removeStorage} from "../../utils/helper";

    import {
        LockOutlined,
        FileImageOutlined,
        FilePdfOutlined,
        FileExcelOutlined,
        FileWordOutlined
} from '@ant-design/icons';
const FormItem = Form.Item;



const {Content} = Layout;
//fetchBookingAttachment
class ViewAttachments extends Component {
    constructor(props) {
        super(props);
        this.state = {

            booking:{},
            visibleModal:false,

            agentId:""
        }
    }


    loadBooking = () => {

        let bookingId = this.props.match.params.id || ''

        if(bookingId){

            fetchBookingAttachment(bookingId).then(res=>{

                this.setState({
                    booking:res.data.data
                })

            })

        }



    }
    componentDidMount() {

        this.loadBooking()
    }

    handleSubmit = (e) => {
        e.preventDefault();


        this.props.form.validateFields((err, values) => {
            if (!err) {

                this.setState({loading:true});
                agentLogin({
                    emailId: values.emailId,
                    password: values.password
                })
                    .then( (response) =>{
                        this.setState({loading:false,hasAuth:true,visibleModal:false,agentId:response.data.data.agent._id});

                        this.loadBooking()


                    })
                    .catch( error => {
                        this.setState({loading:false,hasAuth:false})
                        if(typeof error.response  != 'undefined' ){
                            let {response} = error
                            message.error(response.data.message)
                        }
                    });
            }
        });
    }

    handleClickFile = (e)=>{
        e.preventDefault();
        let {hasAuth} = this.state

        if(!hasAuth){
            this.setState({visibleModal:true});
        }

    }
    render() {

        let {hasAuth,booking,agentId} = this.state
        const {getFieldDecorator} = this.props.form;

        let isAccepted = typeof  booking.agentId != 'undefined' && agentId != booking.agentId && booking.appointmentStatus != 'PENDING'

        return (
            <div id="view-attachment-wrapper" style={{position:'relative'}}>

                <Modal
                    title="please login before view attachments"
                    visible={this.state.visibleModal}
                    onOk={()=>{}}
                    onCancel={()=>{this.setState({visibleModal:false})}}
                    footer={null}
                   >

                    <section>


                        <Form onSubmit={this.handleSubmit} style={{

                            margin: 'auto',
                            maxWidth: 350,
                            padding: '30px 20px',
                            background: 'rgba(255,255,255,.3)',
                            borderRadius: 4,
                            marginTop: 30


                        }}>
                            <h2><span>Photographer</span> Login</h2>

                            <FormItem>
                                {getFieldDecorator('emailId', {
                                    rules: [
                                        {required: true, message: 'Please input your Email!'},
                                        {type: 'email', message: 'The input is not valid E-mail!'}

                                    ],
                                })(
                                    <Input className={style.input} prefix={<Icon type="user"/>} placeholder="Email"/>
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('password', {
                                    rules: [{required: true, message: 'Please input your Password!'}],
                                })(
                                    <Input  className={style.input} prefix={<Icon type="lock"/>} type="password"
                                            placeholder="Password"/>
                                )}
                            </FormItem>
                            <FormItem>

                                <Button type="primary" loading={this.state.loading} htmlType="submit" >
                                    Log in
                                </Button>

                            </FormItem>
                        </Form>


                    </section>

                </Modal>


                <div>
                    <h2 style={{textAlign:'center',margin:'50px 0'}}>PHOTOSESH STYLE GUIDE</h2>




                    <section className={'list-file'}>


                        <table>
                                <thead>
                                <th>No.</th>
                                <th>File Type</th>
                                <th>File Name</th>
                                <th></th>
                                </thead>

                                {
                                    typeof booking.attachmentFiles !='undefined' && booking.attachmentFiles.length && (
                                        <tbody>
                                        {booking.attachmentFiles.map((file,i)=>{

                                            function GetFilename(url)
                                            {



                                                if (url)
                                                {
                                                    return url.split('/').pop().split('?')[0]
                                                }
                                                return "";
                                            }

                                            function getIconType(url) {

                                                let ext = GetFilename(url).split('.')[1]

                                                console.log({ext});

                                                if(['jpg', 'JPG', 'png' ,'PNG' ,'jpeg' ,'JPEG'].indexOf(ext) > -1){
                                                    return 'image'
                                                }else if(['pdf'].indexOf(ext) > -1){
                                                    return 'image'
                                                }
                                                else if(['doc','docx'].indexOf(ext) > -1){
                                                    return 'word'
                                                }
                                                else if(['xls','xlsx'].indexOf(ext) > -1){
                                                    return 'excel'
                                                }

                                            }


                                            let fontIcon = { fontSize: '26px', color: '#08c' }


                                            return (<tr >

                                                <td>{++i}</td>
                                                <td>

                                                    {!hasAuth && (<td><div onClick={this.handleClickFile} ><LockOutlined /></div></td>)}

                                                    {hasAuth && (getIconType(file) == 'image') && (<FileImageOutlined style={fontIcon} />)}
                                                    {hasAuth && (getIconType(file) == 'pdf') && (<FilePdfOutlined  style={fontIcon}  />)}
                                                    {hasAuth && (getIconType(file) == 'word') && (<FileWordOutlined  style={fontIcon}  />)}
                                                    {hasAuth && (getIconType(file) == 'excel') && (<FileExcelOutlined style={fontIcon}   />)}

                                                </td>
                                                <td>
                                                    {hasAuth  && (<span>{GetFilename(file)}</span>)}
                                                    {!hasAuth && (<div >{GetFilename(file)}</div>)}

                                                </td>
                                                {hasAuth && (<td><a target={'blank'} href={file} >Download </a></td>)}
                                                {!hasAuth && (<td><a onClick={this.handleClickFile} >view file</a></td>)}

                                            </tr>)
                                        })}
                                        </tbody>

                                    )
                                }


                            </table>


                        {isAccepted && hasAuth && (
                            <div>
                                SORRY, This appointment has accepted by another photographer
                            </div>
                        )}


                    </section>
                </div>







            </div>
        );
    }
}
const WrappedLoginForm = Form.create()(ViewAttachments);
const mapStateToProps = (state,props) => {


    return {
    }
}
export default connect(mapStateToProps, {})(WrappedLoginForm)



