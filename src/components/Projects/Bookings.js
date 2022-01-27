import React,{Component} from 'react'
import {connect} from 'react-redux';

import Header from './Include/Header';
import {GRID,LIST} from '../../define'
import {Layout} from 'antd';
import ShowGrid from './Include/Grid'
import ShowList from './Include/List'
import PropType from 'prop-types'
import {setFilterStatus} from '../../actions/projectAction'
import {STATUS} from '../../define'
const {  Content } = Layout;



class Bookings extends Component{
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount(){

        this.props.setFilterStatus(STATUS['ALL'])

    }


    render() {

        return (
            <div>
                <Header />
                <div>
                    {this.props.show_mode == LIST && (<ShowList {...this.props} />) }
                    {this.props.show_mode == GRID && (<ShowGrid {...this.props} />) }
                </div>
            </div>
        )
    }

}

const mapStateToProps = (state)=>{
    return {
        show_mode:state.projects.show_mode
    }
}

Bookings.propType = {
    loading:PropType.bool.isRequired
}

export default connect(mapStateToProps,{setFilterStatus})(Bookings)

