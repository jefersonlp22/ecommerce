import styled from "styled-components";
import {
  GridProps,
  ContentProps,
  RowProps,
  ColProps,
  LineProps
} from "./types";

const Grid = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: ${({ columnSize }: GridProps) =>
    `repeat(auto-fit, minmax(${columnSize || "300"}px, 1fr))`};
  grid-gap: ${({ columnGap }: GridProps) => `${columnGap || "30"}px`};
  padding: 0 20px;
`;

const Container = styled.div`
  width: 100%;
  // padding: 0px 12px;
  box-sizing: border-box;
  overflow-x: hidden;
  @media ${({ theme }) => theme.media.laptopL} {
    padding: 0px;
  }
`;

const Content = styled.div<ContentProps>`
  max-width: ${props => props.theme.sizes.content};
  margin: 0 auto;
  word-break: break-all;
  padding-left: ${props => `${props.px ?? props.theme.sizes.gapNumeric / 2}px`};
  padding-right: ${props =>
    `${props.px ?? props.theme.sizes.gapNumeric / 2}px`};
`;

const Row = styled.div<RowProps>`
  display: flex;
  flex-wrap: wrap;
  margin-left: ${props =>
    `${props.mx ?? (props.theme.sizes.gapNumeric / 2) * -1}px`};
  margin-right: ${props =>
    `${props.mx ?? (props.theme.sizes.gapNumeric / 2) * -1}px`};
`;

const Col = styled.div<ColProps>`
  padding-left: ${props => `${props.px ?? props.theme.sizes.gapNumeric / 2}px`};
  padding-right: ${props =>
    `${props.px ?? props.theme.sizes.gapNumeric / 2}px`};
  margin-bottom: ${props => `${props.mb ?? 0}px`};
`;

const Line = styled.div<LineProps>`
  width: 100%;
  height: ${props => `${props.size ?? 30}px`};
`;

export { Grid, Container, Content, Row, Col, Line };
