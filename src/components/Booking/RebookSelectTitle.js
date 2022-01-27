import style  from  './booking_review.css'
import React, {Component} from 'react'
import moment from 'moment'
import {List, Avatar , Form, Col, Row, Button, Table} from 'antd';
import {Redirect, Link} from 'react-router-dom'
import {connect} from 'react-redux'
import  {getPhotogapherName} from '../../utils/helper'
import {resetBookingInfo} from '../../actions/bookActions'
class RebookSelectTitle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listRecentJobs:[]
        };
    }

    componentWillReceiveProps(props) {
    }
    componentDidMount() {

        if(this.props.bookings.length){

            this.props.resetBookingInfo()

            let listRecentJobs = this.props.bookings.filter(booking=>{
                return booking.agentData._id == this.props.match.params.photographerId
            })
            this.setState({
                listRecentJobs
            })
        }else{
            this.props.history.replace(`/`)
        }



    }

    render() {
        const  {listRecentJobs} = this.state
        return (
            <div>
                <Row>

                    <div  style={{textAlign:'center'}}>
                        <h2>Re-booking</h2>
                        <div>
                            Select Booking
                        </div>
                    </div>


                    <Col span={12} offset={6}>
                        <List
                            itemLayout="horizontal"
                            dataSource={listRecentJobs}
                            renderItem={job => (
                                <List.Item >

                                    <List.Item.Meta
                                        avatar={<Avatar shape="square" size={64} src={job.agentData.profilePicURL.thumb} />}
                                        title={(<div dangerouslySetInnerHTML={{ __html: job.titleOrDescription }}></div>)}
                                        description={<div>
                                            <div>
                                                <strong>At : </strong>({job.appointmentStartTime + '-' + job.appointmentEndTime})
                                            </div>
                                            <div>
                                                <strong>Address :</strong> {job.appointmentAddress}
                                            </div>
                                        </div>}

                                    />



                                    <Button><Link to={'/book/re-book/job/'+job._id}>rebook</Link></Button>

                                </List.Item>
                            )}
                        />

                        <Link to={'/book/re-book'}>Back</Link>

                    </Col>
                </Row>


            </div>
        )
    }

}

const mapStateToProps = (state)=> {
    return {
        bookings: state.projects.bookings
    }
}

const WrappedRebookSelectTitle = Form.create()(RebookSelectTitle);

export default connect(mapStateToProps,{resetBookingInfo})(WrappedRebookSelectTitle)
