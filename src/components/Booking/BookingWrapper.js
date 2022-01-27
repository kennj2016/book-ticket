import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom'
import {Row, Form} from 'antd';
import {connect} from 'react-redux'
import {Layout, Menu, Icon, Avatar} from 'antd';
import HeaderTop from '../common/Include/HeaderTop'
import Step1 from './ChooseAddress'
import Step1aMobile from './Mobile/MobileSchedule'
import Step1Mobile from './Mobile/MobileChooseAddress'
import Step2 from './PhotoseshType'
import Step2Mobile from './Mobile/MobilePhotoseshType'
import Step3a from './DetailPhotoseshLight';
import Step4 from './NeedAPhotoSesh';
import Step4Mobile from './Mobile/MobileNeedAPhotoSesh';
import Step5 from './PhotographersWrapper';
import Step6 from './BookingReview';
import Success from './Success';
import Rebook from './ReBook';
import RebookSelectTitle from './RebookSelectTitle';
import RebookConfirm from './RebookConfirm';

import {logout} from '../../actions/authActions';
import {BrowserView, MobileView, isBrowser, isMobile} from 'react-device-detect'
const {Content} = Layout;

class BookingWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div id="booking-wrapper" style={{position:'relative'}}>
                <Route exact={true} path={`${this.props.match.url}/`} component={(isMobile) ? Step1Mobile : Step1}/>
                <Route exact={true} path={`${this.props.match.url}/schedule`} component={(isMobile) ? Step1aMobile : null}/>
                <Route exact={true} path={`${this.props.match.url}/photosesh-type`}
                       component={isMobile ? Step2Mobile : Step2}/>
                <Route exact={true} path={`${this.props.match.url}/photosesh-type/detail`} component={Step3a}/>
                <Route exact={true} path={`${this.props.match.url}/need-a-photosesh`}
                       component={isMobile ? Step4Mobile : Step4}/>
                <Route path={`${this.props.match.url}/photographers`} component={Step5}/>
                <Route exact={true} path={`${this.props.match.url}/booking-review`} component={Step6}/>
                <Route exact={true} path={`${this.props.match.url}/success`} component={Success}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
    }
}
export default connect(mapStateToProps, {logout})(BookingWrapper)



