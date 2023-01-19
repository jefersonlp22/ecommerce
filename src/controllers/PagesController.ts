import { isAuthenticated } from "./AuthController";

import Home from "../pages/Home";
import Products from '../pages/Products';
import Product from '../pages/Product';
//ssimport Page404 from "../pages/404";
import Category from "../pages/Category";
import Politics from "../pages/Politics";
import TermOfUse from "../pages/TermOfUse";
import OrderDetail from "../pages/OrderDetail";
import  Orders from "../pages/Orders";


import {
  ROUTE_TENANT_HOME,
  ROUTE_TENANT_CATEGORIES,
  ROUTE_TENANT_PRODUCTS,
  ROUTE_TENANT_PRODUCT,
  ROUTE_TENANT_POLITICS,
  ROUTE_TENANT_TERM_OF_USE,
  ROUTE_TENANT_ORDER_DETAIL,
  ROUTE_TENANT_ORDERS
} from "../constants";

export default [
  {
    path: ROUTE_TENANT_HOME(),
    active: true,
    exact: true,
    type: "public",
    layout: "home",
    component: Home,
  },
  {
    path: ROUTE_TENANT_CATEGORIES(),
    active: true,
    type: "public",
    layout: "home",
    component: Category,
  },
  {
    path: ROUTE_TENANT_PRODUCTS(),
    active: true,
    type: "public",
    layout: "home",
    component: Products,
  },
  {
    path: ROUTE_TENANT_PRODUCT(),
    active: true,
    type: "public",
    layout: "home",
    component: Product,
  },
  {
    path: ROUTE_TENANT_POLITICS(),
    active: true,
    type: "public",
    layout: "home",
    component: Politics,
  },
  {
    path: ROUTE_TENANT_TERM_OF_USE(),
    active: true,
    type: "public",
    layout: "home",
    component: TermOfUse,
  },
  {
    path: ROUTE_TENANT_ORDER_DETAIL(),
    active: true,
    type: "public",
    layout: "home",
    component: OrderDetail,
  },
  {
    path: ROUTE_TENANT_ORDERS(),
    active: true,
    type: isAuthenticated() ? "public" : "private",
    layout: isAuthenticated() ? "home" : "none",
    component: isAuthenticated() ? Orders : Home,
  },
];
