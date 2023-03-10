import { MenuItems } from "../ModelTyping/Menu";
import { Cart } from "../ModelTyping/Cart";
import { Product } from "../ModelTyping/Product";
import { FormRegisterData as FormRegisterDataTypes } from "../ModelTyping/FormRegister";
import { Catalog } from "../ModelTyping/Catalog";
import { Ambassador } from "../ModelTyping/Ambassador";
import { Tenant } from "../ModelTyping/Tenant";
import { Order } from "../ModelTyping/Order";

export interface LayoutProps {
  ambassador?: Ambassador;
  tenant?: Tenant;
  menuSelected?: number | string;
  menuOpen?: boolean;
  menuItems?: Array<MenuItems>;
  cartItems?: Array<Cart>;
  cartOpen?: boolean;
  formRegisterData?: FormRegisterDataTypes;
  formRegisterOpen?: boolean;
  formRegisterStep?: number;
  formRegisterIsEditing?: boolean;
  catalog?: Catalog;
  external?: string;
  storageKey?: string;
  customer?: any;
  orderDetail?: Order;
  discount?: any;
  setAmbassador?: (value: Ambassador) => void;
  setTenant?: (value: Tenant) => void;
  setMenuSelected?: (value?: number | string) => void;
  setMenuOpen?: (value: boolean) => void;
  setMenuItems?: (value: Array<MenuItems>) => void;
  setCartOpen?: (value: boolean) => void;
  addCartItems?: (product: Product, options: any) => void;
  changeQtyCartItem?: (value: number, index: number) => void;
  setFormRegisterData?: (value: FormRegisterDataTypes) => void;
  setFormRegisterOpen?: (value: boolean) => void;
  setFormRegisterStep?: (value: number) => void;
  setFormRegisterIsEditing?: (value: boolean) => void;
  formReset?: () => void;
  setCatalog?: (value: Catalog) => void;
  setExternal?: (value: string) => void;
  cartReset?: () => void;
  handleCustomer?: (value: any) => void;
  setCustomer?: (value : any) => void;
  setOrderDetail?: (value : Order) => void;
  logout?: () => void;
  setDiscount?: (value: any) => void;
  setCartItems?: (value: any) => void;
 }
