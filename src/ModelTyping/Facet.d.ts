import { FacetValues } from './FaceValues';

export interface Facet{
  id?: number;
  name?: string;
  color?: string;
  visible?: number;
  values?: FacetValues[];
}
