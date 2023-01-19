import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled(Link)`
  // max-width: 140px;
  .img {
    width: 100%;
    margin-bottom: 10px;
    background-color: #d6d6d6;
    border-radius: 5px;
    overflow: hidden;
    img {
      display: block;
      object-fit: cover;
      width: 100%;
      
    }
  }

  div, p{
    font-family: ${({ theme }) => theme.fonts.family};
    font-size: ${({ theme }) => theme.fonts.sizes.md};
    color: ${({ theme }) => theme.colors.title};
    word-break: break-word;
  }

  // @media  ${({ theme }) => theme.media.tablet} {
  //   max-width: 160px;
  // }
`;
export { Container };
