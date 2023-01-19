import { Product } from './Product';
import { Asset } from './Asset';
import { PaginatorInfo } from './PaginatorInfo';

export interface Collection{
  id?: number;
  name?: string;
  description?: string;
  is_root?: number;
  position?: number;
  parent_id?: number;
  enabled?: number;
  condition?: string;
  products?: Product[];
  featured_asset?: Asset;
  facet_values?: FacetValues;
}

export interface Collections{
  paginatorInfor?: PaginatorInfo;
  data: Collection[];
}
