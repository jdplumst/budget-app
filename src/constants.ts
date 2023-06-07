export const api =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_SERVER_DEV_URL
    : process.env.NEXT_PUBLIC_SERVER_PROD_URL;
