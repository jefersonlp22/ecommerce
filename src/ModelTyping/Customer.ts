import { Address } from "../ModelTyping/Address";
import { Order } from "./Order";
export interface Customer {
    id?: string
    name?: string
    email?: string
    picture_url?: string
    phone?: string
    document?: string
    birthday?: string
    company_name?: string
    company_document?: string
    company_state_registration?: string
    type?: string
    addresses?: [Address]
    orders?:[Order]
    created_at?: string
}