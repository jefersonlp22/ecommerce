/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Container } from "./index.style";
import { SelectProps, SelectOption } from "./index.d";
const Select: React.FC<SelectProps> = ({ ...props }) => {
  const myRef: any = React.createRef();
  const [open, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<SelectOption>();
  let variantSelected: any = [];
  let variant: any = [];

  const handleClickOutside = (e: any) => {
    if (myRef && !myRef?.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [open]);

  const getLabelSelected = () => {
    if (selected) {
      const option = props.values.find(item => item.id === selected.id);
      if (option) {
        return option.name;
      }
    } else if (props.productSelected) {
      variant = props.values.filter(item => {
        variantSelected = props.productSelected[0].values.filter(
          (value: any) => item.id === value.id
        );
        return variantSelected.length > 0;
      });
      if (variant.length > 0) {
        return variant[0].name;
      }
    }

    return <span className="text-silver-1">Selecione</span>;
  };

  const handleSelect = (option: SelectOption) => {
    props?.setItem(option);
    props?.setVariant(props);
    setSelected(option);
    setOpen(false);
  };

  const renderOptions = () => {
    if (!props.values) {
      return null;
    }
    return props.values.map((option: any, index: any) => {
      const isSelected = option.id === selected?.id;
      return (
        <li className="text-sm" key={index}>
          <button
            type="button"
            onClick={() => handleSelect(option)}
            className={`flex flex-wrap items-center py-5 px-4 sm:p-3 w-full focus:outline-none text-left ${
              isSelected ? "text-primary font-semibold" : ""
            }`}
          >
            <span className="flex-1 pr-3">{option.name}</span>
            {isSelected && (
              <i className="uil uil-check-circle text-xl text-primary" />
            )}
          </button>
        </li>
      );
    });
  };
  return (
    <Container ref={myRef} className="sm:relative max-w-full w-full">
      <button
        onClick={() => setOpen(true)}
        className="w-full p-3 bg-white border rounded flex items-center"
      >
        <div className="flex-1 truncate text-left">
          <label className="block text-text-4 text-xs">{props.name}</label>
          <span className="text-primary max-w-full text-sm">
            {getLabelSelected()}
          </span>
        </div>
        <i className="uil uil-direction text-primary text-2xl -mr-3" />
      </button>
      {open && (
        <div className="fixed overflow-y-auto sm:absolute w-full sm:transform sm:-translate-y-1/2 left-0 top-0 sm:top-auto bg-white z-20 min-h-full max-h-screen border border-silver-2 rounded animate__animated animate__fadeIn animate__faster divide-y divide-silver-2">
          <header className="py-5 px-4 sm:p-3 text-title text-xs text-left flex items-center">
            <h6 className="flex-1">{props.name}</h6>
            <button type="button" onClick={() => setOpen(false)}>
              <i className="uil uil-times text-title text-lg" />
            </button>
          </header>
          <ul className="divide-y divide-silver-2 text-left">
            {renderOptions()}
          </ul>
        </div>
      )}
    </Container>
  );
};

export default Select;
