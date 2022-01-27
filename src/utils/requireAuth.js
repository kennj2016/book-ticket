import React from 'react';
import {connect} from 'react-redux';
import {verifyToken} from '../actions/authActions';
import {message} from 'antd';
import Loading from '../components/common/Include/Loading'



export default function (ComposedComponent) {

    class Authenticate extends React.Component {

        state = {
            loading:true
        }

        goTo(route){
            this.props.history.replace(route)
        }


        componentWillMount(){

            if (!localStorage.access_token) {
                this.goTo('/login')
            }else{



                /*
                * when already access_token from localstorage
                * next, check authenticated from verify token (localStoragaLoad.js)
                *
                * */


                if(typeof  this.props.isAuthenticated != 'undefined' && this.props.isAuthenticated){
                   if(this.props.user.isVerified){
                       this.setState({loading:false})
                   }else{
                       this.goTo('/need-verified-email')
                   }
                }
            }
        }

        componentWillReceiveProps(props){
            if(props.isAuthenticated){
                this.setState({loading:false})
            }
        }
        render() {

            return (this.state.loading) ?
                (<Loading/>) :
                (<ComposedComponent {...this.props} />)

        }
    }

    function mapStateToProps(state) {
        return {
            isAuthenticated: state.auth.isAuthenticated,
            user: state.auth.user
        };
    }

    return connect(mapStateToProps, {})(Authenticate);
}
