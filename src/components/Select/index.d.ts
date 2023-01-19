export interface SelectOption {
  id: number;
  name?: string | any;
}
export interface SelectProps {
  id: any;
  name?: any;
  values: Array<SelectOption>;
  setItem: any;
  setVariant: any;
  productSelected: any;
}
