import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Row, Col, Form, Icon, Input, Button, Checkbox,message} from 'antd';
import {resetPassword} from '../../../actions/authActions'
import style from './login.css'


const FormItem = Form.Item;

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
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

                this.setState({loading:true})

                resetPassword(values.email)
                .then( (response) =>{
                    this.setState({loading:false})
                    message.success('reset have been successfull, please check your email');
                    this.goTo('/')

                })
                .catch( error => {
                    this.setState({loading:false})
                    let {response} = error
                    message.error(response.data.message)
                });
            }
        });
    }


    componentWillMount(){
        if (localStorage.access_token) {
            this.goTo('/')
        }
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


                    <Form onSubmit={this.handleSubmit} className={style.login_form}>
                        <h2><span>Forgot</span> Your Password?</h2>
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
                            <Button type="primary" loading={this.state.loading} htmlType="submit" className={style.button}>
                                Send
                            </Button>

                        </FormItem>
                    </Form>
                    <ul className={style.footer}>
                        <li><Link to="/signup">Create Account</Link></li>
                        |
                        <li><Link to="login">Login</Link></li>
                    </ul>
                </Col>
            </Row>

        );
    }
}


export default Form.create()(ForgotPassword)




