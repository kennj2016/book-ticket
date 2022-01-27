import React from "react";
import styled, { keyframes } from "styled-components";
import PropTypes from "prop-types";
import LazyLoad from "react-lazyload";

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
`;


const Placeholder = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  min-height:200px;
  background-color:#e6e6e6;
  background:url('/images/placeholder.gif') no-repeat ;
  background-position: center;
`;

const StyledImage = styled.img`
background:white

`;

const LazyImage = ({ src, alt,handleOnClick }) => {
  const refPlaceholder = React.useRef();

  const removePlaceholder = () => {
    refPlaceholder.current.remove();
  };

  return (
    <ImageWrapper>
      <Placeholder ref={refPlaceholder} />
      <LazyLoad>
        <StyledImage
          onLoad={removePlaceholder}
          onError={removePlaceholder}
          src={src}
          alt={alt}
          onClick={e=>{
            handleOnClick()
          }}
        />
      </LazyLoad>
    </ImageWrapper>
  );
};

LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired
};

export default LazyImage;