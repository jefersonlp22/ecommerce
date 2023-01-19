import styled from "styled-components";

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
  
`;

const Card = styled.div`
    width: 100%;
    box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.05);
    border-radius: 5px;
`;
const Link = styled.div`
    width: 100%;
    box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.05);
    border-radius: 5px;
    background-color: #81A5FF;
`;

const Line = styled.div`
    
`;

const Status = styled.div`
    position: relative;
    width: 20px;
    height: 20px;
    border-radius: 10px;
`;
const TextStatus = styled.p`
    position: absolute;
`;
const Detail = styled.p`
    color: #4d4d4d;
`;

export {
  Container,
  Content,
  Card,
  Status,
  Line,
  TextStatus,
  Link,
  Detail,
};
