// lib/paypal.ts

export async function getPayPalAccessToken() {
  const isSandbox = process.env.NODE_ENV !== "production";

  const clientId = isSandbox
    ? process.env.PAYPAL_CLIENT_ID_SANDBOX!
    : process.env.PAYPAL_CLIENT_ID!;
  const secret = isSandbox
    ? process.env.PAYPAL_SECRET_SANDBOX!
    : process.env.PAYPAL_SECRET!;

  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

  const res = await fetch(
    isSandbox
      ? "https://api-m.sandbox.paypal.com/v1/oauth2/token"
      : "https://api-m.paypal.com/v1/oauth2/token",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    }
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Failed to get access token: ${JSON.stringify(data)}`);
  }

  return data.access_token;
}

export async function getOrderDetails(orderId: string) {
  const isSandbox = process.env.NODE_ENV !== "production";
  const accessToken = await getPayPalAccessToken();

  const res = await fetch(
    `${isSandbox
      ? "https://api-m.sandbox.paypal.com"
      : "https://api-m.paypal.com"
    }/v2/checkout/orders/${orderId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Failed to fetch order details: ${JSON.stringify(data)}`);
  }

  return data;
}
