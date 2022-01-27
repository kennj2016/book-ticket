import React, {Component} from 'react';
import {Form,Spin} from 'antd';
import {connect} from 'react-redux'
import {setToken,filterUserData,verifyLoginAs,logout} from '../../../actions/authActions'
import setAuthorizationToken from '../../../utils/setAuthorizationToken'
import {decode} from '../../../utils/crypt'


class LoginAs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogin: false,
            loading:false
        }
    }
    goTo(route) {
        this.props.history.replace(`${route}`)
    }

    componentWillMount(){
        let token = this.props.match.params.token || ''
        if(token){

            this.props.logout()
            this.setState({loading:true})
            setAuthorizationToken(decode(token))

            verifyLoginAs().then(response=>{


                let data = response.data.data.user;
                let user = filterUserData(data);

                this.props.setToken(data.accessToken,user)

                this.setState({loading:false})
                window.location.href = '/'
            })


        }


    }

    render() {

        return (
           <div><Spin loading={this.state.loading}></Spin></div>

        );
    }
}


const WrappedLoginForm = Form.create()(LoginAs);

const mapStateToProps = (state) => {
    return {
        isAuthenticated:state.auth.isAuthenticated
    }
}
export default connect(mapStateToProps, {setToken,logout})(WrappedLoginForm)



