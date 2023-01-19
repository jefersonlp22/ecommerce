import React from 'react';

const Animate: React.FC<{className?: string}> = (props) => {
  return (
    <div {...props} className={`animate__animated animate__fadeIn animate__faster ${props.className}`}>
      {props.children}
    </div>
  )
};

export { Animate };
