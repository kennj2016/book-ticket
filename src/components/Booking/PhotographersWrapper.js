import React, {Component} from 'react'
import {Row, Col, Card, Layout, Rate, message, Spin, Alert} from 'antd';
import {Route, Link} from 'react-router-dom'

import ListPhotographers from './Include/ListPhotographers'
import SinglePhotographer from './Include/SinglePhotographer'
import {ProcessStep} from './ProcessStep'
import {BrowserView, MobileView, isBrowser, isMobile} from 'react-device-detect'
class PhotographersWrapper extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>

                {(!isMobile) && (
                    <div style={{margin: '30px auto',maxWidth:'90%',padding:5}} className="sticky">
                        <ProcessStep current={3} {...this.props} />
                    </div>
                )}
                <Route  exact={true}  path={`${this.props.match.url}/`} component={ListPhotographers} />
                <Route  exact={true}  path={`${this.props.match.url}/:agent_id`}  component={SinglePhotographer} />
            </div>
        )
    }
}

export default PhotographersWrapper