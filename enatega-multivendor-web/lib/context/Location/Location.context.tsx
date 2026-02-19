import {
  IArea,
  ILocation,
  ILocationContext,
  ILocationProvider,
} from "@/lib/utils/interfaces";
import React, { useContext, useEffect, useRef, useState } from "react";

export const LocationContext = React.createContext({} as ILocationContext);

export const LocationProvider = ({ children }: ILocationProvider) => {
  // State
  const [location, setLocation] = useState<ILocation | null>(null);

  const [cities] = useState<IArea[] | []>([]);

  // Ref
  const isInitialRender = useRef(true);

  // Hooks
  // Effects

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    if (location) localStorage.setItem("location", JSON.stringify(location));
  }, [location]);

  useEffect(() => {
    const locationStr = localStorage.getItem("location");

    if (locationStr && locationStr !== "undefined") {
      setLocation(JSON.parse(locationStr));
    }
  }, []);

  return (
    <LocationContext.Provider value={{ location, setLocation, cities }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => useContext(LocationContext);
