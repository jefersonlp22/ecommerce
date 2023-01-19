import React from 'react';
import { IconProps } from '../Container/types';
import { SvgContainer } from '../Container';


const IconCancel: React.FC<IconProps>  = ({fill, ...props}) =>{
  return(
    <SvgContainer {...props}>
      <path
        fill={fill || "#4d4d4d"}
        d="M26.666 12L20 18.666 13.332 12 12 13.334 18.666 20 12 26.666 13.332 28 20 21.334 26.666 28 28 26.666 21.332 20 28 13.334z"
      />
    </SvgContainer>
  );
};

export { IconCancel };
