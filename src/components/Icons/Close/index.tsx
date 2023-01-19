import React from 'react';
import { IconProps } from '../Container/types';
import { SvgContainer } from '../Container';


const IconClose: React.FC<IconProps>  = ({fill, ...props}) =>{
  return(
    <SvgContainer {...props}>
      <path
        fill={fill || "#4D4D4D"}
        d="M26.666 12L19.999 18.666 13.332 12 12 13.334 18.666 20 12 26.666 13.332 28 19.999 21.334 26.666 28 28 26.666 21.332 20 28 13.334z"
      />
    </SvgContainer>
  );
};

export { IconClose };
