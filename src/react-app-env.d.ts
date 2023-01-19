/// <reference types="react-scripts" />
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    PUBLIC_URL: string;
    REACT_APP_API_URL: string;
    REACT_APP_S3_URL: string;
    REACT_APP_SANDBOX_S3_URL: string;
    REACT_APP_INVOICE: string;
  }
}
