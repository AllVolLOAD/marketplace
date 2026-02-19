"use client";

import { useQuery } from "@apollo/client";
import { useTranslations } from "next-intl";

import { MY_ORDERS } from "@/lib/api/graphql/queries/orders";
import { PaddingContainer } from "@/lib/ui/useable-components/containers";

type OrderItem = {
  titleSnapshot: string;
  optionsSnapshot: { size: string; color: string };
  qty: number;
  unitPrice: number;
};

type Order = {
  id: string;
  status: string;
  amounts: {
    total: number;
    currency: string;
  };
  items: OrderItem[];
};

export default function OrderHistoryScreen() {
  const t = useTranslations();
  const { data, loading, error } = useQuery(MY_ORDERS);

  if (loading) {
    return (
      <div className="p-6 text-gray-500">{t("loading_orders")}</div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600">
        {error.message || "Failed to load orders"}
      </div>
    );
  }

  const orders: Order[] = data?.myOrders ?? [];

  return (
    <PaddingContainer>
      <div className="py-10 space-y-4">
        <h1 className="text-2xl font-semibold">
          {t("ProfileSection.order_history")}
        </h1>
        {orders.length === 0 ? (
          <div className="text-gray-500">{t("no_orders_yet")}</div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800"
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium">
                    Order #{order.id.slice(-6)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.status}
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  {order.items.length} items
                </div>
                <div className="mt-3 text-sm">
                  {order.items.slice(0, 2).map((item, index) => (
                    <div key={`${order.id}-${index}`}>
                      {item.titleSnapshot} • {item.optionsSnapshot.size}/
                      {item.optionsSnapshot.color} × {item.qty}
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <div className="text-xs text-gray-400">
                      +{order.items.length - 2} more
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between font-semibold">
                  <span>Total</span>
                  <span>
                    {order.amounts.currency}{" "}
                    {(order.amounts.total / 100).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PaddingContainer>
  );
}
