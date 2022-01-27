import style from './menu.css'
import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import { Menu} from 'antd';

class MainMenu extends React.Component {
     render() {
        return (
            <Menu
                mode="horizontal"
                className={style.ant_menu}
            >
                <Menu.Item>
                    <Link to="/wedding" className="btn">WEDDING</Link>
                </Menu.Item>
                <Menu.Item>
                    <Link to="/book" className="btn">BOOK NOW</Link>
                </Menu.Item>
            </Menu>
        );
    }
}

export default MainMenu
