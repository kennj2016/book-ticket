import React from 'react';
import {connect} from 'react-redux'
import {Link} from 'react-router-dom';
import { userSignupRequest } from '../../../actions/userActions';
import { login,setToken,filterUserData } from '../../../actions/authActions';
import {Form, Input, Row, Col, message, Button} from 'antd';

import style from './signup.css';
import qs from 'query-string'
const FormItem = Form.Item;

class RegistrationForm extends React.Component {
    goTo(route) {
        this.props.history.replace(`${route}`)
    }

    state = {
        confirmDirty: false,
        errors:[],
        loading: false,
        iconLoading: false,
    };

    login = (data)=>{

        login(data).then(response => {

            this.setState({loading:false})

            let data = response.data.data;
            let user = filterUserData(data);


            this.props.setToken(data.accessToken,user)
            this.goTo('/')
            message.success(response.data.message)
        });
    }


    handleSubmit = (e) => {
        e.preventDefault();


        this.props.form.validateFieldsAndScroll((err, values) => {

            if(!err){
                this.setState({ loading: true });
                let data = {...values,deviceType:'WEB',deviceToken:'-------none-token--------'};
                delete data.confirm

                let form_data = new FormData();

                console.log(data);
                Object.keys(data).forEach((key)=>{
                    form_data.append(key,data[key]);
                })



                userSignupRequest(form_data)
                .then(res=>{
                    if(res.data.statusCode == 201){

                        let {password,emailId} = data

                        this.login({password,emailId,deviceType: "WEB",deviceToken: "1"})
                    }
                },({response})=>{


                    message.error(response.data.message)
                    this.setState({ loading: false });
                })
            }


        });
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({confirmDirty: this.state.confirmDirty || !!value});
    }
    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    }
    checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], {force: true});
        }
        callback();
    }


    render() {
        const {getFieldDecorator} = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 14},
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 14,
                    offset: 6,
                },
            },
        };


        return (


            <Row>
                <Col
                    xs={{span: 24, offset: 0}}
                    sm={{span: 16, offset: 4}}
                    md={{span: 16, offset: 4}}
                    lg={{span: 16, offset: 4}}
                    xl={{span: 16, offset: 4}}
                >

                    <Form className={style.signup_form} onSubmit={this.handleSubmit}>


                        <h2>Customer <span>Signup</span> </h2>


                        {this.state.errors.map(error=>(<div>{error.message}</div>))}

                        <FormItem
                            {...formItemLayout}
                            label="First Name"
                            hasFeedback
                        >
                            {getFieldDecorator('firstName', {
                                rules: [{ required: true, message: 'Please input your First Name!'}],
                            })(
                                <Input />
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="Last Name"
                            hasFeedback
                        >
                            {getFieldDecorator('lastName', {
                                rules: [{ required: true, message: 'Please input your Last Name!'}],
                            })(
                                <Input />
                            )}
                        </FormItem>


                        <FormItem
                            {...formItemLayout}
                            label="E-mail"
                            hasFeedback
                        >
                            {getFieldDecorator('emailId', {
                                rules: [{
                                    type: 'email', message: 'The input is not valid E-mail!',
                                }, {
                                    required: true, message: 'Please input your E-mail!',
                                },
                                {
                                    validator: this.handleCheckUserExists,
                                    message:'this email already exist'
                                }],
                            })(
                                <Input />
                            )}
                        </FormItem>


                        <FormItem
                            {...formItemLayout}
                            label="Phone"
                            hasFeedback
                        >
                            {getFieldDecorator('phoneNumber', {
                                rules: [{ required: true, message: 'Please input your phone!'}],
                            })(
                                <Input />
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="Password"
                            hasFeedback
                        >
                            {getFieldDecorator('password', {
                                rules: [{
                                    required: true, message: 'Please input your password!',
                                }, {
                                    validator: this.checkConfirm,
                                }],
                            })(
                                <Input type="password"/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Confirm Password"
                            hasFeedback
                        >
                            {getFieldDecorator('confirm', {
                                rules: [{
                                    required: true, message: 'Please confirm your password!',
                                }, {
                                    validator: this.checkPassword,
                                }],
                            })(
                                <Input type="password" onBlur={this.handleConfirmBlur}/>
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label={(<span>Referral Code <br/> (Optional)</span>)}
                            hasFeedback
                        >
                            {getFieldDecorator('referralCode', {
                                rules: [],
                                initialValue: this.props.referralCodes
                            })(
                                <Input />
                            )}
                        </FormItem>

                        <FormItem {...tailFormItemLayout}>
                            <Button loading={this.state.loading} type="primary" htmlType="submit">Register</Button>
                        </FormItem>
                    </Form>

                    <ul className={style.footer}>
                        <li><Link to="/">Back to Login</Link></li>
                    </ul>

                    <div className={style.term_text}>by signing up you agree to our <a target="_blank" href="http://photosesh.com/legal"><strong>Terms of Use </strong></a> and <a target="_blank" href="http://photosesh.com/privacy"><strong>Privacy Policy</strong></a></div>



                </Col>
            </Row>


        );
    }
}




const WrappedRegistrationForm = Form.create()(RegistrationForm);


const mapStateToProps = (state,props) => {

    let referralCodes =  qs.parse(props.location.search).ref || '';
    return {
        referralCodes
    }
}
export default connect(mapStateToProps, {setToken})(WrappedRegistrationForm)
