import React, {Component} from 'react';
import {Route,Link} from 'react-router-dom'
import {Row, Form,Alert} from 'antd';
import {connect} from 'react-redux'
import { Layout, Menu, Icon,Button } from 'antd';
import axios from 'axios';
import braintree from 'braintree-web'
import AddCardForm from './Include/AddCardForm'
import {getPaymentToken} from '../../../actions/paymentActions'
const {  Content, Sider } = Layout;
const FormItem = Form.Item;

class AddCardSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nounce:''
        }
    }
    componentWillMount(){

        getPaymentToken()
            .then(res=>{
                this.setState({
                    nounce:res.data.data
                })
            })

    }


    render() {

        return (
            <div>
                <AddCardForm {...this.props} token={this.state.nounce}></AddCardForm>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user:state.auth.user
    }
}
export default connect(mapStateToProps, {})(AddCardSection)



