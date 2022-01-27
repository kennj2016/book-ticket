/* global google */

import React, {Component} from 'react'
import {Col, Icon, Row, Tabs} from 'antd';
import {Link} from 'react-router-dom'

import {connect} from 'react-redux'
import classnames from 'classnames'
import style from './view_agent_profile.css'
import ImageGallery from "react-image-gallery";
import {getAgentProfile} from '../../actions/bookActions'
import Lightbox  from 'react-images'
const {TabPane} = Tabs;

class ViewAgentProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            photographer: {},
            lightboxIsOpen: false,
            currentImage: 0,
            mapVisible: false,
            portfolios: []
        }
    }

    goTo(route) {
        this.props.history.replace(route)
    }


    componentWillMount() {
        if (typeof this.props.booking == 'undefined') {
            this.props.history.replace('/bookings')
        }
    }




    componentDidMount() {

        let handleTransformData = (photographer)=>{

            let portfolios = []
            photographer.agentEvents.forEach(item => {
                auth.user.eventList.forEach(event => {
                    if (item.toUpperCase() === event.eventName.toUpperCase()) {
                        event.count = 0;
                        event.images = [];
                        portfolios.push(event);
                    }
                })
            });
            if (typeof photographer.portfolioURLs != 'undefined' && photographer.portfolioURLs.urls.length) {
                portfolios = portfolios.map(event => {
                    photographer.portfolioURLs.urls.forEach(portfolio => {
                        if (portfolio.eventId === event._id) {
                            event.count++;
                            event.images.push(portfolio);
                        }
                    });
                    return event;
                });
            }

            return portfolios;

        }

        let {photographer, auth} = this.props;
        let portfolios = [];
        if (auth.user.eventList && Object.keys(photographer).length) {

            portfolios = handleTransformData(photographer)
            this.setState({portfolios});
        }else{
            let agent_id = this.props.match.params.booking_slug.split('_').pop();
            getAgentProfile(agent_id).then(res=>{
                let photographer = res.data.data
                portfolios = handleTransformData(photographer)
                this.setState({portfolios});

            })
        }

    }

    componentWillReceiveProps(props) {

        let photographer = props.booking.agentData
        if (Object.keys(photographer).length > 0) {
            this.setState({photographer: props.booking.agentData})
        }

    }

    gotoPrevLightboxImage = () => {

        let total_images = this.props.booking.agentData.portfolio.urls.length

        let {currentImage} = this.state,
            prev = (currentImage != 0) ? currentImage - 1 : total_images - 1;
        this.setState({currentImage: prev})

    }
    gotoNextLightboxImage = () => {
        let total_images = this.props.booking.agentData.portfolio.urls.length,
            {currentImage} = this.state,
            next = (currentImage == total_images - 1) ? 0 : currentImage + 1;
        this.setState({currentImage: next})

    }

    render() {
        console.log(this.state.portfolios);
        if (typeof this.props.booking != 'undefined') {

            let photographer = this.props.booking.agentData,
                images = [],
                savesYou = (photographer.agentPrice / photographer.agentSaves) * 100 + '%';

            let hasPhotographer = (Object.keys(photographer).length > 0);


            if (hasPhotographer && typeof photographer.portfolio.urls != 'undefined' && photographer.portfolio.urls.length > 0) {
                images = photographer.portfolio.urls.map(photo => {
                    return {src: photo.portfolioOriginal, thumbnail: photo.portfolioThumb}
                })
            }


            return (
                <div className={style.wrapper} id="single-agent">
                    {hasPhotographer && (
                        <div>
                            <div style={{textAlign: 'left'}}>
                                <Link className={style.back_btn} to={this.props.match.url}> <Icon type="left"/> Back To Booking</Link>
                            </div>

                            <Row>
                                <Col xs={{span: 24, offset: 0}}
                                     sm={{span: 6, offset: 3}}
                                     md={{span: 6, offset: 3}}
                                     lg={{span: 6, offset: 3}}
                                     xl={{span: 6, offset: 3}}>
                                    <div className={classnames(style.agent_left)}>
                                        <img src={photographer.profilePicURL.thumb} alt=""/>
                                    </div>

                                </Col>
                                <Col xs={{span: 24, offset: 0}}
                                     sm={{span: 8, offset: 0}}
                                     md={{span: 10, offset: 0}}
                                     lg={{span: 10, offset: 0}}
                                     xl={{span: 10, offset: 0}}>
                                    <h2 className={style.name}>{photographer.name.firstName}</h2>
                                    <div className={style.info}>
                                        <p><strong><Icon type="environment-o"/> Base Location : </strong> {photographer.address}</p>

                                        <p><strong><Icon type="camera-o"/> Equipment & Bio :</strong> {photographer.equipmentAndBio}</p>

                                        <p><strong><Icon type="share-alt"/> FunFact : </strong> {photographer.funFact}</p>
                                        <p><strong><Icon type="clock-circle-o"/> Minimum Session : </strong> {photographer.minimumSession}</p>
                                        <p><strong><Icon type="tags-o"/> Saves You : </strong> {savesYou}</p>


                                        <p className={style.price}>Hourly Rate : ${photographer.agentPrice}/hr</p>

                                    </div>
                                </Col>
                            </Row>


                            {(images.length > 0) && (
                                <Row>
                                    <Col xs={{span: 24, offset: 0}}
                                         sm={{span: 16, offset: 3}}>
                                        <h2 style={{margin: "20px 0"}} className={style.title_portfolio}>Portfolios</h2>

                                        <Row>

                                            { this.props.isViewOldJob && (
                                                <div>
                                                    <Lightbox
                                                        data={{}}
                                                        images={images}
                                                        isOpen={this.state.lightboxIsOpen}
                                                        onClose={() => {
                                                            this.setState({lightboxIsOpen: false})
                                                        }}
                                                        onClickPrev={this.gotoPrevLightboxImage}
                                                        onClickNext={this.gotoNextLightboxImage}
                                                        preloadNextImage={true}
                                                        currentImage={this.state.currentImage}
                                                        showThumbnails={true}
                                                        onClickThumbnail={(index) => {
                                                            this.setState({currentImage: index})
                                                        }}
                                                    />

                                                    {photographer.portfolio.urls.map((photo, i) => (
                                                        <Col key={i} xs={{span: 24, offset: 0}}
                                                             sm={{span: 6, offset: 0}}>
                                                            <div className={style.item}>
                                                                <img onClick={() => {
                                                                    this.setState({lightboxIsOpen: true, currentImage: i})
                                                                }} src={photo.portfolioThumb} alt=""/>
                                                            </div>
                                                        </Col>
                                                    ))}
                                                </div>
                                            )}

                                            {this.state.portfolios.length && typeof this.props.isViewOldJob == 'undefined' && (
                                                <Tabs defaultActiveKey="1">
                                                    {this.state.portfolios.map((item, index) => (
                                                        <TabPane disabled={!item.images.length ? true : false} tab={`${item.eventName}`} key={index + 1}>
                                                            <ImageGallery items={item.images.map(i => ({
                                                                original: i.portfolioOriginal,
                                                                thumbnail: i.portfolioThumb
                                                            }))}/>
                                                        </TabPane>
                                                    ))}
                                                </Tabs>
                                            )}

                                        </Row>

                                    </Col>

                                </Row>
                            )}

                        </div>

                    )}

                </div>
            )
        }

        return null


    }
}

const mapStateToProps = (state, props) => {
    let agent_id = props.match.params.booking_slug.split('_').pop();
    return {
        photographer: (state.bookinfo.photographers.filter(agent => agent._id == agent_id).length == 0) ? {} : state.bookinfo.photographers.filter(agent => agent._id == agent_id)[0],
        auth: state.auth

    }
}

export default connect(mapStateToProps, {})(ViewAgentProfile)
