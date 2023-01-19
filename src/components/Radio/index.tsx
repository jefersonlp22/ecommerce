import React from 'react';

import { Container, Span } from './style';

interface radioProps {
  selectedInput?: (value: any) => void;
  value?: any,
  active?: boolean
}

const Radio: React.FC <radioProps>= ({value, selectedInput, active }) => {
 
  return (
    <Container >
      {value?.name}
      <input
      type="radio"
      checked={active}
      name="radio"
      value={value}
      //onChange={e => selectedInput(parseInt(e.target.value, 10))}
      onChange={e => selectedInput(value)}

      />
      
      <Span active={active} ></Span>
    </Container>
  );
}

export default Radio;