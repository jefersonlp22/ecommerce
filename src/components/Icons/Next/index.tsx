import React from 'react';
import { SvgContainer } from '../Container';
import { IconProps } from '../Container/types';

const Next: React.FC<IconProps> = ({...props}) => {
  return (
    <SvgContainer {...props}>
      <path
        fill={props.fill || "#4A4A4A"}
        fillRule="evenodd"
        d="M7.226 4L6.3 5l4.628 5L6.3 15l.926 1 5.554-6z"
      />
    </SvgContainer>
  );
};

export { Next };
