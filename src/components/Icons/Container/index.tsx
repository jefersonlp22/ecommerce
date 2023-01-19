import React from "react";
import { IconProps } from "./types";
import { Container, Notification } from "./style";

/**
 * @description Default Container to svg icons with path 40x40
 */
const SvgContainer: React.FC<IconProps> = ({ ...props }) => (
  <Container size={props.size}>
    {props.notification && <Notification />}
    <svg
      width={`${props.size || 40}px`}
      height={`${props.size || 40}px`}
      viewBox={`0 0 ${props.size || "40"} ${props.size || "40"}`}
      className={props.className}
      onClick={props.onClick}
      style={{ cursor: props.cursor || "default" }}
    >
      {props.children}
    </svg>
  </Container>
);

export { SvgContainer };
