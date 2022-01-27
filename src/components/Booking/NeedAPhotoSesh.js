
import style from './need_photosesh.css'
import React,{Component} from 'react'
import classnames from 'classnames'
import {Row, Col,Card,Layout,Button,Icon,Modal} from 'antd';
import {connect} from 'react-redux'
import {Route,Link} from 'react-router-dom'
import {cleanSlugTitleEvent,setStorage,updateUrlHttpsForImage} from  '../../utils/helper'
import {EventList} from  '../../define'
import {setDataBooking,setCurrentStep,setPhotographers,getEventsList} from '../../actions/bookActions'
import {ProcessStep} from  './ProcessStep'
import jQuery from 'jquery'
import {isMobile} from 'react-device-detect'
const {Header} = Layout;

class NeedPhotosesh extends Component{
    constructor(props) {
        super(props);
        this.state = {
            eventList: [],
            loading:true
        }
    }

    componentWillMount(){

        this.props.setPhotographers([])
        this.props.setCurrentStep(2)

        getEventsList().then(res=>{

            let dataRes = res.data

            if(typeof dataRes != 'undefined'){
                this.setState({
                    eventList : dataRes.eventList,
                    loading:false
                })

            }





        }).catch(err=>{
            this.setState({
                loading:false
            })
            console.log(err);
        })

    }

    handleNext (photosesh_event_type) {


       // photosesh_event_type = photosesh_event_type.replace(/[\s]/g, '_').toUpperCase()

        if(!this.props.isAuthenticated){


            let new_book_data = {...this.props.bookinfo}
            new_book_data.info.photosesh_event_type = photosesh_event_type
            this.props.setDataBooking(new_book_data)

            Modal.confirm({
                iconType:"login",
                title: 'PhotoSesh Notification',
                okText:'Ok',
                cancelText	:'Cancel',
                centered:true,
                onOk:()=>{
                    setStorage('loginBackUrl',this.props.location.pathname)
                    console.log();
                    this.props.history.replace('/login'); Modal.destroyAll();
                },
                content: (<div>
                    Please login or create a FREE account to enjoy access to all the PhotoSesh photographers with upfront pricing, bios, and portfolios.
                </div>),
            });

        }else{
            this.props.history.replace('/book/photographers')
            let new_book_data = {...this.props.bookinfo}
            new_book_data.info.photosesh_event_type = photosesh_event_type
            this.props.setDataBooking(new_book_data)
        }

    }
    render() {

        let {eventList,loading} = this.state


        return (
            <div className={classnames(style.need_photosesh,'need_photosesh')}>

                <div className={style.container}>
                    <div style={{margin: '30px 0',padding:5}} className={classnames(!isMobile ? 'sticky':'')}>
                        <ProcessStep current={2} {...this.props} />
                    </div>
                    <h2 className="head-title-center">I Need a PhotoSesh For ...</h2>


                    <Row>
                        {eventList.map((event, i) => {
                            const img = "/images/"+ ++i +".jpg";
                            return (
                                <Col xs={24} sm={12} md={12} lg={12} xl={12} key={i} className={style.item}>
                                    <a onClick={()=>this.handleNext(event.eventName)}>
                                        <Card
                                            className={classnames(this.props.bookinfo.info.photosesh_event_type == event.eventName ?'active':'')}
                                            bodyStyle={{padding: 0}}>
                                            <div className={style.custom_image}>
                                                <img src={updateUrlHttpsForImage(event.eventImage.original)} alt=""/>
                                            </div>
                                            <div className={style.custom_card}>
                                                <h2 className="title">{cleanSlugTitleEvent(event.eventName)}</h2>
                                                <p>
                                                    {event.eventDescription}
                                                </p>
                                            </div>

                                        </Card>
                                    </a>

                                </Col>
                            )
                        })}
                    </Row>
                </div>

            </div>
        )
    }

}


const mapStateToProps = (state)=>{

    return {
        bookinfo:state.bookinfo,
        eventList:state.auth.user.eventList,
        isAuthenticated:state.auth.isAuthenticated,
    }

}

export default connect(mapStateToProps,{setDataBooking,setCurrentStep,setPhotographers})(NeedPhotosesh)