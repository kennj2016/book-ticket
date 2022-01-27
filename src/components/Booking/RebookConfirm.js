import style  from  './booking_review.css'
import React, {Component} from 'react'
import moment from 'moment'
import {List, Avatar , Form, Col, Row, Button, Table} from 'antd';
import {Redirect, Link} from 'react-router-dom'
import {connect} from 'react-redux'
import  {getPhotogapherName} from '../../utils/helper'
import FormDateTime from './Include/RebookFormDateTime'



class RebookConfirm extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {

        return (
            <div>
                <Row>

                    <div>
                        <FormDateTime {...this.props} oldBook={this.props.job}/>
                    </div>
                    <Col span={12} offset={6}>

                        <Link to={'/book/re-book'}>Back</Link>

                    </Col>
                </Row>


            </div>
        )
    }

}

const mapStateToProps = (state,props)=> {
    return {
        job: state.projects.bookings.find(item=>item._id == props.match.params.jobId)
    }
}

const WrappedRebookConfirm = Form.create()(RebookConfirm);

export default connect(mapStateToProps,{})(WrappedRebookConfirm)
