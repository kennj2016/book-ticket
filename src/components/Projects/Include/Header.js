import style from './header.css'
import {BrowserView, MobileView, isBrowser, isMobile} from 'react-device-detect'
import React,{Component} from 'react'
import {  Menu, Dropdown, Icon  ,Layout, Row, Col,Button} from 'antd';
import {setShowMode,setFilterStatus,setFilterType} from '../../../actions/projectAction'
import {connect} from 'react-redux';
import classnames from 'classnames'
import {GRID,LIST,STATUS} from '../../../define'
const {  Content } = Layout;


class Header extends Component{
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleButtonClick = ()=>{
        console.log(1);
    }

    render() {

        const menuFilterMobile = (
            <Menu onClick={(e)=>{  this.props.setFilterStatus(e.key)}}>
                {Object.keys(STATUS).map(key=>{
                    return (
                    <Menu.Item key={key} onClick={(e)=>{  this.props.setFilterStatus(STATUS[key])}}>{key.replace('_',' ')}</Menu.Item>
                    )
                })}
            </Menu>
        );


        return (
            <div className={style.header}>
                <Row>
                    <Col xs={{span: 24, offset: 0}}
                         sm={{span: 24, offset: 0}}
                         md={{span: 8, offset: 0}}
                         lg={{span: 6, offset: 0}}
                         xl={{span: 8, offset: 0}}>

                        View Model <br/>
                        <div style={{borderBottom: '1px solid #f5f5f5'}}>

                            <a  onClick={()=>{ this.props.setShowMode(LIST) }}
                                className={classnames(style.btn_view_mode,(this.props.show_mode == LIST)? style.active : '' )}> { this.props.show_mode == LIST && (<Icon type="check" />)}  <span>List <Icon type="bars" /></span></a>
                            <a onClick={()=>{ this.props.setShowMode(GRID) }}
                               className={classnames(style.btn_view_mode,(this.props.show_mode == GRID)? style.active : '' )}> { this.props.show_mode == GRID && (<Icon type="check" />)}  <span>Grid <Icon type="appstore-o" /></span></a>

                        </div>


                    </Col>

                    <Col xs={{span: 24, offset: 0}}
                         sm={{span: 24, offset: 0}}
                         md={{span: 16, offset: 0}}
                         lg={{span: 18, offset: 0}}
                         xl={{span: 16, offset: 0}}>

                        {!isMobile && (
                            <div>
                                <ul className={style.list_status_right}>
                                    {Object.keys(STATUS).map(key=>{
                                        return (<li key={key}><span onClick={(e)=>{  this.props.setFilterStatus(STATUS[key])}} className={classnames((this.props.active_status == STATUS[key])? style.active_status:'' )} href="">{key.replace('_',' ')}</span></li>)
                                    })}
                                </ul>
{/*

                                <div className={classnames('filter_type',style.filter_type)}>
                                    <span

                                        className={classnames((this.props.active_type == 'upcoming')? 'active' : '' )}
                                        onClick={()=>{this.props.setFilterType('upcoming')}}>upcoming</span> |
                                    <span
                                        className={classnames((this.props.active_type == 'previous')? 'active' : '' )}

                                        onClick={()=>{this.props.setFilterType('previous')}}>previous</span>
                                </div>
*/}


                            </div>
                        )}



                        {isMobile && (

                            <div style={{margin: "10px 0"}}>
                                Filter: <br/>
                                <Dropdown overlay={menuFilterMobile}>
                                    <Button style={{
                                        display: 'inline-block',
                                        width: '100%'
                                    }}>
                                        {this.props.active_status} <Icon type="down" />
                                    </Button>
                                </Dropdown>



                                {/*<div className={classnames('filter_type',style.filter_type)}>
                                    <span

                                        className={classnames((this.props.active_type == 'upcoming')? 'active' : '' )}
                                        onClick={()=>{this.props.setFilterType('upcoming')}}>upcoming</span> |
                                    <span
                                        className={classnames((this.props.active_type == 'previous')? 'active' : '' )}

                                        onClick={()=>{this.props.setFilterType('previous')}}>previous</span>
                                </div>*/}


                            </div>


                        )}


                    </Col>
                </Row>


            </div>
        )
    }

}

const mapStateToProps = (state)=>{
    return {
        show_mode:state.projects.show_mode,
        active_status:state.projects.active_status,
        active_type:state.projects.active_type,
    }
}


export default connect(mapStateToProps,{setShowMode,setFilterStatus,setFilterType})(Header)

