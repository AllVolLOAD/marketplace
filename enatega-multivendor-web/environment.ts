export default function getEnv(env: "DEV" | "STAGE" | "PROD") {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  const wsServerUrl = process.env.NEXT_PUBLIC_WS_SERVER_URL;

  if (serverUrl && wsServerUrl) {
    return {
      SERVER_URL: serverUrl,
      WS_SERVER_URL: wsServerUrl,
    };
  }

  switch (env) {
    case "DEV":
      return {
        SERVER_URL:
          "https://v1-api-enatega-multivendor-develop.up.railway.app/",
        WS_SERVER_URL:
          "wss://v1-api-enatega-multivendor-develop.up.railway.app/",
      };
    case "STAGE":
      return {
        SERVER_URL: "https://v1-api-enatega-multivendor-stage.up.railway.app/",
        WS_SERVER_URL: "wss://v1-api-enatega-multivendor-stage.up.railway.app/",
      };
    case "PROD":
      return {
        SERVER_URL: "https://enatega-multivendor.up.railway.app/",
        WS_SERVER_URL: "wss://enatega-multivendor.up.railway.app/",
      };
    default:
      return {
        SERVER_URL: "https://enatega-multivendor.up.railway.app/",
        WS_SERVER_URL: "wss://enatega-multivendor.up.railway.app/",

        // SERVER_URL: "http://localhost:8001/",
        // WS_SERVER_URL: "ws://localhost:8001/",
      };
  }
}
