/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { ModalProps } from './types';
import { Container, Close } from './style'
import { Portal } from '../Portal';
import { IconClose } from '../Icons/Close';

const Modal: React.FC<ModalProps> = ({ modalw, onClose, children }) => {
  return (
    <Portal>
      <div
        className="flex justify-center items-center min-h-full sm:py-4 overflow-y-auto animate__animated animate__fadeIn animate__faster"
      >
        <Container w={modalw || 350} className="relative w-full sm:w-auto min-h-full sm:min-h-0 flex flex-col items-center justify-center rounded-none sm:rounded-lg p-4 pt-10 sm:p-8 ">
          <Close type="button" onClick={onClose}><IconClose cursor="pointer" /></Close>
          {children}
        </Container>
      </div>
    </Portal>
  )
};

export { Modal };
