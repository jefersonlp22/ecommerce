import React from 'react';
import { SvgContainer } from '../Container';
import { IconProps } from '../Container/types';

const MenuIcon: React.FC<IconProps> = ({...props}) => {
  return (
    <SvgContainer {...props}>
      <svg  aria-hidden="true" focusable="false" width="4em" height="4em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M6.29 14.29l-.29.3V7a1 1 0 0 0-2 0v7.59l-.29-.3a1 1 0 0 0-1.42 1.42l2 2a1 1 0 0 0 .33.21a.94.94 0 0 0 .76 0a1 1 0 0 0 .33-.21l2-2a1 1 0 0 0-1.42-1.42zM11 8h10a1 1 0 0 0 0-2H11a1 1 0 0 0 0 2zm10 3H11a1 1 0 0 0 0 2h10a1 1 0 0 0 0-2zm0 5H11a1 1 0 0 0 0 2h10a1 1 0 0 0 0-2z" fill="black"/></svg>
    </SvgContainer>
  );
};

export { MenuIcon };