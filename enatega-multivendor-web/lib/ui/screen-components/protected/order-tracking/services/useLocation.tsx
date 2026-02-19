"use client";
import { useLocationContext } from "@/lib/context/Location/Location.context";
import { GoogleMapsContext } from "@/lib/context/global/google-maps.context";
import { useCallback, useContext, useEffect, useState } from "react";
import { ILocation } from "@/lib/utils/interfaces/google.map.interface";
import { useUserAddress } from "@/lib/context/address/address.context";
import { onUseLocalStorage } from "@/lib/utils/methods/local-storage";

const DEFAULT_CENTER = { lat: 40.7128, lng: -74.006 };

function useLocation() {
  // Hooks
  const { location, setLocation } = useLocationContext();
  const { userAddress } = useUserAddress();
  const { isLoaded } = useContext(GoogleMapsContext);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [isCheckingCache, setIsCheckingCache] = useState(true);

  const origin = {
    lat: Number(userAddress?.location?.coordinates?.[1]) || DEFAULT_CENTER.lat,
    lng: Number(userAddress?.location?.coordinates?.[0]) || DEFAULT_CENTER.lng,
  };

  const destination = {
    lat: Number(userAddress?.location?.coordinates?.[1]) || DEFAULT_CENTER.lat,
    lng: Number(userAddress?.location?.coordinates?.[0]) || DEFAULT_CENTER.lng,
  };
  const store_user_location_cache_key = `${origin?.lat},${origin?.lng}_${destination?.lat},${destination?.lng}`;

  const directionsCallback = useCallback(
    (result: google.maps.DirectionsResult | null, status: string) => {
      if (status === "OK" && result) {
        setDirections(result);
        onUseLocalStorage(
          "save",
          store_user_location_cache_key,
          JSON.stringify(result)
        );
      } else {
        console.error("Directions request failed due to", status);
      }
    },
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!location) {
      const localStorageLocation = JSON.parse(
        localStorage.getItem("location") || "null"
      ) as ILocation;
      if (localStorageLocation) {
        setLocation(localStorageLocation);
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("orderTrackingRestaurantId");
      }
    };
  }, []);

  return {
    isLoaded,
    origin,
    directions,
    setDirections,
    isCheckingCache,
    setIsCheckingCache,
    destination,
    directionsCallback,
    store_user_location_cache_key,
  };
}

export default useLocation;
