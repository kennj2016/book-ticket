import React, { useEffect, useRef, useState } from "react";
import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons";
import { Carousel } from "antd";
import Slider from "react-slick";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/swiper.min.css";
import "swiper/components/navigation/navigation.min.css";

// import Swiper core and required modules
import SwiperCore, { Navigation } from "swiper/core";

// install Swiper modules
SwiperCore.use([Navigation]);

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    windowWidth: width,
    windowHeight: height
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

const ImageCarouselWithoutHandle = ({ images, handleClosePopup }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState();
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });
  const [swiper, setSwiper] = useState(null);
  const carouselItemsRef = useRef([]);

  const { windowWidth, windowHeight } = useWindowDimensions();

  const handleKeyDown = event => {
    if (event.code === "ArrowRight") {
      handleRightClick();
    }
    if (event.code === "ArrowLeft") {
      handleLeftClick();
    }
  };

  const handleClickElseWhereToClosePopup = event => {
    console.log("event.target.className", event.target.className);
    try {
      if (
        typeof event.target != "undefined" &&
        typeof event.target.className != "undefined" &&
        event.target.className
      ) {
        if (
          event.target.className.indexOf("carousel-container") > -1 ||
          event.target.className.indexOf("swiper-container") > -1 ||
          event.target.className.indexOf("swiper-slide") > -1
        ) {
          handleClosePopup();
        }
      }
    } catch (e) {
      //console.log (e);
    }
  };
  const onImgLoad = e => {
    setDimensions({
      height: e.target.offsetHeight,
      width: e.target.offsetWidth
    });
  };

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    // cleanup this component
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  useEffect(() => {
    if (images && images[0]) {
      carouselItemsRef.current = carouselItemsRef.current.slice(
        0,
        images.length
      );

      setSelectedImageIndex(0);
      setSelectedImage(images[0]);
      console.log(images[0]);
    }
  }, [images]);

  const handleSelectedImageChange = newIdx => {
    if (images && images.length > 0) {
      let index = newIdx;
      if (index >= images.length) {
        index = images.length - 1;
      }

      setSelectedImage(images[index]);
      setSelectedImageIndex(index);
      swiper.slideTo(index + 1);
      if (carouselItemsRef.current[index]) {
        carouselItemsRef.current[index].scrollIntoView({
          inline: "center",
          behavior: "smooth"
        });
      }
    }
  };

  const handleRightClick = () => {
    if (images && images.length > 0) {
      let newIdx = selectedImageIndex + 1;
      if (newIdx >= images.length) {
        newIdx = 0;
      }
      handleSelectedImageChange(newIdx);
      this.slider.slickGoTo(newIdx);
    }
  };

  const handleLeftClick = () => {
    if (images && images.length > 0) {
      let newIdx = selectedImageIndex - 1;
      if (newIdx < 0) {
        newIdx = images.length - 1;
      }
      handleSelectedImageChange(newIdx);
      this.slider.slickGoTo(newIdx);
    }
  };

  let ratio = dimensions.width / dimensions.height;

  return selectedImage ? (
    <div
      className="carousel-container"
      onClick={e => handleClickElseWhereToClosePopup(e)}
    >
      <div className="selected-image collection-image">
        <Swiper
          navigation={true}
          className="mySwiper"
          onSlideChange={e => {
            console.log("e", e.activeIndex);
            if (this.slider) {
              setSelectedImageIndex(e.activeIndex - 1);
              this.slider.slickGoTo(e.activeIndex - 1);
            }
          }}
          loop={true}
          loopFillGroupWithBlank={true}
          onSwiper={setSwiper}
        >
          {images &&
            images.map((image, idx) => (
              <SwiperSlide key={idx}>
                <img
                  style={{
                    opacity: 0,
                    visibility: "visible",
                    position: "absolute",
                    zIndex: "-10",
                    top: "-10000px"
                  }}
                  onLoad={e => onImgLoad(e)}
                  src={image.original}
                  alt=""
                />

                <img
                  style={{
                    height:
                      dimensions.height >= dimensions.width && windowWidth > 768
                        ? `calc(${windowHeight}px - 260px)`
                        : "auto",
                    width: "auto",
                    maxHeight:
                      dimensions.height == dimensions.width && windowWidth > 768
                        ? `calc(${dimensions.width}px - 150px)`
                        : `${windowHeight - 200}px`
                  }}
                  src={image.original}
                  alt=""
                />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>

      <div className="carousel-true-sharp">
        <Slider
          ref={slider => (this.slider = slider)}
          infinite={true}
          slidesToShow={windowWidth > 768 ? 8 : 5}
          slidesToScroll={3}
          swipeToSlide={true}
        >
          {images &&
            images.map((image, idx) => (
              <div>
                <div
                  className={`item-carousel ${selectedImageIndex === idx &&
                    "carousel__image-selected"}`}
                  onClick={() => handleSelectedImageChange(idx)}
                  style={{
                    backgroundImage: `url(${image.original})`,
                    padding: `10px`
                  }}
                  key={image.id}
                ></div>
              </div>
            ))}
        </Slider>

        <button
          className="carousel__button carousel__button-left"
          onClick={handleLeftClick}
        >
          <LeftCircleOutlined />
        </button>
        <button
          className="carousel__button carousel__button-right"
          onClick={handleRightClick}
        >
          <RightCircleOutlined />
        </button>
      </div>
    </div>
  ) : (
    "Loading"
  );
};

export default ImageCarouselWithoutHandle;
