import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import MainMenu from './Menu';
import style from './header_bottom.css';

class HeaderBottom extends Component {

    render() {
         return (

            <div className={style.header_bot}>
                <Link className={style.logo} to={'/'}>
                    PhotoSesh Logo
                </Link>
                <MainMenu className={style.main_menu} {...this.props}  />
            </div>

        );
    }
}

export default HeaderBottom
