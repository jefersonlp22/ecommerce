import { Address } from "./Address";
import { Order } from "./Order";

export interface FormRegisterData {
  name?: string;
  email?: string;
  phone?: string;
  document?: string;
  company_document?: string;
  stateRegistration?: string;
  eventDate?: string,
  delivery_estimate?: string,
  payment_type?: string,
  type?: string,
  password?: string,
  id?: number
  picture_url?: string
  birthday?: string
  company_state_registration?: string
  orders?:[Order]
  created_at?: string
  company_name?: string,
  delivery_type?: string,
  addresses?:[Address],

  dataNf?:{
    nf_name?: string,
    nf_email?: string,
    nf_phone?: string,
    nf_document?: string,
    nf_company_document?: string,
    nf_type?: string,
    nf_company_name?: string,
  }
  address_delivery?: Address,
  freight?: {
    id?: number
    name?: string
    freight_price?: string
    days_to_delivery?: string
    freight_price_formatted?: string
    has_min_amount_free?: boolean
    min_amount_free?: number
    is_free?: boolean
  };

  //address
  postal_code?: string;
  state?: string;
  city?: string;
  district?: string;
  address?: string;
  number?: string;
  complement?: string;
  reference?: string;
  addressee?: string,
  local_reference?: string;
}
