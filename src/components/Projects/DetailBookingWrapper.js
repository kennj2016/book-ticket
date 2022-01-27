import React, {Component} from 'react';
import {Route} from 'react-router-dom'
import {connect} from  'react-redux'
import DetailBooking from './DetailBooking'
import ViewAgentProfile from './ViewAgentProfile'

class DetailBookingWrapper extends Component {
    constructor(props){
        super (props)
    }


    render() {
        return (
            <div>
                <Route  exact={true}  path={`${this.props.match.url}/`} render={(props)=>{
                         return (<DetailBooking  {...this.props}/> )
                }} />
                <Route   exact={true}  path={`${this.props.match.url}/view-agent-profile`} render={(props)=><ViewAgentProfile isViewOldJob={true}   {...this.props} />}/>
            </div>
        );
    }
}


const mapStateToProps = (state,props)=>{
    let [bookingId,agentId] = props.match.params.booking_slug.split('_'),
         booking = state.projects.bookings.find(booking=>booking._id==bookingId && booking.agentData._id == agentId);

    return {
        booking,
        payment: state.payment,
        card_booking: state.payment.cards.find(card=>card._id == booking.paymentCardId)
    }
}
export default connect(mapStateToProps,{})(DetailBookingWrapper)


