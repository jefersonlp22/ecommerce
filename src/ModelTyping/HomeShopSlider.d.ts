import { PaginatorInfo } from './PaginatorInfo';
import { Asset } from "./Asset";

export interface HomeShopSlider{
  id?: number;
  title?: string;
  description?: string;
  link?: string;
  featured_asset: Asset;
}

export interface HomeShopSliderPaginator{
  paginatorInfo?: PaginatorInfo;
  data?: HomeShopSlider[];
}
