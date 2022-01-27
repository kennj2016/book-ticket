import React, {Component} from 'react';
import classnames from 'classnames'
import {Link} from 'react-router-dom';
import {Row, Col, Form, Icon, Input, Button, Checkbox,message} from 'antd';
import {connect} from 'react-redux'
import {login,setToken,filterUserData,verifyUserFb,verifyUserGoogle} from '../../../actions/authActions'
import {getStorage,removeStorage} from '../../../utils/helper'
import style from './login.css'

import LinkedIn from "linkedin-login-for-react";
import {
    GoogleOutlined,
    FacebookOutlined,
    LinkedinOutlined
} from '@ant-design/icons';
import SocialButton from './SocialButton'
import { createFromIconfontCN } from '@ant-design/icons';
const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
});

const FormItem = Form.Item;

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingFb: false,
            isLogin: false,
            loading:false
        }
    }


    goTo(route) {
        this.props.history.replace(`${route}`)
    }
    handleSubmit = (e) => {
        e.preventDefault();


        this.props.form.validateFields((err, values) => {
            if (!err) {

                this.setState({loading:true});
                login({
                    emailId: values.email,
                    password: values.password,
                    deviceType: "WEB",
                    deviceToken: "1"
                })
                    .then( (response) =>{
                        this.setState({loading:false});
                        let data = response.data.data;
                        let user = filterUserData(data);
                        this.props.setToken(data.accessToken,user)
                        if(user.isVerified){

                            message.success('Login successful.');

                            if(getStorage('loginBackUrl')){
                                let redirectUrl = (getStorage('loginBackUrl') == '/book/need-a-photosesh') ? '/book/photographers' : getStorage('loginBackUrl')
                                this.goTo(redirectUrl)
                                removeStorage('loginBackUrl')
                            }else{
                                this.goTo('/')
                            }

                        }else{
                            this.goTo('/need-verified-email')
                        }






                    })
                    .catch( error => {
                        this.setState({loading:false})
                        if(typeof error.response  != 'undefined' ){
                            let {response} = error
                            message.error(response.data.message)
                        }
                    });
            }
        });
    }


    componentWillMount(){
        if (localStorage.access_token) {
            this.goTo('/')
        }
    }
    callbackLinkedIn = (response) => {


        console.log(response);
        let {id,accessToken}  = response

        this.setState({
            loadingFb:true
        })

    }
    responseFacebook = (response) => {


        console.log(response);
        let {_profile,_token}  = response

        this.setState({
            loadingFb:true
        })

        verifyUserFb({fbID:_profile.id,accessToken:_token.accessToken}).then(response=>{

            this.setState({     loadingFb:false});
            let data = response.data.data;
            let user = filterUserData(data);
            this.props.setToken(data.accessToken,user)
            if(user.isVerified){

                message.success('Login successful.');

                if(getStorage('loginBackUrl')){
                    let redirectUrl = (getStorage('loginBackUrl') == '/book/need-a-photosesh') ? '/book/photographers' : getStorage('loginBackUrl')
                    this.goTo(redirectUrl)
                    removeStorage('loginBackUrl')
                }else{
                    this.goTo('/')
                }

            }else{
                this.goTo('/need-verified-email')
            }


        }).catch(err=>{
            console.log(err.response);

            if(typeof err.response.data != 'undefined' && err.response.data.message == 'should_signup_with_this_email_first'){

                message.error('Please sign up before login with this facebook account')
            }

            this.setState({loadingFb:false});
        })
    }
    responseGoogle = (response) => {


        console.log(response);
        let {_profile,_token}  = response


        this.setState({
            loadingFb:true
        })

        verifyUserGoogle({clientID : _profile.id,accessToken:_token.idToken}).then(response=>{

            this.setState({     loadingFb:false});
            let data = response.data.data;
            let user = filterUserData(data);
            this.props.setToken(data.accessToken,user)
            if(user.isVerified){

                message.success('Login successful.');

                if(getStorage('loginBackUrl')){
                    let redirectUrl = (getStorage('loginBackUrl') == '/book/need-a-photosesh') ? '/book/photographers' : getStorage('loginBackUrl')
                    this.goTo(redirectUrl)
                    removeStorage('loginBackUrl')
                }else{
                    this.goTo('/')
                }

            }else{
                this.goTo('/need-verified-email')
            }


        }).catch(err=>{
            console.log(err.response);

            if(typeof err.response.data != 'undefined' && err.response.data.message == 'should_signup_with_this_email_first'){

                message.error('Please sign up before login with this google account')
            }

            this.setState({loadingFb:false});
        })
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Row>
                <Col xs={{span: 24, offset: 0}}
                     sm={{span: 16, offset: 4}}
                     md={{span: 8, offset: 8}}
                     lg={{span: 8, offset: 8}}
                     xl={{span: 8, offset: 8}} className="col-login">


                    <Form className={classnames('wrap-login-form',style.login_form,(this.state.loadingFb ? ' loadingfb' : ''))  }>
                        <h2>PhotoSesh Customer Login</h2>


                        <div className={'social-login-buttons text-center' + (this.state.loadingFb ? ' loading-fb' : '') }>

                            <SocialButton
                                provider='facebook'
                                appId='1051903308649252'
                                onLoginSuccess={this.responseFacebook}
                                className={'facebook-button'}
                            >
                                <IconFont type="icon-facebook" /> Login With Facebook
                            </SocialButton>


                            <SocialButton
                                provider='google'
                                appId='407093466465-n7hdiskcvrccmri90ahqa02v2picf9ge.apps.googleusercontent.com'
                                onLoginSuccess={this.responseGoogle}
                                className={'google-button'}
                            >
                                <GoogleOutlined /> Login With GOOGLE
                            </SocialButton>





                            <div style={{display:'none'}}>
                                <SocialButton
                                    provider='linkedin'
                                    appId='779mlr5vczksv3'
                                    onLoginSuccess={this.callbackLinkedIn}
                                    className={'linked-button'}
                                >
                                    <GoogleOutlined />  Login With LinkedIn
                                </SocialButton>
                            </div>
                        </div>

                        <FormItem>
                            {getFieldDecorator('email', {
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

                            <Button type="primary" loading={this.state.loading}

                                    onClick={this.handleSubmit}
                                    className={style.button}>
                                Log in
                            </Button>

                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                <Checkbox>Remember me</Checkbox>
                            )}
                        </FormItem>
                    </Form>



                    <ul className={style.footer}>
                        <li><Link to="/signup">Create Account</Link></li>
                        |
                        <li><Link to="/forgot">Forgot password</Link></li>
                    </ul>
                </Col>
            </Row>

        );
    }
}


const WrappedLoginForm = Form.create()(LoginPage);

const mapStateToProps = (state) => {
    return {
        isAuthenticated:state.auth.isAuthenticated
    }
}
export default connect(mapStateToProps, {setToken})(WrappedLoginForm)



