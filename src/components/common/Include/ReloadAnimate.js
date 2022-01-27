import React, {Component} from 'react';
class ReloadAnimate extends Component {
    render() {
        let style = {
            'height': '1px',
            'display': 'block',

            'background':'rgba(255,255,255,1)',
            'background':'-moz-linear-gradient(left, rgba(255,255,255,1) 0%, rgba(32,175,227,1) 100%)',
            'background':'-webkit-gradient(left top, right top, color-stop(0%, rgba(255,255,255,1)), color-stop(100%, rgba(32,175,227,1)))',
            'background':'-webkit-linear-gradient(left, rgba(255,255,255,1) 0%, rgba(32,175,227,1) 100%)',
            'background':'-o-linear-gradient(left, rgba(255,255,255,1) 0%, rgba(32,175,227,1) 100%)',
            'background':'-ms-linear-gradient(left, rgba(255,255,255,1) 0%, rgba(32,175,227,1) 100%)',
            'background':'linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(32,175,227,1) 100%)',

            'width': '0',
            'WebkitTransition': 'width .7s ease',
            'MozTransition': 'width .7s ease',
            'transition': 'width .7s ease',
            'WebkitAnimation': 'progressbar .7s ',
            'animation': 'progressbar .7s ',
            'position': 'absolute',
            'top': '0',
            'left': '0',
        };
        return (
            (<div style={style}></div>)
        );
    }
}

export default ReloadAnimate
