import { ReactNode } from "react";

export interface Props {}

export interface FormRegisterProps {
  onFinish: (val: {}) => void;
  resetPassword?: () => void;
  handlePrevOrNext?: (isNext?: boolean, val?: {}) => void;
  loading?: boolean;
  transaction?: Array;
}

export interface CardConfirmProps {
  header?: ReactNode;
  headerLeft?: ReactNode;
  onClick?: () => void;
  active?: boolean;
}