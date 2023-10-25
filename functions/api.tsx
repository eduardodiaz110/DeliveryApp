import * as SecureStore from "expo-secure-store";

export const api = async function (query: any) {
  try {
    const savedToken = await SecureStore.getItemAsync("userToken");

    const shop = process.env.EXPO_PUBLIC_API_URL;
    const apiVersion = process.env.EXPO_PUBLIC_API_VERSION;
    const accessToken = process.env.EXPO_PUBLIC_API_ACCESS_TOKEN_SECRET;

    if (!shop || !apiVersion || !accessToken) {
      return;
    }

    const response = await fetch(
      `https://${shop}.myshopify.com/api/${apiVersion}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": accessToken,
        },
        body: JSON.stringify({
          query: query,
        }),
      }
    );

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
