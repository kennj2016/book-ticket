import React, {Component} from 'react'
import {Row, Col, Card, Layout, Button, Carousel} from 'antd';
import {connect} from 'react-redux'
import {Route, Link} from 'react-router-dom'
import {cleanSlug} from '../../utils/helper'
import {ProcessStep} from './ProcessStep'
const {Header} = Layout
class DetailPhotoseshLight extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="container">

                    <div style={{margin: '30px 0'}}>
                        <ProcessStep current={1} {...this.props} />
                    </div>

                    <h2 className="head-title-center">{cleanSlug(this.props.type_detail.photoSeshTypeName)}</h2>
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12} style={{padding:10}}>
                            <Carousel autoplay={true}>
                                <div><img style={{maxWidth: '100%'}} src="/images/6.jpg" alt=""/></div>
                                <div><img style={{maxWidth: '100%'}} src="/images/7.jpg" alt=""/></div>
                                <div><img style={{maxWidth: '100%'}} src="/images/8.jpg" alt=""/></div>
                            </Carousel>
                        </Col>

                        <Col xs={12} sm={12} md={12} lg={12} xl={12}  style={{padding:10}}>
                            <Card bodyStyle={{padding: 15,height: 481}}>
                                <h2
                                    className="title"
                                    style={{fontSize:30,lineHeight: '60px',fontWeight: 100,textAlign:'center'}}>{cleanSlug(this.props.type_detail.photoSeshTypeName)}</h2>
                                <div style={{fontSize:14}}>
                                    <div style={{    marginBottom: 15,color: '#e94410',textAlign:'center'}}>${this.props.type_detail.photoSeshTypePriceLB} -
                                        ${this.props.type_detail.photoSeshTypePriceUB} / hr
                                    </div>
                                    {this.props.type_detail.photoSeshTypeOnClickDescription}
                                </div>
                                <h2
                                className="title"
                                style={{
                                    fontSize: 20,
                                    textAlign: 'center',
                                    margin: '20px 0',
                                    color: '#4b4b4b',
                                    fontWeight: 100
                                }}

                                >Less cost, not a moment lost!</h2>

                                <Button type="primary" className="btn-submit" ><Link  to={'/book/need-a-photosesh'}> NEXT </Link></Button>


                            </Card>

                        </Col>
                    </Row>

                </div>

            </div>
        )
    }

}
const mapStateToProps = (state)=> {
    return {
        type_detail: state.auth.user.photoseshTypeList.filter(type=> type.photoSeshTypeName == state.bookinfo.info.photosesh_type_name).shift()
    }
}
export default connect(mapStateToProps, {})(DetailPhotoseshLight)