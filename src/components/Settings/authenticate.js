/**
 * Created by lamtanphiho on 8/24/2017.
 */
import React, {Component} from 'react';
import {Route,Link} from 'react-router-dom'
import { Menu, Icon } from 'antd';
import Login from '../Settings/login'
const MenuItemGroup = Menu.ItemGroup;
const request = require('../../controllers/request')

export default class Authenticate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogin: false,
            visible: false
        }
    }
    componentDidMount = function () {
        let user = localStorage.getItem("user");
        if (user != 'undefined' && user != null) {
            // console.log(user)
            user = JSON.parse(user);
            request.get('/user/getProfile', {}, {
                headers: {
                    'authorization': user.accessToken
                }
            }).then(body=>{
                if (body.statusCode == 200)
                    this.setState({isLogin: true});
                else {
                    console.log(body);
                    localStorage.clear();
                    this.showLogin();
                }
            })
        }

    }
    showLogin = () => {
        this.setState({ visible: true });
    }
    hideLogin = () => {
        this.setState({ visible: false });
    }
    render() {
        if (this.state.isLogin) {
            return null;
        }

        return (
            <li onClick={this.showLogin}>LOGIN
                <Login visible={this.state.visible}  onCancel={this.hideLogin}/>
            </li>
        );
    }
}