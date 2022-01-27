import style from './layoutmaster.scss'
import React,{Component} from 'react'

import LeftMenu from '../common/SideBar'
import Breadcrumb from '../common/Breadcrumb'
import classnames from 'classnames'
import {Link} from 'react-router-dom'
import {Layout, Menu, Icon, Button, Dropdown, Avatar, Input, Popover, Upload, message} from 'antd'
import {getStorage} from '../../utils/helper'
import {connect} from 'react-redux'
const {Content, Sider, Header} = Layout;
const API_URL = process.env.API_URL;
const { Search } = Input;
const createClassNameForWrapper = (pathname)=>{


    if(pathname == '/'){
        return 'page-home'
    }

    if(pathname)
        return 'page'+pathname.replace(/\//gm,'-').replace(/\-$/g, '');
    return '';

}

class LayoutMaster extends Component {
    constructor(props) {
        super(props);

    }

    componentDidMount(){



    }
    onCollapse = (collapsed) => {
        this.setState({ collapsed });
    }
    toggle = () => {
        console.log(111);
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    state = {
        collapsed: false,
        srcLogo: ''
    };

    render() {
        let {children, location} = this.props
    let className = createClassNameForWrapper(location.pathname);

        const { srcLogo,loadingUploadLogo } = this.state
        const menuProfile = (
            <Menu>
                <Menu.Item key="my-profile">
                    <Link to="/settings/profile"><Icon type="safety"/> My Profile </Link>
                </Menu.Item>
                <Menu.Item key="payment">
                    <Link to="/settings/payment-credits"><Icon type="credit-card"/> Payments </Link>
                </Menu.Item>
                <Menu.Item key="Credit">
                    <Link to="/settings/payment-credits"><Icon type="wallet"/> Credits </Link>
                </Menu.Item>

            </Menu>
        );
    //  'ant-layout-has-sider',

    return (

        <Layout className={classnames(style.layout_master,className)}>

            <Header className="header-top">
                <div className="ht-left">


                    <div>
                        <Link to="/"><img id={'logo-img'} style={{maxWidth: 72}}
                                          src="/images/photoSesh-logo-no-slogan.png" alt=""/></Link>


                        </div>


                </div>

                <div className="ht-right">
                    <div className="power-by" style={{width: 250, float: 'left'}}>
                    </div>
                    <div style={{width: 'calc(100% - 250px)', float: 'right', textAlign: 'right'}}>
                        <Menu style={{height: 100}} onClick={this.handleClick} selectedKeys={[this.state.current]}
                              mode="horizontal">
                            <Menu.Item key="menuProfile">
                                <Dropdown overlay={menuProfile} trigger={['click']}>
                                    <a className="ant-dropdown-link" href="#">
                                        {typeof this.props.user.emailId != 'undefined' && (
                                            this.props.user.name.firstName + " " + this.props.userAs.name.lastName
                                        )}
                                        <Icon type="down"/>

                                        <Avatar icon="user"/>
                                    </a>
                                </Dropdown>
                            </Menu.Item>
                            <Menu.Item key="help">

                                <Dropdown overlay={(
                                    <Menu>
                                        <Menu.Item key="my-profile">
                                            <a href="https://photosesh.freshdesk.com/support/solutions/19000037429"><Icon
                                                type="exclamation-circle"/> PhotoSesh Help Center</a>

                                        </Menu.Item>
                                        <Menu.Item key="payment">
                                            <a href="mailto:concierge@photosesh.com"><Icon type="contacts"/> Contact
                                                Us</a>
                                        </Menu.Item>
                                    </Menu>

                                )} trigger={['click']}>
                                    <a className="ant-dropdown-link" href="#">
                                        <Icon type="question-circle"/>
                                        Help
                                    </a>

                                </Dropdown>

                            </Menu.Item>
                            <Menu.Item key="setting">


                                <Dropdown overlay={(
                                    <Menu>

                                        <Menu.Item key="my-profile">
                                            <Link to="/settings/profile"><Icon type="safety"/> My Profile </Link>
                                        </Menu.Item>
                                        <Menu.Item key="payment">
                                            <Link to="/settings/payment-credits"><Icon type="credit-card"/> Payments </Link>
                                        </Menu.Item>
                                        <Menu.Item key="Credit">
                                            <Link to="/settings/payment-credits"><Icon type="wallet"/> Credits
                                            </Link>
                                        </Menu.Item>
                                        <Menu.Item key="Feedback">
                                            <Link to="/"><Icon type="edit"/> Feedback </Link>
                                        </Menu.Item>
                                    </Menu>

                                )} trigger={['click']}>
                                    <a className="ant-dropdown-link" href="#">
                                        <Icon type="setting"/>
                                    </a>

                                </Dropdown>


                            </Menu.Item>

                            <Menu.Item key="search">


                                <Popover
                                    placement="rightBottom"

                                    content={(<div>
                                        <Search
                                            placeholder="input search text"
                                            onSearch={value => console.log(value)}
                                            style={{width: 200}}
                                        />
                                    </div>)} title="" trigger="click">
                                    <Icon type="search"/>
                                </Popover>

                            </Menu.Item>
                        </Menu>


                    </div>

                </div>

            </Header>
            <Layout className={style.right_layout}>
                <LeftMenu
                    collapsed={this.state.collapsed}
                    onCollapse={this.onCollapse}
                    {...children.props} />
                <Content className={children.props.hasBreadcrumb ? style.right_content : ''}>

                    <Header

                        className="header-middle"
                        style={{

                        background: 'white',
                        padding: 0,
                        height: 47,
                        display: "block",
                        overflow: "hidden",
                        position: "fixed",
                        zIndex: 10,
                        width: "100%",
                        borderBottom:"1px solid #e8e8e8"


                    }}>
                        <Icon
                            style={{
                                padding: 15,
                                fontSize: 20,float:'left'
                            }}
                            type={this.state.collapsed ? 'menu' : 'menu'}
                            onClick={this.toggle}
                        />
                        <strong style={{

                            display: 'inline-block',
                            verticalAlign: 'top',
                            lineHeight: '49px'

                        }}>{this.props.currentPageTitle}

                            {children.props.hasBreadcrumb && (<Breadcrumb {...children.props} />)}
                        </strong>


                    </Header>
                    <div style={{padding:"60px 15px 15px 15px"}}>
                        {children}
                    </div>

                </Content>
            </Layout>
        </Layout>
    )}
};
const mapStateToProps = (state)=> {
    return {
        user: state.auth.user
    }
}
export default connect(mapStateToProps, {})(LayoutMaster)

