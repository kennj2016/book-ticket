import style from './grid.css'

import React,{Component} from 'react'
import {Link} from 'react-router-dom'
import {Layout,Spin, Row, Col,Icon,Card,Badge} from 'antd';
import {connect} from 'react-redux';
import {STATUS,UTC_OFFSET} from '../../../define'
import moment from 'moment'
import classnames from 'classnames'
import {cleanSlug,getSizeClient,getPhotogapherName} from '../../../utils/helper'

import jQuery from 'jquery'


class Grid extends Component{
    constructor(props) {
        super(props);
        this.state = {
            sizeClient:null,
            isLongDescription:false
        };
    }

    goTo(route){
        this.props.history.replace(route)
    }


    componentDidMount(){
        this.setState({sizeClient:jQuery('html').width()})
    }

    render() {

        let wrapperCol = {
            xs: {span: 24, offset: 0},
            sm: {span: 24, offset: 0},
            md: {span: 16, offset: 4},
            lg: {span: 8, offset: 0},
            xl: {span: 6, offset: 0},
            className: style.item_wrapper
        }
        let {sizeClient} = this.state
        /*  const bookings = this.props.bookings.sort((a,b)=>{
         return a.type == this.props.active_type
         }).reverse()
         const breakLineIndex = bookings.filter(item=>item.type== this.props.active_type).length*/


        /*
         *
         *
         * */

        let sortByStatus = (a,b)=>{
            /*    let order = ['ACCEPTED','PENDING','COMPLETED','REJECTED','CANCELLED','EXPIRED'];
             return order.indexOf(a.appointmentStatus) - order.indexOf(b.appointmentStatus)*/

            //don't sort
            return null;

        }

        const listUpcomimg = this.props.bookings.filter(item=>item.type== 'upcoming').sort(sortByStatus)
        const listPrevious = this.props.bookings.filter(item=>item.type== 'previous').sort(sortByStatus)
        let groupBookingById = this.props.bookings.reduce((r, a) => {
            if(typeof a.agentData._id != 'undefined' ){
                r[a._id] = [...r[a._id] || [], a];
            }

            return r;
        }, {});


        console.log({groupBookingById});
        const Booking = (booking)=> {


            try{

                let {titleOrDescription,agentName,eventType,appointmentAddress,agentPrice,appointmentStatus,appointmentEndTime,appointmentDate,appointmentStartTime,isModified} = booking
                let fullName = agentName.firstName + ' ' + agentName.lastName;

                let sizeName = getSizeClient(sizeClient)
                let needReadMore = false
                appointmentStatus = appointmentStatus == 'WAITING_ADMIN_ASSIGN' ? 'PENDING' : appointmentStatus

                if(titleOrDescription){
                    needReadMore = ((sizeName == 'xl') && (titleOrDescription.length > 100))
                        || ((sizeName == 'lg') && (titleOrDescription.length > 87))
                        || ((sizeName == 'md') && (titleOrDescription.length > 138))
                        || ((sizeName == 'sm') && (titleOrDescription.length > 80))
                        || ((sizeName == 'xs') && (titleOrDescription.length > 80))
                }

                if(sizeName == 'lg'){
                    if(sizeClient > 1300 && sizeClient < 1440 && titleOrDescription.length < 100){
                        needReadMore = false
                    }else if( sizeClient >1440 && sizeClient < 1600 && titleOrDescription.length < 110 ){
                        needReadMore = false
                    }
                }



                let Status = ()=>{
                    let tmp_status = 'processing'
                    switch (appointmentStatus){
                        case STATUS['PENDING']:
                            tmp_status = 'processing'
                            break;
                        case STATUS['ACTIVE']:
                            tmp_status = 'error'
                            break;
                        case STATUS['CANCELLED']:
                            tmp_status = 'default'
                            break;
                        case STATUS['EXPIRED']:
                            tmp_status = 'error'
                            break;
                        case STATUS['CHANGE_REJECTED']:
                            tmp_status = 'error'
                            break;
                        case STATUS['REJECTED']:
                            tmp_status = 'error'
                            break;
                        case STATUS['COMPLETED']:
                            tmp_status = 'default'
                            break;
                        case STATUS['ACCEPTED']:
                            tmp_status = 'success'
                            break;
                    }
                    return <Badge className={style.status_icon} status={tmp_status} />

                }


                let url = `/bookings/${booking._id + '_' + booking.agentData._id}`


                return (
                    <Col {...wrapperCol} key={booking.uuid}>
                        <Card className={classnames(style.item,'wrap-card')} onClick={(e)=>{e.preventDefault(); this.goTo(url) }}>
                            <div className={style.status}>{(isModified && appointmentStatus == STATUS['PENDING']) ? 'CHANGE PENDING' :appointmentStatus.replace('_',' ')} <Status /></div>


                            <h2  className={classnames(style.title,'wrap_title',needReadMore ? 'is-long-text' : '')}><div dangerouslySetInnerHTML={{__html: titleOrDescription}}></div></h2>
                            <Link style={{display: 'inline-block', marginTop: 20, color: '#000000'}} to={url}
                                  className={style.item_btn}>View Details</Link>
                            <div className={style.address}>at {appointmentAddress}</div>
                            <div className={style.agent_name}>With {getPhotogapherName(fullName)}</div>

                            <div
                                className={style.time}>{appointmentStartTime + ((appointmentEndTime != '') ? ' - ' + appointmentEndTime : '')}</div>
                            <div className={style.date}>On {moment.parseZone(appointmentDate).format('MMMM Do YYYY')}</div>

                        </Card>
                    </Col>
                )
            }catch (e) {
                console.log({e});
            }



        }
        const upcomingData = listUpcomimg.map(Booking)
        const previousData = listPrevious.map(Booking)

        let TYPE_FILTERS = ['upcoming','previous']

        if(this.props.active_type == 'previous') TYPE_FILTERS = TYPE_FILTERS.reverse()

        let styleLabel = {
            background: '#ececeb',
            padding: '3px 20px',
            margin: '20px 0',
            display: 'inline-block',
            color: 'black',
            borderLeft: '5px solid #f77800'
        }
        return (

            <Row style={{marginTop:50}}>
                <Col {...wrapperCol}>
                    <Card  className={classnames(style.first_item,'firstitem')}>
                        <h2> <Link  className={style.new_project_text} to={'/book'}>New PhotoSesh</Link></h2>
                        <Link  className={style.icon_wrapper} to={'/book'}><Icon type="plus" /></Link>
                        <Link to={'/book'} className={style.item_btn}>E-Z BOOK</Link>
                        <Link to={'/advanced'} className={style.item_btn}>Advanced</Link>
                    </Card>
                </Col>


                {(this.props.loading) ? ( <div className ={style.overlay}> <Spin className={style.spin_loading} /></div>):'' }

                {TYPE_FILTERS.map(type=>
                    {
                        return  (
                            <Row key={type}>
                                <h3><span className={type+'-span'} style={styleLabel}>{type.toUpperCase()}</span></h3>

                                {(eval(type+'Data').length > 0 ) && eval(type+'Data')}
                                {(eval(type+'Data').length == 0 ) && (
                                    <div style={{fontSize:20,color:'#2f2f2f'}}>
                                        No {type} bookings found.
                                    </div>
                                )}

                            </Row>
                        )
                    }
                )}

            </Row>

        )
    }

}

const mapStateToProps = (state)=>{

    let active_status = state.projects.active_status
    return {
        active_type : state.projects.active_type,
        bookings :  (active_status == STATUS['ALL']) ? state.projects.bookings : state.projects.bookings.filter(booking=> booking.appointmentStatus == active_status )
    }
}



export default connect(mapStateToProps,{})(Grid)

