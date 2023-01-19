import React from 'react';
import { useLayout } from "../../contexts/layout";
import { ButtonClearProps, ButtonContactProps, ButtonProps } from './types';

const ButtonClear: React.FC<ButtonClearProps> = ({ color = 'silver-1', className, onClick, children }) => {
  return (
    <button type="button" onClick={onClick} className={ `${className ?? ''} text-${color} focus:outline-none`}>
      {children}
    </button>
  )
};

const ButtonContact: React.FC<ButtonContactProps> = ({ icon, onClick, children }) => {
  return (
    <button type="button" onClick={onClick} className="w-full flex items-center bg-white p-3 rounded-md mt-3 focus:outline-primary">
      {icon && <i className={`uil uil-${icon} text-2xl text-primary mr-2`}></i>}
      <span className="flex-1 flex flex-wrap text-left">
        <span className="text-text-2 text-sm break-all">{children}</span>
      </span>
      <i className="uil uil-angle-right-b text-2xl text-title"></i>
    </button>
  )
};

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & ButtonProps> = ({ ...props }) => {
  return (
    <button {...props} className={`text-xs uppercase text-white bg-${props.color ?? 'primary'} w-full rounded-full p-3 focus:outline-none ${props.className}`}>
      {props.children}
    </button>
  )
};

const ButtonSecondary: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & ButtonProps> = ({ ...props }) => {
  const layoutContext = useLayout();
  const {tenant} = layoutContext;
  return (
    <button style={{backgroundColor: tenant.data.color.secondary}} {...props} className={`text-xs uppercase text-white w-full rounded-full p-3 focus:outline-none ${props.className}`}>
      {props.children}
    </button>
  )
};

export { ButtonClear, ButtonContact, Button, ButtonSecondary };