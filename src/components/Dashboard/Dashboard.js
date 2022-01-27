import React, {Component} from 'react';
import {Route,Link} from 'react-router-dom'
import {connect} from 'react-redux'
import { Layout, Menu, Icon,Row,Col,Button,Card } from 'antd';

import { PlaySquareOutlined } from '@ant-design/icons';
import {getWelcomeTextMessage} from '../../actions/userActions'
import './dashboard.scss'
class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            welcomeText:{}
        }
    }
    componentWillMount(){
        getWelcomeTextMessage().then(res=>{
            let welcomeText = res.data.data;

            this.setState({
                welcomeText
            })
        });
    }
    goTo(route) {
        this.props.history.replace(`${route}`)
    }
    render() {
        let {welcomeText} = this.state

        return (
            <div id="dashboard-page">
                <Row  gutter={20}>
                    <Col xs={24} sm={24} md={12} lg={16} xl={16}>
                        <Card>
                            <h3>{welcomeText.title}</h3>
                            <br/>

                           <div>
                               {welcomeText.description}
                           </div>


                        </Card>

                    </Col>
                    <Col xs={24} sm={24} md={12} lg={8} xl={8}>

                        <Card>
                           <div className={'text-center'}>
                               <PlaySquareOutlined style={{ fontSize: '35px'}} /> <br/>
                              <h3> How to request a PhotoSesh Photographer</h3> <br/>
                               <Button type={'primary'}><Link to={'/tour'}>Interactive Tour</Link></Button>
                           </div>
                        </Card>

                    </Col>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {

    }
}
export default connect(mapStateToProps, {})(Dashboard)



