import styled from "styled-components";

interface Props {
  direction: string;
  theme?: any;
}

interface BannerContentProps {
  verticalAlign?: string;
  horizontalAlign?: string;
}

interface CaptionProps {
  color?: string;
}

const SliderWrapper = styled.div`
  & .carousel {
    position: relative;
    diplay: flex;
  }

  & .card_slider {
  }

  & .card_slider_item {
    padding-bottom: 0px !important;
  }
`;

const ArrowArea = styled.div`
  @media (min-width: 770px) {
    top: 0;
    position: absolute;
    z-index: 9;
    height: 100%;
    display: none !important;

    ${({ direction }: Props) =>
      direction === "prev" ? `left: 10px;` : `right: 10px;`}

    & button {
      background-color: transparent;
      border: none;
      outline: none;
    }
  }

  @media ${({ theme }) => theme.media.tablet} {
    display: flex;
  }
  @media ${({ theme }) => theme.media.mobileS} {
    boder: 2px solid red;
    top: 0;
    display: flex;
    ${({ direction }: Props) =>
      direction === "prev" ? `left: 10px;` : `right: 10px;`}
    z-index: 9;
    position: absolute;
    height: 100%;
    align-items: center;
  }
`;
export { ArrowArea, SliderWrapper };
