import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Route, Switch, Redirect} from 'react-router-dom';
import LayoutMaster from './components/Layout/LayoutMaster'
import LayoutAuth from './components/Layout/LayoutAuth'
import DashboardWrapper from './components/Settings/Dashboard/DashboardWrapper'
import Forgot from './components/Settings/Login/ForgotPassword'
import NeedVerifiedEmail from './components/Settings/Login/NeedVerifiedEmail'
import Login from './components/Settings/Login/LoginPage'
import Signup from './components/Settings/Signup/SignupPage'
import SendEmail from './components/common/SendEmail'
import TestGallery from './components/Booking/Include/TestGallery'
import Collection from './components/Booking/Include/Collection'
import ViewAttachments from './components/Booking/ViewAttachments'
import BookingWrapper from './components/Booking/BookingWrapper'
import ProjectsWrapper from './components/Projects/ProjectsWrapper'
import LoginAs from './components/Settings/Login/LoginAs'
import {Alert} from 'antd';
import requireAuth from './utils/requireAuth'
import {updateRoute} from './actions/userActions'
import ReloadAnimate from './components/common/Include/ReloadAnimate';
import {BackTop} from 'antd';
import {connect} from 'react-redux'
import jQuery from 'jquery'
import EmptyWrapper from './components/Layout/EmptyWrapper'
import Dashboard from './components/Dashboard/Dashboard'
import TourWebsite from './components/Tour/TourWebsite'
import FavoriteCategory from "./components/Booking/Include/FavoriteCategory";
import CollectionFavorites from "./components/Booking/Include/CollectionFavorites";

const LayoutEmptyWrapperAuthorize = requireAuth(EmptyWrapper)
const LayoutMasterAuthorize = requireAuth(LayoutMaster)

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            reload: false
        }

        this.props.history.listen((location, action) => {


            if (ReactDOM.findDOMNode(this) && typeof ReactDOM.findDOMNode(this).scrollIntoView != 'undefined') {
                ReactDOM.findDOMNode(this).scrollIntoView();
            }

            this.props.updateRoute(location.pathname)
            this.setState({reload: true})
            setTimeout(() => {
                this.setState({reload: false})

            }, 700)
        });
    }


    generateLayout = (props, Layout, Component) => (<Layout {...props}><Component  {...props}  /></Layout>)
    generateLayoutWithBreadcrumb = (props, Layout, Component) => (<Layout {...props}><Component  {...props} hasBreadcrumb={true}/></Layout>)


    componentDidMount() {
        setTimeout(() => {


            if (typeof ReactDOM.findDOMNode(this).scrollIntoView != 'undefined') {
                ReactDOM.findDOMNode(this).scrollIntoView();
            }

        }, 700)
    }

    render() {
        return (
            <div>
                {this.state.reload && (<ReloadAnimate/>)}

                <Switch>
                    <Route exact path="/need-verified-email" render={(props) => this.generateLayout(props, LayoutAuth, NeedVerifiedEmail)}/>
                    <Route exact path="/forgot" render={(props) => this.generateLayout(props, LayoutAuth, Forgot)}/>
                    <Route exact path="/login" render={(props) => this.generateLayout(props, LayoutAuth, Login)}/>
                    <Route exact path="/signup" render={(props) => this.generateLayout(props, LayoutAuth, Signup)}/>
                    <Route exact path="/booking/attachments/:id" component={ViewAttachments}/>
                    <Route exact path="/send-email" render={(props) => this.generateLayout(props, LayoutMasterAuthorize, SendEmail)}/>

                    <Route path="/book" render={(props) => this.generateLayout(props, LayoutMaster, BookingWrapper)}/>
                    <Route path="/test-gallery" render={(props) => this.generateLayout(props, LayoutMaster, TestGallery)}/>
                    <Route exact path="/collections" render={(props) => (<Collection {...props} />)}/>
                    <Route exact path="/collections/favorite" render={(props) => (<FavoriteCategory {...props} />)}/>
                    <Route exact path="/collections/category" render={(props) => (<CollectionFavorites {...props} />)}/>


                    {this.props.isAuthenticated && (
                        <Route exact path="/" render={(props) => this.generateLayoutWithBreadcrumb(props, LayoutMasterAuthorize, Dashboard)}/>
                    )}
                    {!this.props.isAuthenticated && (
                        <Route exact path="/" render={(props) => this.generateLayout(props, EmptyWrapper, BookingWrapper)}/>
                    )}


                    <Route path="/settings" render={(props) => this.generateLayoutWithBreadcrumb(props, LayoutMasterAuthorize, DashboardWrapper)}/>

                    <Route path="/bookings" render={(props) => this.generateLayoutWithBreadcrumb(props, LayoutMasterAuthorize, ProjectsWrapper)}/>
                    <Route path="/proposals"
                           render={(props) => this.generateLayoutWithBreadcrumb(props, LayoutMasterAuthorize, () => (<div><Alert message="You currently have no proposals" type="info"/></div>))}/>
                    <Route path="/advanced" render={(props) => this.generateLayoutWithBreadcrumb(props, LayoutMasterAuthorize, () => (<div><Alert message="Coming Soon" type="info"/></div>))}/>
                    <Route path="/loginas/:token" component={LoginAs}/>
                    <Route path="/tour" render={(props) => this.generateLayout(props, EmptyWrapper, TourWebsite)}/>
                    <Redirect to="/"/>

                </Switch>
            </div>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
    }
}

export default connect(mapStateToProps, {updateRoute})(App)
