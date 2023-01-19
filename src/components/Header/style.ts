import styled from "styled-components";
import { ColProps, AvatarProps } from "./types";

const Container = styled.div`
  width: 100%;
  height: 70px;
  padding: 0px 12px;
  box-sizing: border-box;
  background-color: #fff;
  z-index: 10;
  @media ${({ theme }) => theme.media.laptopL} {
    padding: 0px;
  }
`;

const Content = styled.div`
  height: 100%;
  max-width: ${props => props.theme.sizes.content};
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  @media ${({ theme }) => theme.media.tablet} {
    grid-template-columns: 1fr 1fr 1fr;
    padding-left: ${props => `${props.theme.sizes.gapNumeric / 2}px`};
    padding-right: ${props => `${props.theme.sizes.gapNumeric / 2}px`};
  }
  padding-left: ${props => `${props.theme.sizes.gapNumeric / 0}px`};
  padding-right: ${props => `${props.theme.sizes.gapNumeric / 0}px`};
`;

const Col = styled.div`
  /* border: 1px solid black; */
  display: flex;
  flex-direction: row;
  align-items: ${({ align }: ColProps) => align || "center"};
  justify-content: ${({ justify }: ColProps) => justify || "start"};
`;

const Avatar = styled.img<AvatarProps>`
  width: ${props => `${props.size ?? 34}px`};
  height: ${props => `${props.size ?? 34}px`};
  border: 3px solid var(--color-primary);
  border-radius: 100%;
  @media ${({ theme }) => theme.media.tablet} {
    width: ${props => `${props.size ?? 44}px`};
    height: ${props => `${props.size ?? 44}px`};
  }
`;

const AvatarDefault = styled.div<AvatarProps>`
  display: flex;
  width: ${props => `${props.size ?? 44}px`};
  height: ${props => `${props.size ?? 44}px`};
  margin-right: 10px;
  margin-top: 5px;
  align-items: "center";
  justify-content: "center";
  border: 3px solid var(--color-primary);
  border-radius: 100%;
  @media ${({ theme }) => theme.media.tablet} {
    width: ${props => `${props.size ?? 44}px`};
    height: ${props => `${props.size ?? 44}px`};
  }
`;

const Identity = styled.div`
  @media ${({ theme }) => theme.media.tablet} {
    display: block;
  }
`;

const Name = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.family};
  font-size: 21px;
  margin-bottom: 5px;
`;

const Contact = styled.button`
  color: ${({ theme }) => theme.colors.silver};
  font-family: ${({ theme }) => theme.fonts.family};
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
  margin-bottom: 5px;
  cursor: pointer;
  background: transparent;
  border: 0;
  padding: 0;
  outline: none;
`;

const ContactShare = styled.div`
  color: #666666;
  font-family: ${({ theme }) => theme.fonts.family};
  font-size: 14px;
  margin-bottom: 5px;
  cursor: pointer;
  background: transparent;
  border: 0;
  padding: 0;
  outline: none;
`;

const BrandImage = styled.picture`
  width: 140px;
  height: 36px;
  margin: 0 auto;
`;

const H3 = styled.h3`
  color: #4d4d4d;
  font-size: 24px;
  font-family: ${({ theme }) => theme.fonts.family};
`;

export {
  Container,
  Content,
  Col,
  Avatar,
  Identity,
  Name,
  Contact,
  ContactShare,
  BrandImage,
  H3,
  AvatarDefault
};
