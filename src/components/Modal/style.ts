import styled from "styled-components";
import { ContainerProps } from "./types";

const Container = styled.div<ContainerProps>`
  background-color: #f5f5f5;
  margin: auto; // :: não remover :: resolve o bug de quando o modal é maior que a página o topo somir
  @media  ${({theme})=> theme.media.mobileL} {
    width: ${({w})=> `${w}px`};
  }
`;

const Close = styled.button`
  background: #f5f5f5;
  border: none;
  padding: 0;
  outline: none;
  position: absolute;
  top: 5px;
  right: 5px;
`

export { Container, Close };
