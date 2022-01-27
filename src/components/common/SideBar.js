import style from './sidebar.scss'
import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../../actions/authActions'
import {Popconfirm, Popover, Icon, Layout, Input, Menu,Button,Modal,Badge} from 'antd'
import {isMobile} from 'react-device-detect'
import classnames from 'classnames'
import {getMobileOperatingSystem,setStorage} from '../../utils/helper'

import {DiffOutlined,SlackOutlined ,LogoutOutlined ,DashboardOutlined, HistoryOutlined ,DollarOutlined,SafetyOutlined ,SettingOutlined ,ScheduleOutlined,UserOutlined,DeploymentUnitOutlined,WhatsAppOutlined      } from '@ant-design/icons';


const {Sider} = Layout;
const {SubMenu} = Menu;


const DOMAIN_NAME = process.env.DOMAIN_NAME



function sharetwitter(url,message) {
    return 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(url + "  " +  message);
}


const promptLoginFirst = (props)=>{

    Modal.confirm({
        iconType:"login",
        title: 'PhotoSesh Notification',
        okText:'Ok',
        cancelText	:'Cancel',
        centered:true,
        onOk:()=>{
            setStorage('loginBackUrl',props.location.pathname)
            props.history.replace('/login'); Modal.destroyAll();
        },
        content: (<div>
            Please login or create a FREE account to enjoy access to all the PhotoSesh photographers with upfront pricing, bios, and portfolios.
        </div>),
    });
}
class Sidebar extends Component {
    state = {
        collapsed: false,
        showSidebar: true,
        openKeys: [],
    }
    onCollapse = (collapsed) => {
        console.log({collapsed});
        if(isMobile){
            this.setState(state=>{
                return { showSidebar : false,collapsed}
            });
        }else{
            this.setState({ collapsed });
        }


    }


    goTo(route){

        this.props.history.replace(route)
    }

    componentWillMount(){
        if(isMobile){
            this.setState({showSidebar:false });
        }
    }

    componentWillReceiveProps(nextProps){



        if(isMobile && this.props.currentRoute != nextProps.currentRoute){
            this.setState({showSidebar:false });
        }


    }

    rootSubmenuKeys = ["support","settings","activity","bookings","dashboard"];
    onOpenChange = openKeys => {
        console.log(openKeys);
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({ openKeys });
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    };
    onClick = (objectKeys,e) => {


        let {key,keyPath} = objectKeys

        if(key == 'login_logout'){

            return;
        }



        if(['settings','earn-credits','bookings','dashboard','activity','settings4','settings3','settings2','settings1'].indexOf(key) > -1 && !this.props.isAuthenticated){

            promptLoginFirst(this.props)
            return;
        }

        if(this.state.openKeys.indexOf(key) === -1 && keyPath.length ==1){
            this.setState({
                openKeys: []
            });
        }



    };

    render() {


         const isAuthenticated = this.props.isAuthenticated

         let shareViaText =isAuthenticated ? "sms:"+ ((getMobileOperatingSystem() == 'iOS' ) ? '?&' : '?') + "body=" + encodeURIComponent(this.props.user.shareText.replace('refCode',this.props.user.referralCode) + " " + this.props.user.shareURL  ) : 'dđ'
         let CommonMenu1 = ()=>{
            return (
                <ul>
                    <li>{isAuthenticated ? (<Link to={'/activity'}>Activity</Link>) : (<a onClick={()=>promptLoginFirst(this.props)}>Activity</a>)}</li>
                    <li>{isAuthenticated ? (<Link to={'/bookings'}>Bookings <span className={style.badge}>{(this.props.total_bookings)?this.props.total_bookings:''}</span></Link>) : (<a onClick={()=>promptLoginFirst(this.props)}>Bookings</a>)}</li>

                    <li className="hidden">
                        {isAuthenticated ? (<Link className={style.btn_grey} to={'/proposals'}>Proposals</Link>) : (<a  onClick={()=>promptLoginFirst(this.props)}>Proposals</a>)}
                    </li>

                    <li>
                        {isAuthenticated ? (<Link to={'/settings'}>Settings</Link>) : (<a onClick={()=>promptLoginFirst(this.props)}>Settings</a>)}
                    </li>

                    <li>
                        <a onClick={()=>{
                            Modal.info({
                                iconType:'info-circle',
                                title: '',
                                content: (<div>Please check out the <a target="_blank" href="https://photosesh.freshdesk.com/support/solutions/folders/19000055989">PhotoSesh Help Center</a> for a quick solution or contact us by email at
                                <a target="_blank" href="mailto:support@photosesh.com"> Support@photosesh.com</a></div>),
                            });
                        }}>Support</a>
                    </li>
                    <li>
                        <a onClick={()=>{


                           if(isAuthenticated){
                               Modal.info({
                                   iconType:'',
                                   title: '',
                                   okText:'Close',
                                   content: (<div style={{fontSize: 20}}>Share your refferal code : <strong>{this.props.user.referralCode}</strong>
                                       <p>share on : </p>
                                       <div className={style.share_list}>
                                           {isMobile && <a target="_blank" href={shareViaText}><span className={style.share_via_text}></span></a>}
                                           <a target="_blank" href={fbLinkShare}><span className={style.icon_fb}></span></a>
                                           <a target="_blank" href={twitterLinkShare}><span className={style.icon_twitter}></span></a>
                                           <a target="_blank" href={`mailto:?subject=photosesh now&body=${encodeURIComponent(this.props.user.shareText.replace('refCode',this.props.user.referralCode) + " " + this.props.user.shareURL  )}`}><span className={style.icon_email}></span></a>
                                       </div>

                                   </div>),
                               });
                           }else{
                               promptLoginFirst(this.props)
                           }




                        }}>Earn Credits</a>
                    </li>
                    <li className={style.devider}></li>

                    {isAuthenticated &&   <li><Link className={style.btn_transparent} to={'/book'}>New PhotoSesh</Link></li>}



                    {(isAuthenticated) ? ( <li style={{marginTop: 40,marginBottom:30}}>
                        <Popconfirm placement="top" title={'Are you sure you want to log out?'} onConfirm={()=>{
                            this.props.logout();
                            this.goTo('/login')
                        }}  okText="Log out" cancelText="Cancel">
                            <a>LOGOUT</a>
                        </Popconfirm>
                    </li>): <li style={{marginTop: 40,marginBottom:30}}><a className={style.btn_transparent} style={{padding:'0 60px'}} onClick={()=> this.props.history.replace('/login')}> LOGIN</a></li>}


                    <li>
                        <a href="http://enterprise.photosesh.com">Enterprise</a>
                    </li>

                </ul>
            )
        }

        let CommonMenu = ()=> {
            return (


                <div>

                    <div style={{padding:15,textAlign:'center'}}>



                        <Button

                            id={'add-new-button'}

                            onClick={e=>this.goTo('/book')}
                            style={{width:'100%',


                                background: 'none',
                                color: 'white',
                                maxWidth:220

                            }} shape="round" icon="plus" size={'large'} >New PhotoSesh </Button>



                    </div>




                    <Menu
                        className={'left-menu'}
                        mode="inline"
                        openKeys={this.state.openKeys}
                        onOpenChange={this.onOpenChange}
                        onClick={this.onClick}

                    >




                        <Menu.Item key="dashboard"><Link to="/"><DashboardOutlined /> Dashboard</Link></Menu.Item>
                        <Menu.Item key="activity"><Link to="/"><SlackOutlined /> Activity</Link></Menu.Item>

                        <Menu.Item key="bookings">{isAuthenticated ? (<Link to="/bookings"><DiffOutlined /> Bookings <span className={style.badge}>{(this.props.total_bookings)?this.props.total_bookings:''}</span></Link>) : (
                            <a><DiffOutlined /> Bookings</a>)}</Menu.Item>




                        <SubMenu
                            subMenuCloseDelay={1}
                            subMenuOpenDelay={1}
                            key="settings"
                            title={
                                <span>
                                  <SettingOutlined /> Settings
                                </span>
                            }
                        >


                            <Menu.Item key="settings1">
                                {isAuthenticated && (<Link to="/settings/profile"><UserOutlined />  Edit Profile</Link>)}
                                {!isAuthenticated && (<span><UserOutlined />  Edit Profile</span>)}

                            </Menu.Item>
                            <Menu.Item key="settings2">
                                {isAuthenticated && ( <Link to="/settings/payment-credits"> <DollarOutlined/> Payment</Link>)}
                                {!isAuthenticated && (<span><DollarOutlined/>  Payment</span>)}
                            </Menu.Item>
                            <Menu.Item key="settings3">
                                {isAuthenticated && (  <Link to="/settings/change-password"> <SafetyOutlined/>  Change Password</Link>)}
                                {!isAuthenticated && (<span><SafetyOutlined/>  Change Password</span>)}


                            </Menu.Item>
                            <Menu.Item key="settings4">
                                {isAuthenticated && (  <Link to="/settings/style-code"> <ScheduleOutlined/> PhotoSesh Style Code</Link>)}
                                {!isAuthenticated && (<span><ScheduleOutlined/> PhotoSesh Style Code</span>)}

                            </Menu.Item>
                        </SubMenu>

                        <SubMenu
                            key="support"
                            title={
                                <span>
                                 <WhatsAppOutlined /> Support
                                </span>
                            }
                        >

                            <Menu.Item key="my-profile">
                                <a href="https://photosesh.freshdesk.com/support/solutions/19000037429"><DeploymentUnitOutlined /> PhotoSesh Help
                                    Center</a>

                            </Menu.Item>
                            <Menu.Item key="payment">
                                <a href="mailto:concierge@photosesh.com"> <WhatsAppOutlined /> Contact Us</a>
                            </Menu.Item>

                        </SubMenu>




                        <Menu.Item key="earn-credits">
                            <a onClick={()=>{

                                if(isAuthenticated){
                                    Modal.info({
                                        iconType:'',
                                        title: '',
                                        okText:'Close',
                                        content: (<div style={{fontSize: 20}}>Share your refferal code : <strong>{this.props.user.referralCode}</strong>
                                            <p>share on : </p>
                                            <div className={style.share_list}>
                                                {isMobile && <a target="_blank" href={shareViaText}><span className={style.share_via_text}></span></a>}
                                                <a target="_blank" href={fbLinkShare}><span className={style.icon_fb}></span></a>
                                                <a target="_blank" href={twitterLinkShare}><span className={style.icon_twitter}></span></a>
                                                <a target="_blank" href={`mailto:?subject=photosesh now&body=${encodeURIComponent(this.props.user.shareText.replace('refCode',this.props.user.referralCode) + " " + this.props.user.shareURL  )}`}><span className={style.icon_email}></span></a>
                                            </div>

                                        </div>),
                                    });
                                }

                            }}><DollarOutlined/> Earn Credits</a>
                        </Menu.Item>



                        {(isAuthenticated) ? (


                        <Menu.Item   key="login_logout">
                            <Popconfirm placement="top" title={'Are you sure you want to log out?'} onConfirm={()=>{
                                this.props.logout();
                                this.goTo('/login')
                            }}  okText="Log out" cancelText="Cancel">

                                <a> <LogoutOutlined /> Logout</a>
                            </Popconfirm>

                        </Menu.Item> ) :
                            (
                                <Menu.Item key="login_logout">  <Link to="/login"><LogoutOutlined />  Login </Link></Menu.Item>
                            )}





                    </Menu>
                </div>

            )
        }

        let SettingMenu = ()=>(<ul>
            <li><Link onClick={this.toggleSidebar} to={'/settings/profile'}>Edit Profile</Link></li>
            <li><Link onClick={this.toggleSidebar} to={'/settings/payment-credits'}>Payment</Link></li>
            <li><Link onClick={this.toggleSidebar} to={'/settings/change-password'}>Change Password</Link></li>
            <li><Link onClick={this.toggleSidebar} to={'/settings/style-code'}>PhotoSesh Style Code</Link></li>
        </ul>)

        let {showSidebar,collapsed} = this.state
        let fbLinkShare = isAuthenticated ? `https://www.facebook.com/sharer/sharer.php?u=${this.props.user.shareURL}` : '222',
            twitterLinkShare = isAuthenticated ?sharetwitter(this.props.user.shareURL,this.props.user.shareText.replace('refCode',this.props.user.referralCode)) :'222';



        return (
            <div className={classnames((showSidebar && isMobile) ? 's-collapsed':'')}>
                {showSidebar && (
                    <Sider width={(isMobile) ? window.innerWidth : 300} className={classnames(!isMobile ? style.sidebar : style.sidebar_mobile)}
                           collapsible
                           collapsed={this.props.collapsed}
                           onCollapse={this.props.onCollapse}
                    >
                        <div className={classnames(!isMobile ? style.sidebar : style.sidebar_mobile)} style={{marginTop:isMobile ? 80 : 0}}>
                            <div  className={style.logo} style={{display:isMobile ? 'none' : ''}}>
                                <Link to="/"><img src="/images/PhotoSesh_Logo2.png" alt=""/></Link>
                            </div>

                            <div className={style.menu}>

                                {!this.props.collapsed  && (
                                    <CommonMenu />
                                )}


                                {this.props.collapsed  && (
                                    <ul  className="collapsed-menu">
                                        <li><Link to={'/activity'}><Icon type="bell" /></Link></li>
                                        <li>
                                            <Link to={'/bookings'}>
                                                <Badge count={this.props.total_bookings}>
                                                    <Icon type="schedule" />
                                                </Badge>
                                            </Link>
                                        </li>
                                        <li  className="hidden">
                                            <Link to={'/proposals'}>
                                            </Link>
                                        </li>
                                        <li><Link to={'/settings'}><Icon type="setting" /></Link></li>
                                        <li><Link to={'/support'}><Icon type="customer-service" /></Link></li>

                                        <li>
                                            <a onClick={()=>{
                                                Modal.info({
                                                    iconType:'',
                                                    title: '',
                                                    okText:'Close',

                                                    content: (<div style={{fontSize: 20}}>Share your refferal code : <strong>{this.props.user.referralCode}</strong>
                                                        <p>share on : </p>
                                                        <div className={style.share_list}>
                                                            <a target="_blank" href={shareViaText}><span className={style.share_via_text}></span></a>
                                                            <a target="_blank" href={fbLinkShare}><span className={style.icon_fb}></span></a>
                                                            <a target="_blank" href={twitterLinkShare}><span className={style.icon_twitter}></span></a>
                                                            <a target="_blank" href={`mailto:?subject=photosesh now&body=${encodeURIComponent(this.props.user.shareText.replace('refCode',this.props.user.referralCode) + " " + this.props.user.shareURL  )}`}><span className={style.icon_email}></span></a>
                                                        </div>

                                                    </div>),
                                                });
                                            }}><Icon type="share-alt" /></a>
                                        </li>


                                        <li className={style.devider}></li>
                                        <li><Link  to={'/book'}><Icon type="plus-square-o" /></Link></li>


                                        {(isAuthenticated) ? (<li style={{marginTop: 40}}>
                                            <Popconfirm placement="top" title={'Are you sure you want to log out?'} onConfirm={()=>{
                                                this.props.logout();
                                                this.goTo('/login')
                                            }} okText="Log out" cancelText="Cancel">
                                                <a href=""><Icon style={{cursor:'pointer'}} type="logout" /></a>
                                            </Popconfirm>
                                        </li>): (null)}



                                        {
                                            (isMobile) && (
                                                <li><span onClick={e=>{

                                                    console.log(1111);
                                                    this.setState(state=>{



                                                    return {showSidebar:!state.showSidebar}

                                                });}} className={style.btn_hide_sidebar}><Icon type="left" />1</span></li>
                                            )
                                        }




                                    </ul>
                                )}

                                {this.state.collapsed && this.props.match.url == '/settings' && (
                                    <ul>
                                        <li><Link to={'/settings/profile'}><Icon type="setting" /></Link></li>
                                        <li><Link to={'/settings/payment-credits'}><Icon type="wallet" /></Link></li>
                                        <li><Link to={'/settings/change-password'}><Icon type="qrcode" /></Link></li>
                                        <li><Link to={'/settings/style-code'}><Icon type="disconnect" /></Link></li>
                                        <li><Link to={'/'}><Icon type="home" /></Link></li>

                                        {
                                            (isMobile) && (
                                                <li><span
                                                    onClick={e=>{this.setState(state=>{

                                                        console.log(1111);

                                                        return {showSidebar:!state.showSidebar}

                                                    });}}

                                                    className={style.btn_hide_sidebar}><Icon type="left" />2</span></li>
                                            )
                                        }



                                    </ul>
                                )}

                            </div>
                        </div>



                    </Sider>
                ) }


                {isMobile && (
                    <div className={style.sidebar_bottom_wrap} >
                        <Link to={'/'}><img src="/images/PhotoSesh_Logo2.png" alt=""/></Link>
                        <span className={style.btn_show_sidebar}

                              onClick={e=>{this.setState(state=>{
                                  return {showSidebar:!state.showSidebar}

                              });}}
                        ><Icon type="menu" /></span>
                    </div>
                )}

            </div>
        );
    }
}


const mapStateToProps = (state)=>{
    return {
        total_bookings: state.projects.bookings.filter(item=>['ACCEPTED','ACTIVE','COMPLETED'].indexOf(item.appointmentStatus) != -1).length,
        user:state.auth.user,
        isAuthenticated:state.auth.isAuthenticated,
        currentRoute:state.auth.route
    }
}
export default connect(mapStateToProps,{logout})(Sidebar)
