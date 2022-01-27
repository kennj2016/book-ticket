import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Button,Form,Input,message} from 'antd'
import axios from 'axios'

const API_URL = process.env.API_URL;
const FormItem = Form.Item;
const { TextArea } = Input;


class SendEmail extends Component {
    state = {
        loading :false
    }


    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, inputs) => {

            this.setState({loading:true})

            if (!err) {
                axios.put(API_URL + '/user/send-email-to-friend',inputs).then(res=>{

                    this.setState({loading:false})

                    this.props.form.setFields({
                        email: {
                            value: '',
                            errors: [],
                        },
                    });

                    message.success('Your message has been successfully sent ');
                }).catch(err=>{
                    this.setState({loading:false})
                    message.err('Opps, Cannot send message . Please try again later');

                })

            }
        })
    }


    render() {
        const {getFieldDecorator} = this.props.form;

        const ShareText = this.props.user.shareText.replace('refCode',this.props.user.referralCode)

        return (
            <Form style={{maxWidth:500,margin:'0 auto'}}  onSubmit={this.handleSubmit}>



                <h2 style={{textAlign:'center',fontSize:25,margin:'30px 0'}}>Share and Earn Credits</h2>

                <FormItem label="to email:">

                    {getFieldDecorator('email', {
                        rules: [
                            {type: 'email', message: 'The input is not valid E-mail!'},
                            {required: true, message: 'Please enter email to share'}
                        ]
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    label="Title / Description"
                >
                    {getFieldDecorator('content', {
                        rules: [
                            {required: true, message: 'Please enter description of Style Code'},
                        ],
                        initialValue:ShareText
                    })(
                        <TextArea   rows={4} />
                    )}
                </FormItem>

                <div>

                    <Button
                        type="primary"
                        icon="save"

                        onClick={(e)=> this.handleSubmit(e)}
                        loading={this.state.loading} >Share</Button>

                </div>
            </Form>
        )
    }
}

const mapStateToProps = (state)=>{
    return {
        user:state.auth.user
    }
}

const SendEmailWithForm = Form.create()(SendEmail);

export default connect(mapStateToProps,{})(SendEmailWithForm)
