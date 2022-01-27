import React, {Component} from 'react'
import {Form,Input,Button,message,Col,InputNumber,Checkbox} from 'antd';
import braintree from 'braintree-web';
import ProtoType from 'prop-types'
import {addCard} from '../../../../actions/paymentActions'
var Recaptcha = require('react-recaptcha');

// create a variable to store the component instance
let recaptchaInstance;
// manually trigger reCAPTCHA execution
const executeCaptcha = function () {
    recaptchaInstance.execute();
};

// executed once the captcha has been verified
// can be used to post forms, redirect, etc.


const InputGroup = Input.Group;

const FormItem = Form.Item;


class AddCardForm extends Component {

    constructor(props) {
        super(props)

        this.state = {
            user: {},
            loading:false,
            error:[],
            setCardDefault:true,
            disableSubmit:true


        }
    }
     verifyCallback =  (response) => {
        console.log(response);

        this.setState({disableSubmit:false})
        this.handleSubmit()
    };

    checkCard= (data)=>{

        let {number,card_month,card_year,cvv} = data;

        let expirationDate = card_month + '/' + card_year


        return new Promise((resolve,reject) => {
            braintree.client.create({
                authorization: this.props.token
            },  (err, client) => {

                client.request({
                    endpoint: 'payment_methods/credit_cards',
                    method: 'post',
                    data: {
                        creditCard: {
                            number,
                            expirationDate,
                            cvv
                        }
                    }
                },  (err, response) => {

                    if(err){
                        reject(err)
                        recaptchaInstance.reset();
                        this.setState({disableSubmit:true})
                    }
                    resolve(response)
                    // Send response.creditCards[0].nonce to your server
                });
            });

        })


    }
    goTo(route) {
        this.props.history.replace(`${route}`)
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let {setCardDefault} = this.state

        this.props.form.validateFieldsAndScroll((err, inputs) => {
            if (!err) {

                this.setState({
                    error:[],
                    loading:true
                })
                this.checkCard(inputs).then(res=>{


                    let nounce = res.creditCards[0].nonce

                    addCard(nounce,setCardDefault).then(res=>{
                        message.success(res.data.message)
                        this.props.form.resetFields()
                        this.goTo('/settings/payment-credits/card/')

                        this.setState({loading:false})
                    })
                    .catch( error => {
                        recaptchaInstance.reset();
                        this.props.form.resetFields()
                        this.setState({loading:false,disableSubmit:true})
                        let {response} = error
                        message.error(response.data.message)
                    });

                },err=>{
                    let error = err.details.originalError.fieldErrors[0].fieldErrors
                    this.setState({error, loading:false,disableSubmit:true})

                    recaptchaInstance.reset();


                })

            }
        });
    }


    onSetCardDefaultChange = (e)=>{

        this.setState({
            setCardDefault:e.target.checked
        })

        console.log(e.target.checked)

    }


    render() {


        const {getFieldDecorator} = this.props.form;
        const {setCardDefault} = this.state;

        let style_wrapper_error = {
            background: '#f9f9f9',
            padding: 20,
            boxShadow: 'rgb(230, 227, 227) 1px 1px 1px',
            border:'1px solid #f3f3f3'}
        let style_error = {
            background:'rgba(206, 17, 38, 0.05)',
            border:'1px solid #ccc',
            textAlign:'center',
            marginBottom: 3
        }

        return (
            <div style={style_wrapper_error}>
                {this.state.error.length > 0 && (
                    <div style={{maxWidth:300,margin:'20px auto'}}>
                        {this.state.error.map(error=>(<div style={style_error}>{error.message}</div>))}
                    </div>
                )}




                <Form
                    style={{maxWidth:300,margin:'auto'}}
                    onSubmit={this.handleSubmit}>


                    <img src={'/images/paypal.png'} alt=""/>
                    
                    <h2 className="head-title text-center">Add New Card</h2>


                        <InputGroup size="large">
                            <Col span={24}>
                                <FormItem
                                    label="Card Number"
                                >
                                    {getFieldDecorator('number', {
                                        rules: [
                                            {required: true, message: 'Please enter card number'}
                                        ]
                                    })(
                                        <InputNumber
                                            style={{width:'100%'}}
                                            formatter={value => {
                                                value = value.toString();

                                                var v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
                                                var matches = v.match(/\d{4,16}/g);
                                                var match = matches && matches[0] || ''
                                                var parts = []

                                                for (let i=0, len=match.length; i<len; i+=4) {
                                                    parts.push(match.substring(i, i+4))
                                                }

                                                if (parts.length) {
                                                    return parts.join('-')
                                                } else {
                                                    return value
                                                }

                                            }}
                                            parser={value => value.replace(/\-\s?|(,*)/g, '')}

                                            placeholder="4242 4242 4242 4242"/>
                                    )}
                                </FormItem>
                            </Col>
                        </InputGroup>


                        <InputGroup size="large">
                            <Col span={8}>

                                <FormItem
                                    label=""
                                >
                                    {getFieldDecorator('card_month', {
                                        rules: [  {required: true, message: 'Please enter this field'}
                                        ]
                                    })(
                                        <Input type="text" placeholder="MM"/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    label=""
                                >
                                    {getFieldDecorator('card_year', {
                                        rules: [
                                            {required: true, message: 'Please enter this field'}
                                        ]
                                    })(
                                        <Input type="text" placeholder="YY"/>
                                    )}
                                </FormItem>
                            </Col>

                            <Col span={8}>
                                <FormItem
                                    label=""
                                >
                                    {getFieldDecorator('cvv', {
                                        rules: [
                                            {required: true, message: 'Please enter this field'}
                                        ]
                                    })(
                                        <Input type="text" placeholder="cvv"/>
                                    )}
                                </FormItem>
                            </Col>
                        </InputGroup>



                    <FormItem
                        label=""
                    >
                        <Checkbox
                            checked={setCardDefault}
                            onChange={this.onSetCardDefaultChange}>Set card default for the next booking?</Checkbox>
                    </FormItem>

                    <Recaptcha
                        ref={e => recaptchaInstance = e}
                        sitekey="6LdzltEZAAAAAHNbEOsqHVMMtYKTeOWV80Lh_x_v"
                        verifyCallback={this.verifyCallback}
                        render="explicit"
                        onloadCallback={
                            ()=> {
                                console.log('Done!!!!');
                            }
                        }
                        badge={'inline'}
                        elementID= 'g-recaptcha'
                    />
                    <Button
                        type="primary"
                        htmlType="submit"

                        disabled={this.state.disableSubmit}
                        icon="save"
                        loading={this.state.loading}
                    >
                        Add Card
                    </Button>

                    <span
                        style={{
                            display: 'block',
                            fontSize: 11,
                            marginTop: 20,
                            color:'#787979'
                        }}

                    >You will only be charged once the PhotoSesh is complete! : )</span>

                </Form>

            </div>

        )
    }
}


AddCardForm.protoType = {
    token:ProtoType.string.isRequired
}

export default Form.create()(AddCardForm);
