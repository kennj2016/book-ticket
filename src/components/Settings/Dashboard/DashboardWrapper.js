import style from './dashboard_wrapper.css'

import React, {Component} from 'react';
import {Route,Link} from 'react-router-dom'
import {Row, Form} from 'antd';
import {connect} from 'react-redux'
import { Layout, Menu, Icon,Avatar } from 'antd';
import Profile from './Profile'
import ChangePassword from './ChangePassword'
import PaymentCredit from './PaymentCredit'
import StyleCodeWrapper from './StyleCodeWrapper'
import {logout} from '../../../actions/authActions'
import {isMobile} from 'react-device-detect'

const {  Content, Sider } = Layout;
const FormItem = Form.Item;


class DashboardWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    goTo(route) {
        this.props.history.replace(`${route}`)
    }

    render() {


        const LayoutDashBoard = (
            <Layout  style={{background:'white'}}>

                <Sider width={300} style={{     overflow: 'hidden', background: 'white', border: '1px solid #dedede',borderRadius:10}}>

                    <div className={style.header_user}>
                        <p> {(this.props.avatar == '') ? ( <Avatar className={style.avatar}   style={{width:60,height:60}} icon="user" />) : (<Avatar  style={{width:60,height:60}} className={style.avatar} src={this.props.avatar} />)} </p>

                        <span style={{fontSize:14}}>{this.props.fullname}</span>

                    </div>

                    <Menu
                        defaultSelectedKeys={[]}
                        mode="inline"
                        style={{borderRight: 0 }}
                    >
                        <Menu.Item key="orders"><Link to="/settings/profile"><Icon type="contacts" /> Edit Profile</Link></Menu.Item>
                        <Menu.Item key="change-password"><Link to="/settings/change-password"><Icon type="qrcode" /> Change Password</Link></Menu.Item>
                        <Menu.Item key="bank-detail"><Link to="/settings/payment-credits"><Icon type="credit-card" /> Payment & Credits</Link></Menu.Item>
                        <Menu.Item key="style-code"><Link to="/settings/style-code"><Icon type="credit-card" /> Style Code</Link></Menu.Item>
                        <Menu.Divider />
                        <Menu.Item key="homepage"><Link to="/"><Icon type="calendar" /> My Projects</Link></Menu.Item>

                    </Menu>

                </Sider>
                <Layout style={{background:'white'}}>
                    <Content style={{margin: 0, minHeight: 280,paddingLeft:15 }}>
                        <Route  exact={true}  path={`${this.props.match.url}/`} component={Profile}/>
                        <Route  exact={true}  path={`${this.props.match.url}/profile`} component={Profile}/>
                        <Route  exact={true}  path={`${this.props.match.url}/change-password`} component={ChangePassword}/>
                        <Route   path={`${this.props.match.url}/payment-credits`} component={PaymentCredit}/>
                        <Route   path={`${this.props.match.url}/style-code`} component={StyleCodeWrapper}/>
                    </Content>
                </Layout>

            </Layout>
        )

        const LayoutDashBoardMobile = (
            <Layout style={{background:'white'}}>
                <Content style={{margin: 0, minHeight: 280 }}>
                    <Route  exact={true}  path={`${this.props.match.url}/`} component={Profile}/>
                    <Route  exact={true}  path={`${this.props.match.url}/profile`} component={Profile}/>
                    <Route  exact={true}  path={`${this.props.match.url}/change-password`} component={ChangePassword}/>
                    <Route   path={`${this.props.match.url}/payment-credits`} component={PaymentCredit}/>
                    <Route   path={`${this.props.match.url}/style-code`} component={StyleCodeWrapper}/>
                </Content>
            </Layout>
        )


        return (
            <div id="user-dashboard">
                {!isMobile && LayoutDashBoard}
                {isMobile && LayoutDashBoardMobile}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        fullname:state.auth.user.name.firstName + ' ' + state.auth.user.name.lastName,
        avatar: (state.auth.user.profilePicURL.thumb != '')?state.auth.user.profilePicURL.thumb:''
    }
}
export default connect(mapStateToProps, {logout})(DashboardWrapper)



