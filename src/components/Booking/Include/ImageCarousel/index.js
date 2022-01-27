import React, {useEffect, useRef, useState} from "react";
import {
    DownloadOutlined,
    HeartFilled,
    HeartOutlined,
    ShareAltOutlined,
    LeftCircleOutlined,
    RightCircleOutlined,
} from "@ant-design/icons";
import Slider from "react-slick";
// Import Swiper React components
import {Swiper, SwiperSlide} from "swiper/react";

// Import Swiper styles
import "swiper/swiper.min.css";
import "swiper/components/navigation/navigation.min.css"


// import Swiper core and required modules
import SwiperCore, {
    Navigation
} from 'swiper/core';

// install Swiper modules
SwiperCore.use([Navigation]);

const SERVER_DOMAIN = process.env.API_URL.split("/api/v1").shift();

function getWindowDimensions() {
    const {innerWidth: width, innerHeight: height} = window;
    return {
        windowWidth: width,
        windowHeight: height,
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

const ImageCarousel = ({
                           images,
                           handleFavorite,
                           arrayLike,
                           handleShare,
                           toggleDownloadModal,
                           bookingId,
                           handleClosePopup
                       }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState();
    const carouselItemsRef = useRef([]);
    // store swiper instance
    const [swiper, setSwiper] = useState(null);
    const [dimensions, setDimensions] = useState({height: 0, width: 0});
    const {windowWidth, windowHeight} = useWindowDimensions();

    const handleKeyDown = (event) => {
        if (event.code === "ArrowRight") {
            handleRightClick();
        }
        if (event.code === "ArrowLeft") {
            handleLeftClick();
        }
    };


    const handleClickElseWhereToClosePopup = (event) => {
        console.log(event.target.className);
        try {

            if (typeof event.target != 'undefined' && typeof event.target.className != 'undefined') {
                if (event.target.className && event.target.className.indexOf("carousel-container") > -1 ||
                    event.target.className && event.target.className.indexOf("selected-image") > -1) {

                    handleClosePopup()
                }
            }

        } catch (e) {

            //console.log (e);
        }


    };


    React.useEffect(() => {
        const slider = document.querySelector(".carousel");
        if (slider) {
            let isDown = false;
            let startX;
            let scrollLeft;
            // console.log('slider', slider);
            slider.addEventListener("mousedown", (e) => {
                isDown = true;
                slider.classList.add("active");
                startX = e.pageX - slider.offsetLeft;
                scrollLeft = slider.scrollLeft;
            });
            slider.addEventListener("mouseleave", () => {
                isDown = false;
                slider.classList.remove("active");
            });
            slider.addEventListener("mouseup", () => {
                isDown = false;
                slider.classList.remove("active");
            });
            slider.addEventListener("mousemove", (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - slider.offsetLeft;
                const walk = (x - startX) * 3; //scroll-fast
                slider.scrollLeft = scrollLeft - walk;
                // console.log(walk);
            });
        }
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

    const onImgLoad = (e) => {
        setDimensions({
            height: e.target.offsetHeight,
            width: e.target.offsetWidth,
        });
    };

    const handleSelectedImageChange = (newIdx) => {
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
                    behavior: "smooth",
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
            this.slider.slickGoTo(newIdx)
        }
    };

    const handleLeftClick = () => {
        if (images && images.length > 0) {
            let newIdx = selectedImageIndex - 1;
            if (newIdx < 0) {
                newIdx = images.length - 1;
            }
            handleSelectedImageChange(newIdx);
            this.slider.slickGoTo(newIdx)
        }
    };


    return selectedImage ? (
        <div className="carousel-container" onClick={e => handleClickElseWhereToClosePopup(e)}>
            <div className="selected-image collection-image">
                <Swiper navigation={true} className="mySwiper" onSlideChange={e => {
                    if (this.slider) {
                        setSelectedImageIndex(e.activeIndex - 1);
                        this.slider.slickGoTo(e.activeIndex - 1)
                    }
                }} loop={true} loopFillGroupWithBlank={true} onSwiper={setSwiper}>
                    {images &&
                    images.map((image, idx) => (
                        <SwiperSlide key={idx}>
                            <img
                                style={{
                                    opacity: 0,
                                    visibility: "visible",
                                    position: "absolute",
                                    zIndex: "-10",
                                    top: "-10000px",
                                }}
                                onLoad={(e) => onImgLoad(e)}
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
                                            : `${windowHeight - 200}px`,
                                }}
                                src={image.original}
                                alt=""
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <section className={"action-image"}>
                  <span
                      onClick={() =>
                          toggleDownloadModal({original: images[selectedImageIndex].original})
                      }
                      className={"download"}
                  >
                    <DownloadOutlined style={{color: "white"}}/>
                  </span>

                    <span
                        className={"like"}
                        onClick={() => {
                            handleFavorite(
                                images[selectedImageIndex].collectionId,
                                images[selectedImageIndex],
                                arrayLike.includes(images[selectedImageIndex] && images[selectedImageIndex]._id)
                            );
                        }}
                    >
            {arrayLike.includes(images[selectedImageIndex] && images[selectedImageIndex]._id) ? (
                <HeartFilled/>
            ) : (
                <HeartOutlined/>
            )}
          </span>

                    <span
                        className={"share"}
                        onClick={() =>
                            handleShare(
                                SERVER_DOMAIN +
                                "/collections/" +
                                bookingId +
                                "/" +
                                images[selectedImageIndex]._id
                            )
                        }
                    >
            <ShareAltOutlined/>
          </span>
                </section>
            </div>


            <div className='carousel-true-sharp'>
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
                                style={{backgroundImage: `url(${image.original})`, padding: `10px`}}
                                key={image.id}

                            >
                            </div>
                        </div>
                    ))}
                </Slider>

                <button
                    className="carousel__button carousel__button-left"
                    onClick={handleLeftClick}
                >
                    <LeftCircleOutlined/>
                </button>
                <button
                    className="carousel__button carousel__button-right"
                    onClick={handleRightClick}
                >
                    <RightCircleOutlined/>
                </button>
            </div>


        </div>
    ) : (
        <div style={{height: 500, background: 'red', width: 500}}>loading</div>
    );
};

export default ImageCarousel;
