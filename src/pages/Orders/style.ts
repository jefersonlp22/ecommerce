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
  height: 100vh;
  width: 100vw;
`;

const Card = styled.div`
    width: 100%;
    box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.05);
    border-radius: 5px;
`;
const MenuIcon = styled.div`
    height: 200px;
    background: url('https://api.iconify.design/uil:sort-amount-down.svg?width=80px') no-repeat center center;
`;

const Menu = styled.div`
    width: 100vw;
    display: none;
    @media (min-width: 768px){
        max-width: 220px;
        display: flex;
        flex-direction: column;
    }
    background-color: #fafafa;
`;
const MenuMobile = styled.div<any>`
    background-color: #fafafa;
    transition: display 2s, opacity 1.5s linear;
    display: ${props => `${props.show ? 'flex' : 'none'}`};
    max-height: 350px;
    @media (min-width: 768px){
        height: 0px;
        display: none;
    }
`;
const TagMenu = styled.div`
    width: 100%;
    cursor: pointer;
`;
const Table = styled.div`
    width: 100%;
    padding: 1px;
    background-color: #fafafa;
    border: 1px solid #E5E5E6;
    border-radius: 5px;
    display: none;
    @media (min-width: 768px){
        display: grid;
    }
`;
const Th = styled.div`
    width: 100%;
    background-color: #fafafa;
`;
const Tr = styled.div`
    width: 100%;
    cursor: pointer;
    background-color: #fafafa;
    border-top: 1px solid #E5E5E6;
`;
const Td = styled.div`
    width: 100%;
    border-radius: 1px;
`;
const Status = styled.div`
    width: 10px;
    border-radius: 5px;
    height: 10px;
`;

export {
  Container,
  Content,
  Card,
  Th,
  Tr,
  Td,
  Table,
  Menu,
  TagMenu,
  MenuMobile,
  MenuIcon,
  Status,
};
