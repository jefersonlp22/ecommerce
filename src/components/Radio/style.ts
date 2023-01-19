import styled from "styled-components";

const Container = styled.label`
    display: flex;
    position: relative;
    height: 23px;
    width: 25%;
    padding-left: 0px;
    margin-bottom: 12px;
    font-size: 12px;
    font-family: ${({ theme }) => theme.fonts.family}
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    align-items:center;
    justify-content: center;
    line-height: normal;
    letter-spacing: normal;
    color: ${({ theme }) => theme.colors.title};
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    input{
      position: relative;
      opacity: 0;
      cursor: pointer;

      &:hover{
        background-color: #eee;
      }

      &:checked{
        background-color: #ffffff;
        border: #e5e5e5 1px solid;
        display: block;
      }
    }
`;

const Span = styled.span<{ active?: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: #ffffff;
  border-radius: 50%;
  border: #e5e5e5 1px solid !important;

  &:hover{
    background-color: #eee;
  }
  &:checked{
    background-color: var(--color-primary);
    border: #e5e5e5 1px solid;
  }
  &:after {
    content: "";
    position: absolute;
    display: none;
    display: block;
    top: 4px;
    left: 4px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${({active})=> active ? 'var(--color-primary)' : '#ffffff'};
  }
`;
   
export { Container, Span}