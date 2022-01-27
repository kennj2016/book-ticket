import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {Menu, Dropdown, Icon, message,Avatar} from 'antd';
import Headphone from 'react-icons/lib/ti/headphones'
import {logout} from '../../../actions/authActions'
import PropTypes from 'prop-types';
import style from './header_top.css';
import classnames from 'classnames'
class HeaderTop extends Component {

    constructor(props) {
        super(props);
    }
    goTo = (route)=>{this.props.history.replace(route)}


    render() {
        const menu = (
            <Menu>

                <Menu.Item key="0">
                    <Link to="/settings">Settings</Link>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="1"
                >
                    <a
                        onClick={() => {
                            this.props.logout();
                            this.goTo('/login')
                            message.success('See you again :)');
                        }}
                    ><Icon type="logout"></Icon> Logout
                    </a>
                </Menu.Item>
            </Menu>
        );


        const userLinks = (
            <Dropdown  className={style.right_dropdown} overlay={menu} trigger={['click']}  placement="bottomLeft">
                <a className="ant-dropdown-link" href="#">
                    <span>{this.props.fullname}</span>
                    <Icon type="down"/>
                </a>
            </Dropdown>
        );

        return (

            <div className={style.header_top} style={this.props.style}>
                <div className={style.top_left}>
                    <i className="glyphicon-headphones"><Headphone /></i>
                    <span className={style.sub}><strong>  QUESTION?</strong> CALL <span
                        className={style.primary}>555.111.9999</span></span>
                </div>
                <div className={classnames('top_right',style.top_right)}>

                    {(this.props.avatar == '') ? ( <Avatar className={style.avatar} icon="user" />) : (<Avatar   className={style.avatar} src={this.props.avatar} />)}

                    {userLinks}

                </div>
            </div>


        );
    }
}


export default HeaderTop