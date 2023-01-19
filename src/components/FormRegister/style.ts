import styled from "styled-components";

const Radio = styled.div`
  min-width: 50%;
  color: #9B9B9B;
  font-size: 12px;
  line-height: 14px;
  margin-bottom: 5px;
`;
const RadioValues = styled.div`
  min-width: 40%;
  color: #9B9B9B;
  font-size: 12px;
  line-height: 14px;
  margin-bottom: 5px;
`;
const TextRadio = styled.p<{ active?: boolean }>`
font-size: 16px;
min-width: 40%;
line-height: 26px;
color: ${({ active }) => active ? 'var(--color-primary)' : '#D9D9D9'}; 
`;
export {Radio, TextRadio, RadioValues}