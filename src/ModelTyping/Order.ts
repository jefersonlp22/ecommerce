import { Product } from "./Product";
import {  Ambassador} from "./Ambassador";
import {  Address} from "./Address";
import { Customer } from "./Customer";

export interface Order {
    id?: number
    code?: number
    channel?: String
    user_id?: number
    customer_id?: number
    user?: any
    external_id?: string
    quantity?: number
    tenant_id?: number
    placed_at?: string
    approved_at?: string
    paid_at?: string
    billed_at?: string
    shipped_at?: string
    delivered_at?: string
    canceled_at?: string
    subtotal?: number
    subtotal_formatted?: string
    discount?: number
    discount_formatted?: string
    delivery_address?: Address
    delivery?: Address 
    shipping?: any
    total?: number
    total_formatted?: string
    items?: any
    shippings?: any
    customer?: Customer
    transactions?: any
    approvals?: any
}