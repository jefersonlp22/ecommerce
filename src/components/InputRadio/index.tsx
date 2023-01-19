import React from 'react';

import { Container, Span } from './style';

interface props {
  id?: number
    name?: string
    price_formatted?: string
    delivery_estimate?: string
    setting_id?: string
}

interface radioProps {
  selectedInput?: (value: any) => void;
  value?: props
  selected?: props
}

const InputRadio: React.FC <radioProps>= ({value, children, selectedInput, selected}) => {
 
  return (
    <Container >
      {value?.name}
      <input
      type="radio"
      checked={selected?.setting_id === value?.setting_id}
      name="radio"
      value={value?.setting_id}
      //onChange={e => selectedInput(parseInt(e.target.value, 10))}
      onChange={e => selectedInput(value)}

      />
      
      <Span active={selected?.setting_id === value?.setting_id} ></Span>
    </Container>
  );
}

export default InputRadio;