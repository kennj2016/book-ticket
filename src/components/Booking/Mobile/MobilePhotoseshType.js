import React, {Component} from 'react'
import {Row, Col, Card, Layout, Button} from 'antd';
import {connect} from 'react-redux'
import {Redirect, Link} from 'react-router-dom'
import style from './mobile_photosesh_type.css'
import {setDataBooking,setCurrentStep} from '../../../actions/bookActions'
import {cleanSlug} from  '../../../utils/helper'
import {PhotoseshTypeList} from  '../../../define'
import {NavigateMobile} from './../ProcessStep'
import classnames from "classnames";
const {Header} = Layout
class PhotoseshType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: '',
            photoseshType: []
        };

    }

    goTo(route) {
        this.props.history.replace(route)
    }

    handleNext(photosesh_type_name) {
        let new_book_data = {...this.props.bookinfo}
        new_book_data.info.photosesh_type_name = photosesh_type_name
        this.props.setDataBooking(new_book_data)
        this.goTo('/book/need-a-photosesh')
    }

    componentWillMount(){
        console.log(111);
        this.props.setCurrentStep(1)
    }
    render() {


        let ListPhotoseshType = []


        if(this.props.isAuthenticated){
            if(this.props.photoseshTypeList[0]['photoSeshTypeName'] != 'PhotoSesh'){

                /*
                 *
                 * swap photosesh type
                 *
                 * */

                this.props.photoseshTypeList.reverse()
            }

            console.log(this.props.photoseshTypeList);

            ListPhotoseshType = this.props.photoseshTypeList.map((phototype, i)=> {




                const img = "/images/" + ((phototype.photoSeshTypeName == 'PhotoSesh') ? '7pro-photographers.jpg' :'photosesh-light.jpg' );

                let photoSeshTypeName = cleanSlug(phototype.photoSeshTypeName).replace('photosesh','PhotoSesh')

                return (
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} key={i}  style={{paddingTop:20}}>
                        <NavigateMobile {...this.props} />
                        <Card

                            className={classnames(this.props.bookinfo.info.photosesh_type_name == phototype.photoSeshTypeName ?'active':'')}

                            onClick={()=>this.handleNext(phototype.photoSeshTypeName)} style={{cursor:'pointer'}}>
                            <div className={style['custom-image']}>
                                <img src={img} alt=""/>
                            </div>
                            <div className={style['custom-card']}>
                                <h2 className="title">{photoSeshTypeName.replace('light','LIGHT')}</h2>
                                <div>
                                    <div className={style.price}>${phototype.photoSeshTypePriceLB} - ${phototype.photoSeshTypePriceUB} / hr</div>
                                    {phototype.photoSeshTypeOnClickDescription}
                                </div>
                            </div>

                            <div style={{
                                fontSize: 20,
                                color: "#ee7300",
                                textAlign:'center',
                                margin: '20px 0'
                            }}>
                                {(phototype.photoSeshTypeName.toLowerCase().indexOf('light') != '-1') ? '"Peer-to-Peer iPhone Shots"' : '"Freelance Pro Photographers"'}
                            </div>

                        </Card>
                    </Col>
                )

            })
        }else{
            ListPhotoseshType = PhotoseshTypeList.map((phototype, i)=> {




                const img = "/images/" + ((phototype.photoSeshTypeName == 'PhotoSesh') ? '7pro-photographers.jpg' :'photosesh-light.jpg' );

                let photoSeshTypeName = cleanSlug(phototype.photoSeshTypeName).replace('photosesh','PhotoSesh')

                return (
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} key={i}  style={{paddingTop:0}}>
                        <NavigateMobile {...this.props} />
                        <Card

                            className={classnames(this.props.bookinfo.info.photosesh_type_name == phototype.photoSeshTypeName ?'active':'')}
                            onClick={()=>this.handleNext(phototype.photoSeshTypeName)} style={{cursor:'pointer'}}>
                            <div className={style['custom-image']}>
                                <img src={img} alt=""/>
                            </div>
                            <div className={style['custom-card']}>
                                <h2 className="title">{photoSeshTypeName.replace('light','LIGHT')}</h2>
                                <div>
                                    <div className={style.price}>${phototype.photoSeshTypePriceLB} - ${phototype.photoSeshTypePriceUB} / hr</div>
                                    {phototype.photoSeshTypeOnClickDescription}
                                </div>
                            </div>

                            <div style={{
                                fontSize: 20,
                                color: "#ee7300",
                                textAlign:'center',
                                margin: '20px 0'
                            }}>
                                {(phototype.photoSeshTypeName.toLowerCase().indexOf('light') != '-1') ? '"Peer-to-Peer iPhone Shots"' : '"Freelance Pro Photographers"'}
                            </div>

                        </Card>
                    </Col>
                )

            })
        }




        return (
            <div className={style['photosesh-type']} id="photosesh-type">
                <div className={style['container']}>

                    <h2 style={{
                        fontSize: 25,
                        fontWeight: 100,
                        textAlign: 'center',
                        margin: '20px 0 20px 0'
                    }}>PhotoSesh or PhotoSesh LIGHT</h2>
                    <Row gutter={100}>
                        {ListPhotoseshType}
                    </Row>
                </div>
            </div>
        )
    }

}

const mapStateToProps = (state)=> {

    return {

        bookinfo: state.bookinfo,
        isAuthenticated:state.auth.isAuthenticated,
        photoseshTypeList: state.auth.user.photoseshTypeList
    }

}

export default connect(mapStateToProps, {setDataBooking,setCurrentStep})(PhotoseshType)