/* global google */

import React, { Component } from "react";
import { Button, Col, Icon, Modal, Row, Tabs, Carousel } from "antd";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { connect } from "react-redux";
import {
  setDataBooking,
  setPhotographerForRequest,
} from "../../../actions/bookActions";
import classnames from "classnames";
import style from "./single_photographer.scss";
import { BlackHeart, RedHeart } from "./ListPhotographers";
import {
  getPhotogapherName,
  updateUrlHttpsForImage,
} from "../../../utils/helper";
import { isMobile } from "react-device-detect";
import ImageCarouselWithoutHandle from './ImageCarousel/ImageCarouselWithoutHandle'
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import LazyImage from "../../common/Include/LazyImage";
const { TabPane } = Tabs;

const { compose, withProps, lifecycle } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer,
} = require("react-google-maps");

class SinglePhotographer extends Component {
  constructor(props) {
    super(props);

    this.state = {

        currentSlider : 0,

     currentCategory: 0,
      photographer: {},
      lightboxIsOpen: false,
      imagePreview: "",
      visiblePreview: false,
      currentImage: 0,
      mapVisible: false,
      portfolios: [],
      portfolios_not_in_event: [],
      dimensionsCover:{
        height:0,
        width:0
      }
    };
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.carousel = React.createRef();
    this.carousel2 = React.createRef();
  }
   onImgLoadCover = (e) => {
    this.setState({
     dimensionsCover:{
      height: e.target.offsetHeight,
      width: e.target.offsetWidth,
     }
    });
  };


  next() {


    this.carousel.next();



  }

  previous() {
    this.carousel.prev();

   
  }

  componentDidMount() {
    let { photographer, auth } = this.props;
    console.log("111", this.props);
    let portfolios = [{
        eventName:'All',
        count:0,
        images:[]
    }];
    let portfolios_not_in_event = [];

    console.log (auth.user.eventList);

    if (auth.user.eventList) {
      photographer.agentEvents.forEach((item) => {
        auth.user.eventList.forEach((event) => {
          if (item.toUpperCase() === event.eventName.toUpperCase()) {
            event.count = 0;
            event.images = [];
            portfolios.push(event);
          }
        });
      });





      if (photographer.portfolioURLs.urls.length) {
        portfolios = portfolios
          .map((event) => {
            photographer.portfolioURLs.urls.forEach((portfolio) => {

                if(typeof portfolio.thumb == 'undefined'){

                    portfolio.thumb = portfolio.portfolioThumb
                    portfolio.original = portfolio.portfolioOriginal
                }

                if(event.eventName == 'All'){
                    event.count++;
                    event.images.push(portfolio);
                 } 
  

                if (typeof portfolio.eventId != "undefined") {
                    if (portfolio.eventId === event._id) {
                    event.count++;
                    event.images.push(portfolio);
                    }
                }

              
            });
            return event;
          })
          .reduce((acc, element) => {
            if (
              element.eventName.toLowerCase() ===
              this.props.bookinfo.info.photosesh_event_type.toLowerCase()
            ) {
              return [element, ...acc];
            }
            return [...acc, element];
          }, []);

        console.log({
          "photographer.portfolioURLs.urls": photographer.portfolioURLs.urls,
        });
      }
    }

    portfolios = portfolios.filter((item) => item.images.length);

    console.log({ portfolios });

    setTimeout(()=>{    this.setState({ portfolios });},500)
  }

  setMapVisible(mapVisible) {
    this.setState({ mapVisible });
  }

  goTo(route) {
    this.props.history.replace(route);
  }

  handleBookAgent = (id) => {
    this.props.setPhotographerForRequest(id);
    setTimeout(() => this.goTo("/book/photographers"), 1000);
  };

  componentWillMount() {
    if (Object.keys(this.props.photographer).length == 0) {
      this.props.history.replace("/book/photographers");
    }
  }

  componentWillReceiveProps(props) {
    let { photographer } = props;
    if (Object.keys(photographer).length > 0) {
      this.setState({ photographer: props.photographer });
    }
  }

  gotoPrevLightboxImage = () => {
    let total_images = this.props.photographer.portfolioURLs.urls.length;

    let { currentImage } = this.state,
      prev = currentImage != 0 ? currentImage - 1 : total_images - 1;
    this.setState({ currentImage: prev });
  };
  gotoNextLightboxImage = () => {
    let total_images = this.props.photographer.portfolioURLs.urls.length,
      { currentImage } = this.state,
      next = currentImage == total_images - 1 ? 0 : currentImage + 1;
    this.setState({ currentImage: next });
  };

  render() {
    let { photographer } = this.props,
      images = [],
      savesYou = photographer.agentSaves + "%",
      [agent_long, agent_lat] =
        typeof photographer.location != "undefined"
          ? photographer.location.coordinates
          : [],
      booking_lat = this.props.bookinfo.info.position.lat,
      booking_lng = this.props.bookinfo.info.position.lng;

    console.log(this.state.portfolios);
    let hasPhotographer = Object.keys(photographer).length > 0;

    const MapWithADirectionsRenderer = compose(
      withProps({
        googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${process.env.GG_MAP_APIKEY}&v=3.exp&libraries=geometry,drawing,places`,
        loadingElement: <div style={{ height: `100%` }} />,
        mapElement: <div style={{ height: `100%` }} />,
      }),
      withScriptjs,
      withGoogleMap,
      lifecycle({
        componentDidMount() {
          const DirectionsService = new google.maps.DirectionsService();

          DirectionsService.route(
            {
              origin: new google.maps.LatLng(agent_lat, agent_long),
              destination: new google.maps.LatLng(booking_lat, booking_lng),
              travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === google.maps.DirectionsStatus.OK) {
                this.setState({
                  directions: result,
                });
              } else {
                console.error(`error fetching directions ${result}`);
              }
            }
          );
        },
      })
    )((props) => (
      <GoogleMap
        defaultZoom={7}
        defaultCenter={new google.maps.LatLng(booking_lat, booking_lng)}
      >
        {props.directions && (
          <DirectionsRenderer directions={props.directions} />
        )}
      </GoogleMap>
    ));

    if (
      hasPhotographer &&
      typeof photographer.portfolioURLs != "undefined" &&
      photographer.portfolioURLs.urls.length > 0
    ) {
      images = photographer.portfolioURLs.urls.map((photo) => {
        return {
          original: updateUrlHttpsForImage(photo.portfolioOriginal),
          thumbnail: updateUrlHttpsForImage(photo.portfolioThumb),
        };
      });
    }

    console.log({ images });

    return (
      <div className={style.wrapper} id="single-agent">
        {hasPhotographer && (
          <div>
            <div style={{ textAlign: "left", display: isMobile ? "none" : "" }}>
              <Link className={style.back_btn} to={"/book/photographers"}>
                {" "}
                <Icon type="left" /> Back To Booking
              </Link>
            </div>

            <h2
              className="head-title"
              style={{
                textAlign: "center",
                fontSize: 35,
                marginTop: isMobile ? 50 : 0,
              }}
            >
              Photographer Profile
            </h2>

            <Row>
              <Col
                xs={{ span: 24, offset: 0 }}
                sm={{ span: 6, offset: 3 }}
                md={{ span: 6, offset: 3 }}
                lg={{ span: 6, offset: 3 }}
                xl={{ span: 6, offset: 3 }}
              >
                <div className={classnames(style.agent_left)}>
                  <img
                    src={updateUrlHttpsForImage(
                      photographer.profilePicURL.thumb
                    )}
                    alt=""
                  />

                  <span className="wrap-heart">
                    {this.props.bookinfo.info.photographers_request.indexOf(
                      photographer._id
                    ) != -1 ? (
                      <Icon
                        onClick={(e) => {
                          e.preventDefault();
                          this.handleBookAgent(photographer._id);
                        }}
                        component={RedHeart}
                      />
                    ) : (
                      <Icon
                        component={BlackHeart}
                        onClick={(e) => {
                          e.preventDefault();
                          this.handleBookAgent(photographer._id);
                        }}
                      />
                    )}
                  </span>
                </div>
              </Col>
              <Col
                xs={{ span: 24, offset: 0 }}
                sm={{ span: 8, offset: 0 }}
                md={{ span: 10, offset: 0 }}
                lg={{ span: 10, offset: 0 }}
                xl={{ span: 10, offset: 0 }}
              >
                <h2 className={style.name}>
                  {getPhotogapherName(photographer.name)}
                </h2>
                <div className={style.info}>
                  <p>
                    <strong>
                      <Icon type="environment-o" /> Base Location :
                    </strong>{" "}
                    {photographer.address}
                  </p>

                  <p>
                    <strong>
                      <Icon type="camera-o" /> Equipment & Bio :
                    </strong>{" "}
                    {photographer.equipmentAndBio}
                  </p>

                  <p>
                    <strong>
                      <Icon type="share-alt" /> FunFact :{" "}
                    </strong>{" "}
                    {photographer.funFact}
                  </p>
                  <p>
                    <strong>
                      <Icon type="clock-circle-o" /> Minimum Session :
                    </strong>{" "}
                    {photographer.minimumSession}
                  </p>
                  <p>
                    <strong>
                      <Icon type="tags-o" /> Saves You :{" "}
                    </strong>{" "}
                    {savesYou}
                  </p>
                  <p>
                    <strong>
                      <Icon type="environment-o" />{" "}
                    </strong>{" "}
                    {photographer.liveDistance} miles away
                  </p>

                  <p className={style.price}>
                    Hourly Rate : ${photographer.agentPrice}/hr
                  </p>

                  <div
                    className={style.wrap_map}
                    onClick={(e) => {
                      this.setMapVisible(true);
                    }}
                  >
                    <MapWithADirectionsRenderer
                      containerElement={<div style={{ height: `200px` }} />}
                    />
                  </div>

                  <Modal
                    width={960}
                    title="Distance between Photographer and You"
                    style={{ top: 20 }}
                    visible={this.state.mapVisible}
                    footer={null}
                    onCancel={() => this.setMapVisible(false)}
                  >
                    <MapWithADirectionsRenderer
                      containerElement={<div style={{ height: `500px` }} />}
                    />
                  </Modal>
                </div>

                <div>
                  {this.props.bookinfo.info.photographers_request.indexOf(
                    photographer._id
                  ) != -1 ? (
                    <Link className={style.back_btn} to={"/book/photographers"}>
                      {" "}
                      <Icon type="left" />
                      Back To Booking
                    </Link>
                  ) : (
                    <Button
                      className={style.book_btn}
                      onClick={(e) => {
                        e.preventDefault();
                        this.handleBookAgent(photographer._id);
                      }}
                      type={"primary"}
                    >
                      {" "}
                      Like This Photographer
                    </Button>
                  )}
                </div>
              </Col>
            </Row>

{/* show portfolio with category tab */}
            {this.state.portfolios.length > 0 && (
              <div>

                <h2>Portfolio</h2> 

                <div className={"list-masonry"}>
                  <div className="hero-bg">
                    <div className="inner">


                 

                      <img 
                      
                      style={{
                        opacity: 0,
                        visibility: "visible",
                        position: "absolute",
                        zIndex: "-10",
                        top: "-10000px",
                      }}
                      
                      onLoad={this.onImgLoadCover} src={this.state.portfolios[this.state.currentCategory].images[0].original} alt="" />
                      <img 
                        style={{
                          height:
                            this.state.dimensionsCover.height >= this.state.dimensionsCover.width
                              ? `600px`
                              : "auto"
        
    
                        }}
                      
                      src={this.state.portfolios[this.state.currentCategory].images[0].original} alt="" />
                    </div>
                  </div>

                  <section
                    style={{
                      background: "#212025",
                      padding: "30px 20px 25px 20px",
                    }}
                  >
                    <div className="wrap-menu">
                      {
                        <div className={"menu"}>
                          {this.state.portfolios.map((item, index) => {
                            if (item.images.length) {
                              return (
                                <span
                                  key={"aCategory" + item._id}
                                  className={
                                    index == this.state.currentCategory
                                      ? "active"
                                      : ""
                                  }
                                  onClick={(e) => {
                                    this.setState({ currentCategory: index });
                                  }}
                                >
                                  {item.eventName
                                    .replace(/[_]/g, " ")
                                    .toUpperCase()}
                                </span>
                              );
                            }
                          })}
                        </div>
                      }
                    </div>
                  </section>

                  <ResponsiveMasonry
                    columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
                  >
                    <Masonry>
                      {this.state.portfolios[this.state.currentCategory].images.length > 0 &&
                        this.state.portfolios[this.state.currentCategory].images.map((image, i) => {



                    

                          image.original = updateUrlHttpsForImage(image.original)

                          return (
                            <div
                              key={"list-image" + image.original}
                              className={"box-img pad5"}
                            >
                              <img
                                src={image.original}
                                alt=""
                                onClick={() => {
                                  this.setState({
                                    imagePreview: image.original,
                                    visiblePreview: true,
                                  });
                                }}
                              />
                            </div>
                          );
                        })}
                    </Masonry>
                  </ResponsiveMasonry>

                  <Modal
                    style={{ maxWidth: 1300 }}
                    footer={null}
                    header={null}
                    width={1000}
                    wrapClassName={"wrap-modal-preview-single-ph"}
                    title=""
                    centered
                    visible={this.state.visiblePreview}
                    onOk={() => this.setState({ visiblePreview: false })}
                    onCancel={() => this.setState({ visiblePreview: false })}
                  >
                    {this.state.visiblePreview && (
                      <div>
                            <ImageCarouselWithoutHandle 
                            
              
                            
                            handleClosePopup={()=>{

                              this.setState({ visiblePreview: false })
                            }}
                            images={this.state.portfolios[this.state.currentCategory].images.map(

                              (image, i) => {

                                image.original = updateUrlHttpsForImage(image.original)
                              
                                return image
                              }
      

                            ).reduce((acc, element) => {
                              // chose the image on click and put it to the first item in array carousel
                              if (element.original === this.state.imagePreview) {
                                  return [element, ...acc];
                              }
                              return [...acc, element];
                          }, [])}/>
                 
                      </div>
                    )}
                  </Modal>
                </div>
              </div>
            )}
{/* end show portfolio with category tab */}




         

            <div className="navigate-mobile">
              <span
                style={{ float: "right", width: "100%", cursor: "pointer" }}
                onClick={() => this.goTo("/book/photographers")}
              >
                Back to Booking
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  let agent_id = props.match.params.agent_id;
  return {
    photographer:
      state.bookinfo.photographers.filter((agent) => agent._id == agent_id)
        .length == 0
        ? {}
        : state.bookinfo.photographers.filter(
            (agent) => agent._id == agent_id
          )[0],
    bookinfo: state.bookinfo,
    auth: state.auth,
  };
};

export default connect(
  mapStateToProps,
  { setDataBooking, setPhotographerForRequest }
)(SinglePhotographer);
