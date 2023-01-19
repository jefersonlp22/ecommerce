import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled(Link)`
  // max-width: 140px;
  min-height: calc(100% - 10px);
  height: 100%;
  background-color: #FFF;
  box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.05);
  border-radius: 5px;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .img {
    object-fit: cover;
    width: 100%;
    background-color: #d6d6d6;
    overflow: hidden;

    img {
      display: block;
      width: 100%;
    }
  }


  // @media  ${({ theme }) => theme.media.tablet} {
  //   max-width: 160px;
  // }

  // @media  ${({ theme }) => theme.media.mobileL} {
  //   min-width: 160px;
  // }
`;

const Content = styled.div`
  padding: 10px;
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  word-break: break-word;

  font-family: ${({ theme }) => theme.fonts.family};
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
  font-weight: normal;
  color: ${({ theme }) => theme.colors.text};

  .name {
    color: ${({ theme }) => theme.colors.title};
    margin-bottom: 5px;
  }

  .oldPrice {
    color: ${({ theme }) => theme.colors.text};
    text-decoration: line-through;
    margin-bottom: 5px;
  }

  .price {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 120px;
    min-height: 17px;
  }

  .iconToggle {
    margin-bottom: 5px;
  }
`;
export { Container, Content };
