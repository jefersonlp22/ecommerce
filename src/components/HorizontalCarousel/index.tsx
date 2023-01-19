import React, { useState, useEffect } from "react";
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import { Props } from "./types";
import { ArrowArea, SliderWrapper } from "./style";
import { ArrowNext, ArrowPrev } from "../HeroBanner/icons";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

/**
 * @description Reponsive Horizontal Carousel
 * @param data Object array with data to show
 * @param component Component thats rendered as item in carousel
 */
const HorizontalCarousel: React.FC<Props> = ({ data, component, ...props }) => {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  const setVisibleSlides = () => {
    let qtd = 2;

    if (windowDimensions.width >= 1024) {
      qtd = 5;
    } else if (windowDimensions.width >= 786) {
      qtd = 4;
    } else if (windowDimensions.width >= 620) {
      qtd = 4;
    } else if (windowDimensions.width >= 425) {
      qtd = 3;
    }
    return qtd;
  };

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [windowDimensions]);

  return (
    <div className="-mx-1 md:-mx-4">
      <SliderWrapper>
        <CarouselProvider
          visibleSlides={setVisibleSlides()}
          step={1}
          dragStep={1}
          totalSlides={data?.length}
          naturalSlideWidth={props.naturalSlideWidth}
          naturalSlideHeight={props.naturalSlideHeight}
          isIntrinsicHeight
        >
          <ArrowArea direction="prev">
            <ButtonBack disabled={false}>
              <ArrowPrev height={33} />
            </ButtonBack>
          </ArrowArea>
          <Slider className="focus:outline-none card_slider">
            {data.length &&
              data.map((item, index) => (
                <Slide
                  className="card_slider_item"
                  key={`${data.length}.${index}`}
                  index={index}
                >
                  <div className="px-1 md:px-4 h-full pb-3">
                    {React.createElement(component, { ...item })}
                  </div>
                </Slide>
              ))}
          </Slider>
          <ArrowArea direction="">
            <ButtonNext disabled={false}>
              <ArrowNext height={33} />
            </ButtonNext>
          </ArrowArea>
        </CarouselProvider>
      </SliderWrapper>
    </div>
  );
};

export { HorizontalCarousel };
