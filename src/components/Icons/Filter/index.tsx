import React, { FC } from 'react';
import { SvgContainer } from '../Container';
import { IconProps } from '../Container/types';

const Filter: FC<IconProps> = ({...props}) => {
  return (
    <SvgContainer {...props}>
      <path
        fill={props.fill || "#4D4D4D"}
        fillRule="evenodd"
        d="M24.104 20.568c1.79 0 3.32 1.27 3.653 2.992h2.103c.43 0 .782.348.782.775 0 .427-.351.774-.782.774H27.72c-.395 1.655-1.881 2.834-3.617 2.834s-3.222-1.179-3.617-2.834h-8.972c-.43 0-.782-.347-.782-.774 0-.427.351-.775.782-.775h8.937c.332-1.722 1.861-2.992 3.652-2.992zm-.001 1.549c-1.19 0-2.158.96-2.158 2.139 0 1.18.968 2.139 2.158 2.139s2.16-.96 2.16-2.14c0-.57-.226-1.107-.634-1.511-.408-.405-.95-.627-1.526-.627zm-7.392-8.85c1.774 0 3.3 1.257 3.645 2.96h9.504c.431 0 .782.348.782.775 0 .427-.35.775-.782.775h-9.525c-.383 1.673-1.871 2.864-3.624 2.864-1.752 0-3.24-1.191-3.624-2.864h-1.572c-.431 0-.782-.348-.782-.775 0-.427.351-.774.782-.774h1.55c.346-1.704 1.872-2.961 3.646-2.96zm-.001 1.548c-1.19 0-2.158.96-2.158 2.138 0 1.18.968 2.14 2.158 2.14s2.159-.96 2.159-2.14c0-1.178-.969-2.138-2.16-2.138z"
      />
    </SvgContainer>
  );
};

export { Filter };
