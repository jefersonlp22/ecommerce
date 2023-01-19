import styled from "styled-components";
import { IconProps } from "./types";

const Container = styled.div`
  width: ${(props: IconProps) => `${props.size || 40}px`};
  height: ${(props: IconProps) => `${props.size || 40}px`};
  position: realtive;
`;
const Notification = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #ff6f6f;
  position: absolute;
  margin-left: 30px;
`;

export { Container, Notification };
