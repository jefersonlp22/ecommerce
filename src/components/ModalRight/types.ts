import { HtmlHTMLAttributes, ReactChildren, ReactNode } from "react";

export interface ModalRightProps {
  modalw?: number; // modal width
  header?: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
}
