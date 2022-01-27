import React, {Component} from 'react'
import {Row, Icon, Card, Layout, Button} from 'antd';
import {Redirect, Link} from 'react-router-dom'
import {connect} from  'react-redux'
import {removeBookingInfo} from '../../actions/bookActions'
const {Header} = Layout
class Success extends Component {
    constructor(props) {
        super(props);
    }

    goTo(route) {
        this.props.history.replace(route)
    }


    componentWillMount(){
        this.props.removeBookingInfo()
    }

    render() {
        let btnStyle = {
            marginTop:30,
            width:150,
            marginRight:10,
            color:'#ffffff',
            background: 'black',
            padding: 10,
            display: 'inline-block'
        }
        return (
            <div style={{maxWidth:700,margin:'50px auto'}}>
                <Card>

                    <div style={{textAlign:'center',fontSize: 80,color: '#98d23d'}}>
                        <Icon style={{color:'dark-green'}} type="check-circle" />
                    </div>

                    <h2 className="head-title-center">Your Booking is Pending!</h2>
                    <div style={{textAlign:'center',marginBottom:100}}>
                        Thank you for your PhotoSesh request.  Your booking has been dispatched to your favorite photographer(s).<br/>
                        You will be notified with a response via email shortly.  Feel free to also check the status in the "Bookings" section for more information.
                        <br/>

                        <strong>IMPORTANT :</strong> Please make sure you have the proper email and phone number in your Profile Settings to best communicate with the PhotoSesh photographer.
                        <br/>




                        <Link style={btnStyle} to="/bookings">Bookings</Link>

                        <Link style={btnStyle} to="/">Home Page</Link>
                    </div>

                </Card>

                <ul className="menu_simple">
                    <li><Link to={'/'}>My Bookings </Link></li> |
                    <li><Link to={'/book'}>Continue Booking </Link></li>


                </ul>

            </div>
        )
    }

}

export default connect(null, {removeBookingInfo})(Success)
