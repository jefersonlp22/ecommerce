import React, { createContext, useContext, useState, useEffect } from "react";
import { LayoutProps } from "./layout.props";
import { menuItemsMock } from "../mocks";
import { MenuItems } from "../ModelTyping/Menu";
import { Product } from "../ModelTyping/Product";
import { Cart } from "../ModelTyping/Cart";
import { objectIsEqual } from "../utils";
import { FormRegisterData as FormRegisterDataTypes } from "../ModelTyping/FormRegister";
import { Catalog as CatalogTypes } from "../ModelTyping/Catalog";
import { Order as OrderTypes} from "../ModelTyping/Order";
import { Customer as CustomerTypes} from "../ModelTyping/Customer";
import { Ambassador } from "../ModelTyping/Ambassador";
import { Tenant } from "../ModelTyping/Tenant";

function useProviderLayout(
  externalId: string,
  storageKey: string
): LayoutProps {
  // me
  const [ambassador, setAmbassador] = useState<Ambassador>();
  const [tenant, setTenant] = useState<Tenant>();
  // menu
  const [menuSelected, setMenuSelected] = useState<number | string | undefined>(
    undefined
  );
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [menuItems, setMenuItems] = useState<Array<MenuItems>>(menuItemsMock);
  // cart
  //const [cart, setCart] = useState<Carts>();
  const [cartItems, setCartItems] = useState<Array<Cart>>([]);

  const [cartOpen, setCartOpen] = useState<boolean>(false);
  // form register
  const [formRegisterData, setFormRegisterData] = useState<
    FormRegisterDataTypes
  >();
  const [formRegisterOpen, setFormRegisterOpen] = useState<boolean>(false);
  const [formRegisterStep, setFormRegisterStep] = useState<number>(1);
  const [discount, setDiscount] = useState<number>(0);
  const [formRegisterIsEditing, setFormRegisterIsEditing] = useState<boolean>(
    false
  );
  let storageCustomer = storageKey + 'customer'
  const [customer, setCustomer] = useState<CustomerTypes>(null);
  const [orderDetail, setOrderDetail] = useState<OrderTypes>();
  // catalog
  const [catalog, setCatalog] = useState<CatalogTypes>();
  // console.log("catolog", catalog);

  const [external, setExternal] = useState(externalId);

  const handleCustomer = (data: any) => {
    localStorage.setItem(storageCustomer, JSON.stringify(data));
    localStorage.setItem('store_access_token', JSON.stringify(data.auth_token));
    setCustomer(data)
  }

  const logout = () => {
    localStorage.removeItem(`${storageCustomer}`)
    localStorage.removeItem('store_access_token')
    localStorage.removeItem(`${storageKey}`)

    setCustomer(null)
    setFormRegisterStep(1)
  }
      // useEffect(() => {
  //   if (customer) {
  //     setOrderDetail(customer.orders[customer.orders.length - 1])
  //   }
  // }, [customer]);

  // @todo split other state
  useEffect(() => {
    const cartFromLocalStorage = localStorage.getItem(storageKey);
    const cartParsed = cartFromLocalStorage && JSON.parse(cartFromLocalStorage);
    cartParsed && setCartItems(cartParsed);

    const customerLocalStorage = localStorage.getItem(storageCustomer);
    const customerParsed:CustomerTypes = customerLocalStorage && JSON.parse(customerLocalStorage);
    customerParsed && setCustomer(customerParsed);
  }, [storageKey, storageCustomer]);

  const cartStorage = (data: any) => {
    localStorage.setItem(storageKey, JSON.stringify(data));
  };

  const cartReset = () => {
    cartStorage([]);
    setCartItems([]);
    setFormRegisterData(undefined);
  };

  const addCartItems = (product: Product) => {
    const itemIndex = cartItems?.findIndex((item: Cart) =>
      objectIsEqual(
        {
          id: product.id
        },
        {
          id: item.product?.id
        }
      )
    );

    const cart: Array<any> = [...cartItems];

    if (itemIndex > -1) {
      cart[itemIndex].qty += 1;
    } else {
      cart.push({ qty: 1, product });
    }
    setCartItems(cart);
    cartStorage(cart);
  };

  const changeQtyCartItem = (value: number, index: number) => {
    const newValue = [...cartItems];

    value <= 0 ? newValue.splice(index, 1) : (newValue[index].qty = value);

    setCartItems(newValue);
    cartStorage(newValue);
  };

  const formReset = () => {
    setCartItems([]);
    setFormRegisterData(undefined);
    setFormRegisterOpen(false);
    setFormRegisterStep(1);
    setFormRegisterIsEditing(false);
  };

  return {
    ambassador,
    tenant,
    menuSelected,
    menuOpen,
    menuItems,
    cartItems,
    cartOpen,
    formRegisterData,
    formRegisterOpen,
    formRegisterStep,
    formRegisterIsEditing,
    catalog,
    external,
    storageKey,
    customer,
    orderDetail,
    discount,

    // functions
    setAmbassador,
    setTenant,
    setMenuSelected,
    setMenuOpen,
    setMenuItems,
    setCartOpen,
    addCartItems,
    changeQtyCartItem,
    setFormRegisterData,
    setFormRegisterOpen,
    setFormRegisterStep,
    setFormRegisterIsEditing,
    formReset,
    setCatalog,
    setExternal,
    cartReset,
    handleCustomer,
    setOrderDetail,
    setCustomer,
    logout,
    setDiscount,
    setCartItems,
  };
}

// const layoutContext = createContext({} as LayoutProps);
const layoutContext = createContext<Partial<LayoutProps>>({});

export const useLayout = () => {
  return useContext(layoutContext);
};

export const ProviderLayout = ({ external, storageKey, children }) => {
  const layout: LayoutProps = useProviderLayout(external, storageKey);
  return (
    <layoutContext.Provider value={layout}>{children}</layoutContext.Provider>
  );
};
