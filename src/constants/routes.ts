export const PARAMS_TENANT_ID = "tenantId";
export const PARAMS_PRODUCT_ID = "productId";
export const PARAMS_ORDER_ID = "orderId";


/**
 * se receber tenantId ela retorna a route com o tenantId. Caso não passe o parametro, será retornado a configuração da route.
 * isso funciona da mesma forma para todas a estrutura de route
 * @date 2020-07-14
 * @param {any} tenantId?:string
 * @returns {any} /${tenantId} || /:tenantId
 */
export const ROUTE_TENANT = (tenantId?: string) => `/${tenantId || `:${PARAMS_TENANT_ID}`}`;
export const ROUTE_TENANT_HOME = () => `/`;
export const ROUTE_TENANT_CATEGORIES = () => `/categorias`;
export const ROUTE_TENANT_PRODUCT = (productId?: string) => `/produto/${productId || `:${PARAMS_PRODUCT_ID}`}`;
export const ROUTE_TENANT_PRODUCTS = () => `/produtos`;
export const ROUTE_TENANT_POLITICS = () => `/politica`;
export const ROUTE_TENANT_TERM_OF_USE = () => `/termos`;
export const ROUTE_TENANT_ORDER_DETAIL = () => `/pedido`;
export const ROUTE_TENANT_ORDERS = () => `/pedidos`;

