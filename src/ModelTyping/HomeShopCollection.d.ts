import { Collection } from "./Collection";
import { PaginatorInfo } from "./PaginatorInfo";

export interface HomeShopCollection {
  id?: number;
  collection?: Collection;
}

export interface HomeShopCollectionPaginator {
  paginatorInfo?: PaginatorInfo;
  data?: HomeShopCollection[];
}

export interface SlideProps {
  id?: string;
  title?: string;
  description?: string;
  featured_asset?: {
    url?: string;
  };
  link?: string;
}
