import style  from  './booking_review.css'
import React, {Component} from 'react'
import moment from 'moment'
import {List, Avatar , Form, Col, Row, Button, Table} from 'antd';
import {Redirect, Link} from 'react-router-dom'
import {connect} from 'react-redux'
import  {getPhotogapherName} from '../../utils/helper'


class ReBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillReceiveProps(props) {
    }
    componentWillMount() {
    }

    render() {
        return (
           <div>
               <Row>
                   <div  style={{textAlign:'center'}}>
                       <h2>Re-booking</h2>
                       <div>
                           Select Photographer
                       </div>
                   </div>


                   <Col span={12} offset={6}>
                       <List
                           itemLayout="horizontal"
                           dataSource={this.props.recentPhotographers}
                           renderItem={photographer => (
                               <List.Item >
                                   <List.Item.Meta
                                       avatar={<Avatar shape="square" size={64} src={photographer.profilePicURL.thumb} />}
                                       title={getPhotogapherName(photographer.name.firstName + ' ' + photographer.name.lastName)}
                                       description={(<div dangerouslySetInnerHTML={{ __html: photographer.recentJob.titleOrDescription }}></div>)}
                                   />
                                   <Button><Link to={'/book/re-book/agents/' +photographer._id}>rebook</Link></Button>

                               </List.Item>
                           )}
                       />



                   </Col>
               </Row>


           </div>
        )
    }

}
const mapStateToProps = (state)=> {
    return {
        bookings: state.projects.bookings,
        recentPhotographers : state.projects.bookings.map(item=>{
            let agent = item.agentData
            agent.recentJob = item
            return agent
        }).filter((item, pos, self)=> {
            return self.indexOf(self.find(a=>a._id == item._id)) == pos;
        })
        .filter(item=>{
            return state.auth.user.favoritePhotographers.indexOf(item._id) > -1
        })
    }
}
const WrappedReBook = Form.create()(ReBook);
export default connect(mapStateToProps,{})(WrappedReBook)
