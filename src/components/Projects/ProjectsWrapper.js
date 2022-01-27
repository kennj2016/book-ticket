import style from './projects_wrapper.css'

import React, {Component} from 'react';
import {Route} from 'react-router-dom'
import { Layout } from 'antd';
import {connect} from  'react-redux'
import Bookings from './Bookings'
import DetailBookingWrapper from './DetailBookingWrapper'
import {getBookings,setBookings} from '../../actions/projectAction'

const {  Content, Sider } = Layout;



class ProjectsWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:false
        }
    }
    componentWillMount (){

        this.setState({loading:true})
        getBookings().then(res=>{
            this.setState({loading:false})
            if (res.data.data) {

                let {upcomingAppointment,pastAppointment} = res.data.data

                upcomingAppointment = upcomingAppointment.map(item=>{ item.type = 'upcoming' ; return item })
                pastAppointment = pastAppointment.map(item=>{ item.type = 'previous' ; return item })

                let data = [...upcomingAppointment,...pastAppointment];

                this.props.setBookings(data) // dispatch data
            }
        },err=>{
            this.setState({loading:false})
        })

    }


    render() {
        return (
            <div>
                <Route  exact={true}  path={`${this.props.match.url}/`} render={(props)=> (<Bookings {...props} loading={this.state.loading} />)}/>
                <Route  exact={true}  path={`${this.props.match.url}/bookings`} render={(props)=> (<Bookings  {...props} loading={this.state.loading}/>)}/>
                <Route name="detail_booking"   path={`${this.props.match.url}/:booking_slug`} component={DetailBookingWrapper}/>
            </div>
        );
    }
}


const mapStateToProps = (state)=>{
    return {

    }
}

export default connect(mapStateToProps,{setBookings})(ProjectsWrapper)


