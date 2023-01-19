import  styled  from 'styled-components';
import { InputProps } from './index.d';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;

  & .search__svg{
    position: absolute;
    right: 0;
  }

  & .search__cancel{
    min-width: 40px;
    display: none;
  }

  ${({toggle}: InputProps)=> toggle ? `
    width: 100%;
    position: absolute;
    background-color: #FFF;
    padding-left: 60px;
    right: 60px;

    & .search__cancel{
      display: block;
    }


  ` : ''}

  @media  ${({theme})=> theme.media.tablet} {
    ${({toggle}: InputProps)=> toggle ? `
      position: relative;
      background-color: transparent;
      padding-left: 0px;
      right: 0px;

      & .search__cancel{
        display: none;
      }


    ` : ''}
  }

`;

const InputContent = styled.form`
  position: relative;
  background-color: #f5f5f5;
  border-radius: 5px;
  font-family: ${({theme})=> theme.fonts.family};
  height: 40px;
  box-sizing: border-box;
  width: 0px;
  transition: opacity 0.4s;
  opacity: 0;
  padding-right: 40px;

  ${({toggle}: InputProps)=> toggle ? `
    width: 100%;
    opacity: 1;
  ` : ''}

`;



const Input = styled.input`
  background: transparent;
  border: none;
  color: #4d4d4d;
  height: 100%;
  padding: 11px 15px 11px 15px;
  outline: none;
  box-sizing: border-box;
  flex-grow: 1;
`;

const Results = styled.div`
  background: #f5f5f5;
  max-height: 90vh;
  top: 100%;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  overflow: hidden;
  overflow-y: auto;
`;

export { Container, InputContent, Input, Results };
