import { Asset } from "./Asset";

export interface ProductOptionValue {
  id?: number;
  name?: string;
  option?: ProductOption;
}

export interface ProductOption {
  id?: number;
  name?: string;
  values?: ProductOption[];
}

export interface Product {
  id?: string;
  name?: string;
  code?: string;
  description?: string;
  type?: string;
  price: number;
  quantity_items?: number;
  list_price: numnber;
  datasheet?: string;
  enabled?: number;
  published?: number;
  product: any;
  facet_values?: FacetValues[];
  featured_asset?: Asset;
  share_asset?: Asset;
  price_formatted?: number;
  list_price_formatted: number;
  assets?: Asset[];
  options?: ProductOption[];
  variants?: ProductVariant[] | undefined = [];
  updated_at?: string;
  data?: any;
  collections?: {
    id?: string;
    name?: string;
  }[];
}

export interface ProductVariant {
  id?: string;
  name?: string;
  sku?: string;
  enabled?: number;
  ean?: number;
  stock?: number;
  product?: Product;
  type?: string;
  quantity_items?: number | undefined = 0;
  prices?: Price[];
  list_price?: number;
  current_price?: Price;
  price?: number | undefined;
  price_formatted?: string;
  list_price_formatted?: String;
  values?: ProductOptionValue[];
}
