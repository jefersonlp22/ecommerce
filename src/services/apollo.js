import ApolloClient from "apollo-boost";

const client = tenantId => {
  const customerExternalId = localStorage.getItem('customer-external-id');
  return(
    new ApolloClient({
      uri: process.env.REACT_APP_API_URL,
      headers: {
        "x-store-external-id": tenantId,
        "x-customer-id": customerExternalId && customerExternalId !== "empty" ? customerExternalId : "",
      }
    })
  )
}


export default client;
