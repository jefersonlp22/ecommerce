import { Collections, Collection } from "./Collection";
import { Product } from "./Product";
import { HomeShopSlider } from "./HomeShopSlider";
import { HomeShopCollection } from "./HomeShopCollection";

export interface Catalog {
  collections?: Collections[] | any;
  products?: Product | any;
  currentProductsByCollection?: Product | any;
  selectedProduct?: Product;
  homeShopSlider?: HomeShopSlider;
  homeShopCollection?: HomeShopCollection;
  currentCollection?: Collection | any;
  searchProductName?: string | any;
}
