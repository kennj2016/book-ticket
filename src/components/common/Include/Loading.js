import React, {Component} from 'react';
import {Spin} from 'antd';
class Loading extends Component {

    render() {
        return (

            (<div style={{
                paddingTop:'30%',
                textAlign:'center'
            }}>
                <Spin tip="Loading..."/>
            </div>)
        );
    }
}

export default Loading
