import React, {Component} from 'react'
import {Form, Input, Button, message, Col} from 'antd';
import {addCredits,getCredits} from '../../../../actions/paymentActions'
import {connect} from 'react-redux'
const InputGroup = Input.Group;
const FormItem = Form.Item;

class AddCreditForm extends Component {

    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            error: []
        }
    }


    goTo(route) {
        this.props.history.replace(`${route}`)
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, inputs) => {
            if (!err) {

                this.setState({
                    loading: true
                })

                let {promo} = inputs

                addCredits(promo).then(res=>{
                    if(res.data){
                        this.props.getCredits();
                        message.success(res.data.message)
                    }
                    this.setState({
                        loading: false
                    })
                }).catch(error=>{
                    this.setState({
                        loading: false
                    })
                    if(error.response.data){
                        message.error(error.response.data.message)
                    }

                })


            }
        });
    }


    render() {
        const {getFieldDecorator} = this.props.form;

        let style_wrapper_error = {
            padding: 20,
            border:'1px solid #f3f3f3',
            background:"#ffffff"

        }
        let style_error = {
            background:'rgba(206, 17, 38, 0.05)',
            border:'1px solid #ccc',
            textAlign:'center',
            marginBottom: 3
        }

        return (
            <div style={style_wrapper_error}>
                {this.state.error.length > 0 && (
                    <div style={{maxWidth: 300, margin: '20px auto'}}>
                        {this.state.error.map(error => (<div style={style_error}>{error.message}</div>))}
                    </div>
                )}

                <Form
                    style={{maxWidth: 300, margin: 'auto'}}
                    onSubmit={this.handleSubmit}>


                    <h2 className="head-title">Enter Your Promo Code</h2>

                    <FormItem
                        label=""
                    >
                        {getFieldDecorator('promo', {
                            rules: [
                                {required: true, message: 'Please enter promo code'}
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <Button


                        style={{width:'100%'}}
                        type="primary"
                        size="omitted"
                        htmlType="submit"
                        icon="gift"
                        loading={this.state.loading}
                    >
                        Add Credits
                    </Button>
                </Form>

            </div>

        )
    }
}

const WrapAddCreditForm = Form.create()(AddCreditForm)
export default connect(null,{getCredits})(WrapAddCreditForm);
