import styled from "styled-components";
import { Props, BannerContentProps, CaptionProps } from "./types";

const BannerWrapper = styled.div`
  width: 95%;
  margin: auto;
  @media ${({ theme }) => theme.media.laptop} {
    max-width: 1230px;
    margin: auto;
    padding-left: 15px;
    padding-right: 15px;
  }
  & .carousel {
    position: relative;
  }

  & .herobanner_slider {
    height: 300px;
  }

  & .herobanner_item {
    height: 300px;
    padding-bottom: 0px !important;

    &--dotGrup {
      margin-bottom: 53px;
      & button {
        outline: none;
        border: none;
        height: 10px;
        width: 10px;
        border-radius: 100%;
        padding: 0;
        margin-right: 6px;
        background-color: #fff;
        opacity: 0.5;
        &:disabled {
          opacity: 1;
        }
      }
    }
  }

  & .herobanner_image {
    background-position: center;
    height: 300px;
    overflow-x: hidden;
    @media ${({ theme }) => theme.media.mobileM} {
      width: 100%;
    }
  }

  & .herobanner_slider-mobile {
    height: 400px;
  }

  & .herobanner_item-mobile {
    height: 400px;
    padding-bottom: 0px !important;

    &--dotGrup {
      margin-bottom: 53px;
      & button {
        outline: none;
        border: none;
        height: 10px;
        width: 10px;
        border-radius: 100%;
        padding: 0;
        margin-right: 6px;
        background-color: #fff;
        opacity: 0.5;
        &:disabled {
          opacity: 1;
        }
      }
    }
  }
  & .herobanner_image-mobile {
    background-position: center;
    height: 400px;
    overflow-x: hidden;
    @media ${({ theme }) => theme.media.mobileM} {
      width: 100%;
    }
  }
`;

const BannerContent = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  display: flex;
  justify-content: ${({ verticalAlign }: BannerContentProps) =>
    verticalAlign ? verticalAlign : "flex-start"};
  align-items: ${({ horizontalAlign }: BannerContentProps) =>
    horizontalAlign ? horizontalAlign : "flex-end"};
`;

const Caption = styled.div`
  max-width: ${(props: any) => `${props.theme.sizes.contentNumeric}px`};
  width: 100%;
  padding: 0px 10%;
  font-family: ${({ theme }) => theme.fonts.family};
  ${({ color }: CaptionProps) => (color ? `color: ${color};` : "")}

  h1 {
    font-size: ${({ theme }) => theme.fonts.sizes.xl};
    margin-bottom: 10px;
  }

  p {
    font-size: ${({ theme }) => theme.fonts.sizes.sm};
  }

  div {
    margin-bottom: 10px;
  }

  @media ${({ theme }) => theme.media.laptopL} {
    padding: 0px;
    padding: 0px 10%;
  }
`;

const ArrowArea = styled.div`
  position: absolute;
  top: 0;
  z-index: 9;
  height: 100%;
  display: none;
  align-items: center;

  ${({ direction }: Props) =>
    direction === "prev" ? `left: 30px;` : `right: 30px;`}

  & button {
    background-color: transparent;
    border: none;
    outline: none;
  }

  @media ${({ theme }) => theme.media.tablet} {
    display: flex;
  }
  @media ${({ theme }) => theme.media.mobileM} {
    display: flex;
    ${({ direction }: Props) =>
      direction === "prev" ? `left: 10px;` : `right: 10px;`}
    z-index: 9;
    position: absolute;
    height: 100%;
    align-items: center;
  }
`;

export { BannerContent, Caption, ArrowArea, BannerWrapper };
