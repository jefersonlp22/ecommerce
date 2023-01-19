/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { ModalRightProps } from "./types";
import { Close, CartContainer } from "./style";
import { Portal } from "../Portal";
import { IconClose } from "../Icons/Close";

const ModalRight: React.FC<ModalRightProps> = ({
  modalw = 385,
  header,
  footer,
  onClose,
  children
}) => {
  return (
    <Portal>
      <CartContainer className="absolute right-0  max-w-screen animate__animated animate__fadeInRight animate__faster">
        <div className="relative bg-white min-h-screen h-screen sm:min-h-0 flex flex-col">
          <header className="flex justify-end items-center py-4 px-6 shadow relative">
            <div className="flex-1">{header ?? null}</div>
            <Close type="button" onClick={onClose}>
              <IconClose cursor="pointer" />
            </Close>
          </header>
          <div className="flex-1 shadow overflow-y-auto">{children}</div>
          {footer ?? null}
        </div>
      </CartContainer>
    </Portal>
  );
};

export { ModalRight };
