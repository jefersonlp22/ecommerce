/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC } from 'react';
import { Props } from './index.d';

const InputNumber: FC<Props> = ({ value = 0, onChange }) => {

  const handleChange = (add: boolean) => {
    const newValue: number = add ? value + 1 : value - 1;
    onChange(newValue);
  }

  return (
    <div className="relative flex rounded-full max-w-full items-center bg-primary text-white h-10 mb-3">
      <button
        type="button"
        onClick={() => { handleChange(false) }}
        className="absolute h-full pl-2 focus:outline-none text-lg left-0"
      >
        <i className="uil uil-minus" />
      </button>
      <input type="tel" readOnly className="h-full w-full text-center bg-transparent focus:outline-none text-base" value={value} />
      <button
        type="button"
        onClick={() => { handleChange(true) }}
        className="absolute h-full pr-2 focus:outline-none text-lg right-0"
      >
        <i className="uil uil-plus" />
      </button>
    </div>
  )
};

export { InputNumber };
