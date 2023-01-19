import styled from 'styled-components';
import { TitleProps } from './index.props';

const Title = styled.div<TitleProps>`
  font-family: ${({theme})=>theme.fonts.family};
  font-size: ${({theme})=>theme.fonts.sizes.lg};
  font-weight: bold;
  color: ${({theme})=>theme.colors.title};
  max-width: 80%;

  ${({mobileTruncate}) => {
    if(mobileTruncate) {
      return `
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `
    }
    return `
      word-break: normal;
    `
  }}

  @media  ${({theme})=> theme.media.mobileL} {
    white-space: initial;
    overflow: auto;
    text-overflow: initial;
    max-width: auto;
  }
`;

const TextLinked = styled.div`
  font-family: ${({theme})=>theme.fonts.family};
  font-size: ${({theme})=>theme.fonts.sizes.sm};
  color: ${({theme})=>theme.colors.primary};
  display: flex;
  justify-content: center;
  align-items: center;

  // svg{
  //   color: ${({theme})=>theme.colors.primary};
  //   display: block;
  // }

  // .text{
  //   display: none;
  // }

  // @media  ${({theme})=> theme.media.mobileL} {
  //   svg{
  //     display: none;
  //   }
  //   .text{
  //     display: block;
  //   }
  // }
`;

const P = styled.p`
  font-family: ${({theme})=>theme.fonts.family};
  font-size: ${({theme})=>theme.fonts.sizes.xs};
  font-weight: medium;
  color: ${({theme})=>theme.colors.silver};
`;

export { Title, TextLinked, P };
