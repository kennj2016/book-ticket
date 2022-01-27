import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Row, Col, Form, Icon, Input, Button, Checkbox,message} from 'antd';
import {connect} from 'react-redux'
import {login, setToken, filterUserData, resendEmailVerify,logout} from '../../../actions/authActions'
import {getStorage,removeStorage} from '../../../utils/helper'
import style from './login.css'


const FormItem = Form.Item;

class NeedVerifiedEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:false
        }
    }


    logout = (e)=>{
        e.preventDefault()
        this.props.logout();
        this.goTo('/login')
    }
    resendVerifiedEmail = (e)=>{
        e.preventDefault()

        this.setState({loading:true})
        resendEmailVerify(this.props.user.email).then(res => {
            message.info('email has sent')
            this.setState({loading:false})
        })
    }

    goTo(route) {
        this.props.history.replace(`${route}`)
    }

    componentDidMount() {



      setTimeout(()=>{
          console.log(this.props.user);

          if(typeof  this.props.user.email != 'undefined'){
              if(this.props.user.isVerified){

                  console.log('op');
                  this.goTo('/')
              }else{
                  resendEmailVerify(this.props.user.email).then(res => {
                  })
              }
          }


      },2500)

    }

    render() {

        return (
            <Row>
                <Col xs={{span: 24, offset: 0}}
                     sm={{span: 16, offset: 4}}
                     md={{span: 8, offset: 8}}
                     lg={{span: 8, offset: 8}}
                     xl={{span: 8, offset: 8}} className="col-login">
                    <div style={{
                        background: 'white',
                        padding: 20,
                        borderRadius: 5
                    }}>

                        <h2><span>Verify your account email address !</span> </h2>
                        <p>Please check your email and click the verification link to verify your email address.</p>
                        <p>Click <a className={this.state.loading? 'sending':''} onClick={this.resendVerifiedEmail}>Here</a> to Resend verification email.</p>
                    </div>

                    <div  style={{
                        background: 'white',
                        margin:'10px 0',
                        borderRadius: 5
                    }}>
                        <ul   style={{padding:0}} className={style.footer}>
                            <li><a onClick={this.logout}>Logout</a></li>
                            |
                            <li><a className={this.state.loading? 'sending':''} onClick={this.resendVerifiedEmail}>Resend verification email.</a></li>
                        </ul>
                    </div>


                </Col>
            </Row>

        );
    }
}



const mapStateToProps = (state) => {
    return {
        isAuthenticated:state.auth.isAuthenticated,
        user:state.auth.user
    }
}
export default connect(mapStateToProps, {logout})(NeedVerifiedEmail)



