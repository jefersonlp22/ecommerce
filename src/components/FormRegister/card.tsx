import React from 'react';
import { CardConfirmProps } from './index.d';

const CardConfirm: React.FC<CardConfirmProps> = ({ header, headerLeft, onClick, children, active }) => {
  const hasClick = !!onClick;
  const handleClick = (e: any) => {
    e.preventDefault();

    if (onClick) {
      onClick();
    }
  }
  return (
    <a
      href="return;"
      onClick={handleClick}
      className={`block text-left shadow-md bg-white w-full p-5 rounded-md mb-3 ${active ? 'border' : ''} border-solid border-primary ${!hasClick ? `cursor-default` : ''}`}
    >
      <header className="flex items-center">
        {
          headerLeft && (
            <div className="mr-4 text-xl text-primary">
              {headerLeft}
            </div>
          )
        }
        <h4 className="text-sm text-title flex-1">{header}</h4>
        {
          hasClick && (
            <div className="text-base text-primary">
              <i className="uil uil-pen" />
            </div>
          )
        }
      </header>
      {children && (
        <div className="text-xs text-text-1 pt-3">
          {children}
        </div>
      )}
    </a>
  )
};

export default CardConfirm;
