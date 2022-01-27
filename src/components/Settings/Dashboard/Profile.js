import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Row, Form} from 'antd';
import {connect} from 'react-redux'
import { Layout, Menu, Icon } from 'antd';
import ProfileForm from './Include/EditProfileForm'
import {setToken} from '../../../actions/authActions'

const {  Content, Sider } = Layout;
const FormItem = Form.Item;

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    goTo(route) {
        this.props.history.replace(`${route}`)
    }


    render() {

        return (
            <div>
                <ProfileForm user={this.props.user} setToken={this.props.setToken} />
            </div>
        );
    }
}



const mapStateToProps = (state) => {
    return {
        user:state.auth.user
    }
}
export default connect(mapStateToProps, {setToken})(Profile)



