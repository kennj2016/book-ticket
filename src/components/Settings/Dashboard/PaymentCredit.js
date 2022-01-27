import React, {Component} from 'react';
import {Route,Link} from 'react-router-dom'
import {Row, Form} from 'antd';
import {connect} from 'react-redux'
import { Layout, Alert, Icon,Button,Menu } from 'antd';
import axios from 'axios';
import {API_URL} from '../../../actions/authActions'
import AddCardSection from './AddCardSection'
import CardSection from './CardSection'
import CreditSection from './CreditSection'

const {  Content, Sider } = Layout;
const FormItem = Form.Item;

class PaymentCredit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current:'card'
        }
    }
    goTo(route) {
        this.props.history.replace(`${route}`)
    }


    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
    }

    render() {

        const wrap_style ={textAlign:'center',marginBottom:20,overflow:'hidden',background: '#efefef',boxShadow:'1px 1px 1px #ccc'}
        const menu_style ={width:'50%',background:'#f1f1f1'}
        return (
            <div id="payment-credit" style={{maxWidth:800}}>
               <div style={wrap_style}>
                   <Menu
                       onClick={this.handleClick}
                       mode="horizontal"
                       selectedKeys={[this.state.current]}

                   >
                       <Menu.Item key="card" style={menu_style}>
                           <Link to="/settings/payment-credits/card" className="btn">CARDS</Link>
                       </Menu.Item>
                       <Menu.Item key="credit" style={menu_style}>
                           <Link to="/settings/payment-credits/credits" className="btn">CREDITS</Link>
                       </Menu.Item>
                   </Menu>
               </div>

                <Route  exact={true}  path={`${this.props.match.url}/`} component={CardSection}/>
                <Route  exact={true}  path={`${this.props.match.url}/card`} component={CardSection}/>
                <Route  exact={true}  path={`${this.props.match.url}/card/add-new`} render={(props)=>(<AddCardSection {...props}/>)}/>
                <Route  exact={true}  path={`${this.props.match.url}/credits`} component={CreditSection}/>
            </div>
        );
    }
}



const mapStateToProps = (state) => {
    return {
        user:state.auth.user
    }
}
export default connect(mapStateToProps, {})(PaymentCredit)



