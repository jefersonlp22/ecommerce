export interface PaymentMethodData {
  min_transaction_value: number;
};

export interface TenantData {
  color: any;
  freight_methods: Boolean;
  payment_methods: PaymentMethodData;
  legality_settings?: {
    customer?: {
      mandatory_age: Boolean;
      minimum_age: Number;
    }
  }
};

export interface Tenant {
  id: string;
  name: string;
  picture_url: string;
  data: TenantData;
  typeof_terms: any;
  term_of_use: any;
};
