"use client";

import { useContext, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { GoogleMap, Marker } from "@react-google-maps/api";

import { PaddingContainer } from "@/lib/ui/useable-components/containers";
import { GoogleMapsContext } from "@/lib/context/global/google-maps.context";
import { useUserAddress } from "@/lib/context/address/address.context";
import { useConfig } from "@/lib/context/configuration/configuration.context";

interface IOrderTrackingScreenProps {
  orderId: string;
}

type Stage = {
  key: string;
  label: string;
  position: { lat: number; lng: number };
};

const DEFAULT_CENTER = { lat: 40.7128, lng: -74.006 };

function buildStages(destination: { lat: number; lng: number }): Stage[] {
  return [
    {
      key: "created",
      label: "Order placed",
      position: { lat: destination.lat + 0.04, lng: destination.lng - 0.02 },
    },
    {
      key: "warehouse",
      label: "Warehouse processed",
      position: { lat: destination.lat + 0.03, lng: destination.lng - 0.01 },
    },
    {
      key: "carrier_hub",
      label: "Carrier hub",
      position: { lat: destination.lat + 0.02, lng: destination.lng },
    },
    {
      key: "out_for_delivery",
      label: "Out for delivery",
      position: { lat: destination.lat + 0.01, lng: destination.lng + 0.01 },
    },
    {
      key: "delivered",
      label: "Delivered",
      position: destination,
    },
  ];
}

export default function OrderTrackingScreen({
  orderId,
}: IOrderTrackingScreenProps) {
  const { isLoaded } = useContext(GoogleMapsContext);
  const { GOOGLE_MAPS_KEY } = useConfig();
  const searchParams = useSearchParams();
  const { userAddress } = useUserAddress();

  const destination = useMemo(() => {
    const coords = userAddress?.location?.coordinates;
    if (coords?.length === 2) {
      return { lat: Number(coords[1]), lng: Number(coords[0]) };
    }
    return DEFAULT_CENTER;
  }, [userAddress?.location?.coordinates]);

  const stages = useMemo(() => buildStages(destination), [destination]);

  const currentStageIndex = useMemo(() => {
    const raw = Number(searchParams.get("stage"));
    if (Number.isFinite(raw) && raw >= 0) {
      return Math.min(raw, stages.length - 1);
    }
    return 1;
  }, [searchParams, stages.length]);

  return (
    <div className="w-screen h-full flex flex-col pb-20 dark:bg-gray-900 dark:text-gray-100">
      <div className="scrollable-container flex-1">
        <div className="h-[360px] w-full">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={destination}
              zoom={11}
              options={{
                disableDefaultUI: true,
                zoomControl: true,
              }}
            >
              {stages.map((stage, index) => (
                <Marker
                  key={stage.key}
                  position={stage.position}
                  label={`${index + 1}`}
                />
              ))}
            </GoogleMap>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500">
              {GOOGLE_MAPS_KEY
                ? "Map is loading..."
                : "Add GOOGLE_MAPS_KEY to enable the map."}
            </div>
          )}
        </div>

        <div className="mt-8 md:mt-10">
          <PaddingContainer>
            <div className="mb-6">
              <h1 className="text-xl font-semibold">Order tracking</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Order {orderId}. Stages update as the shipment moves between
                hubs. No real-time GPS.
              </p>
            </div>

            <div className="grid gap-3">
              {stages.map((stage, index) => {
                const isDone = index < currentStageIndex;
                const isActive = index === currentStageIndex;
                return (
                  <div
                    key={stage.key}
                    className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
                      isActive
                        ? "border-primary-color bg-primary-color/10"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                          isDone
                            ? "bg-green-500 text-white"
                            : isActive
                              ? "bg-primary-color text-black"
                              : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{stage.label}</div>
                        <div className="text-xs text-gray-500">
                          {isDone
                            ? "Completed"
                            : isActive
                              ? "In progress"
                              : "Pending"}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {stage.position.lat.toFixed(3)},{stage.position.lng.toFixed(3)}
                    </div>
                  </div>
                );
              })}
            </div>
          </PaddingContainer>
        </div>
      </div>
    </div>
  );
}
