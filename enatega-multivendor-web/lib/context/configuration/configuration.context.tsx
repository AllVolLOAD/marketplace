"use client";

import getEnv from "@/environment";
import { ENV } from "@/lib/utils/constants";

// Interfaces
import { IConfigProps } from "@/lib/utils/interfaces";

import { Libraries } from "@react-google-maps/api";

// Core
import React, { ReactNode, useContext } from "react";

const ConfigurationContext = React.createContext({} as IConfigProps);

export const ConfigurationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const configuration = {
    currency: "USD",
    shipping: { flatRate: 0, freeFromSubtotal: 0 },
    tax: { percent: 0 },
  };

  
  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "";
  const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "";
  const AMPLITUDE_API_KEY = "";
  const LIBRARIES = "places,drawing,geometry".split(",") as Libraries;
  const COLORS = {
    GOOGLE: "#000000",
  };
  const SENTRY_DSN = "";
  const SKIP_EMAIL_VERIFICATION = "true";
  const SKIP_MOBILE_VERIFICATION = "true";
  const CURRENCY = configuration.currency;
  const CURRENCY_SYMBOL = configuration.currency === "USD" ? "$" : configuration.currency;
  const DELIVERY_RATE = configuration.shipping?.flatRate ?? 0;
  const COST_TYPE = "flat";
  const TEST_OTP = "";


  const { SERVER_URL } = getEnv(ENV);

  return (
    <ConfigurationContext.Provider
      value={{
        GOOGLE_CLIENT_ID,
        STRIPE_PUBLIC_KEY,
        GOOGLE_MAPS_KEY,
        AMPLITUDE_API_KEY,
        LIBRARIES,
        COLORS,
        SENTRY_DSN,
        SKIP_EMAIL_VERIFICATION,
        SKIP_MOBILE_VERIFICATION,
        CURRENCY,
        CURRENCY_SYMBOL,
        DELIVERY_RATE,
        COST_TYPE,
        TEST_OTP,
        SERVER_URL,
      }}
    >
      {children}
    </ConfigurationContext.Provider>
  );
};
export const ConfigurationConsumer = ConfigurationContext.Consumer;
export const useConfig = () => useContext(ConfigurationContext);
