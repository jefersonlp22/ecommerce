import styled from "styled-components";

const Container = styled.label`
    text-align: left;
    padding-left: 30px;
    display: flex;
    align-items:center;    
    position: relative;
    min-height: 23px;
    width: 100%;    
    margin-bottom: 12px;
    font-size: 12px;    
    color: ${({ theme }) => theme.colors.title};
    cursor: pointer;
    
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