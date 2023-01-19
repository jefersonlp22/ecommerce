import React from "react";
import parse from "html-react-parser";
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
  //Image,
  DotGroup
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import { BannerWrapper, BannerContent, Caption, ArrowArea } from "./style";
import { ArrowPrev, ArrowNext } from "./icons";
import { SlideProps } from "../../ModelTyping/HomeShopCollection";
import { ImageBoss } from "../../components/Image";

const HeroBanner = ({ data }: any) => {
  let filterSliderMobile = []
  let filterSliderDesktop = []

  filterSliderMobile =  data.filter(slide => {

    if (slide?.device === null) {
      return false
    }

    return slide?.device === 'mobile'
  })

  filterSliderDesktop =  data.filter(slide => {
    if (slide?.device === null) {
      return false
    }

    return slide?.device === 'desktop'
  })

  const handleClick = item => {
    window.open(
      `${item.link}`,
      "_blank"
    );
  }


  if (filterSliderDesktop.length < 1 || filterSliderMobile.length < 1) {
    return null;
  }
  return (
    <BannerWrapper>
      <CarouselProvider
        naturalSlideWidth={100}
        naturalSlideHeight={125}
        totalSlides={filterSliderDesktop.length}
        className="herobanner_wrapper hidden md:grid"
        interval={6000}
        isPlaying={true}
      >
        <ArrowArea direction="prev">
          <ButtonBack>
            <ArrowPrev height={33} />
          </ButtonBack>
        </ArrowArea>

        <Slider className="herobanner_slider hidden md:grid">
          {filterSliderDesktop.length > 0
            ? filterSliderDesktop.map((item: SlideProps, index: number) => {
                return (
                  <div key={index} onClick={() => handleClick(item)} className="cursor-pointer">
                    <Slide key={index} index={index} className="herobanner_item">
                      {/* <Image
                        tag="div"
                        hasMasterSpinner={false}
                        isBgImage={true}
                        src={`${item?.featured_asset?.url ||
                          "https://via.placeholder.com/1600x500"} `}
                        alt="eita"
                        className="herobanner_image bg-silver-1"
                      /> */}
                      <ImageBoss
                        className="herobanner_image bg-silver-1"
                        uri={item?.featured_asset?.url}
                        height={600}
                        width={2440}
                        operation={"cover:contain"}
                      />
                      <BannerContent>
                        <Caption color="#FFF">
                          <h1>{parse(`${item.title}`)}</h1>
                          <div>{parse(`${item.description}`)}</div>
                          <DotGroup className="herobanner_item--dotGrup" />
                        </Caption>
                      </BannerContent>
                    </Slide>
                  </div>
                );
              })
            : null}
        </Slider>
        <ArrowArea direction="next">
          <ButtonNext>
            <ArrowNext height={33} />
          </ButtonNext>
        </ArrowArea>
      </CarouselProvider>
      <CarouselProvider
        naturalSlideWidth={100}
        naturalSlideHeight={125}
        totalSlides={filterSliderMobile.length}
        className="herobanner_wrapper md:hidden"
        interval={3000}
        isPlaying={true}
      >
        <ArrowArea direction="prev">
          <ButtonBack>
            <ArrowPrev height={33} />
          </ButtonBack>
        </ArrowArea>
        <Slider className="herobanner_slider-mobile bg-white  md:hidden">
          {filterSliderMobile.length > 0
            ? filterSliderMobile.map((item: SlideProps, index: number) => {
                return (
                  <div key={index} onClick={() => handleClick(item)} className="cursor-pointer">
                  <Slide key={index} index={index} className="herobanner_item-mobile">
                    {/* <Image
                      tag="div"
                      hasMasterSpinner={false}
                      isBgImage={true}
                      src={`${item?.featured_asset?.url ||
                        "https://via.placeholder.com/1600x500"} `}
                      alt="eita"
                      className="herobanner_imagec"
                    /> */}
                    <ImageBoss
                      className="herobanner_image-mobile bg-white "
                      uri={item?.featured_asset?.url}
                      height={900}
                      width={900}
                      operation={"cover:contain"}
                    />
                    <BannerContent>
                      <Caption color="#FFF">
                        <h1>{parse(`${item.title}`)}</h1>
                        <div>{parse(`${item.description}`)}</div>
                        <DotGroup className="herobanner_item--dotGrup" />
                      </Caption>
                    </BannerContent>
                  </Slide>
                  </div>
                );
              })
            : null}
        </Slider>

        <ArrowArea direction="next">
          <ButtonNext>
            <ArrowNext height={33} />
          </ButtonNext>
        </ArrowArea>
      </CarouselProvider>
    </BannerWrapper>
  );
};

export { HeroBanner };
