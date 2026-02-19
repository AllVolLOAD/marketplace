"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useTranslations } from "next-intl";

import useUser from "@/lib/hooks/useUser";
import { useConfig } from "@/lib/context/configuration/configuration.context";

interface CartProps {
  onClose?: () => void;
}

export default function Cart({ onClose }: CartProps) {
  const {
    clearCart,
    cart,
    cartCount,
    updateItemQuantity,
    calculateSubtotal,
    deleteItem,
  } = useUser();
  const { CURRENCY_SYMBOL } = useConfig();
  const router = useRouter();
  const t = useTranslations();

  if (cart.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="text-center">
          <h2 className="font-inter font-semibold text-xl text-gray-900 dark:text-gray-100 mb-2">
            {t("your_cart_is_empty")}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {t("add_items_to_cart_to_continue")}
          </p>
          <button
            onClick={async () => {
              if (onClose) {
                await onClose();
              }
              await new Promise((resolve) => setTimeout(resolve, 300));
              router.push("/", { scroll: true });
            }}
            className="bg-primary-color text-black px-6 py-2 rounded-full font-medium"
            type="button"
          >
            {t("browse_restaurant")}
          </button>
        </div>
      </div>
    );
  }

  const formattedSubtotal = `${CURRENCY_SYMBOL}${calculateSubtotal()}`;

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 dark:text-white relative">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="font-inter font-semibold text-xl text-gray-900 dark:text-white">
          {t("your_order_label")}
        </h2>
        <span className="text-gray-500 dark:text-white text-sm">
          {cartCount} {cartCount === 1 ? t("item_label") : t("items_label")}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {cart.map((item) => (
            <div
              key={item.key}
              className="flex sm:flex-row sm:items-center bg-white dark:bg-gray-800 dark:text-white rounded-lg p-3 shadow-sm dark:shadow-gray-700"
            >
              <div className="flex-grow">
                <div className="flex sm:flex-row flex-col sm:items-center gap-4">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-28 h-28 object-cover rounded-md mb-2"
                    />
                  ) : (
                    <div className="w-28 h-28 bg-gray-100 rounded-md mb-2" />
                  )}
                  <div>
                    <h3 className="font-inter font-semibold text-sm text-gray-700 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-300">
                      {item.options?.size || "-"} / {item.options?.color || "-"}
                    </p>
                    <p className="text-secondary-color font-semibold text-sm">
                      {CURRENCY_SYMBOL}
                      {item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    updateItemQuantity(item.key, -1);
                  }}
                  className="bg-gray-200 text-gray-600 rounded-full w-6 h-6 flex items-center justify-center"
                  type="button"
                >
                  <FontAwesomeIcon icon={faMinus} size="xs" />
                </button>

                <span className="text-gray-900 dark:text-white w-6 text-center">
                  {item.quantity}
                </span>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    updateItemQuantity(item.key, 1);
                  }}
                  className="bg-secondary-color text-white rounded-full w-6 h-6 flex items-center justify-center"
                  type="button"
                >
                  <FontAwesomeIcon icon={faPlus} size="xs" />
                </button>

                <button
                  onClick={() => deleteItem(item.key)}
                  className="ml-3 text-red-500 hover:text-red-600"
                  type="button"
                >
                  <FontAwesomeIcon icon={faTrash} size="xs" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 flex flex-col justify-center items-center border-t bg-white dark:bg-gray-800">
        <button
          className="flex justify-between items-center w-full bg-primary-color text-black rounded-full px-4 py-3"
          onClick={() => {
            router.push("/order/checkout");
            if (onClose) onClose();
          }}
          type="button"
        >
          <div className="flex items-center">
            <span className="bg-black text-primary-color rounded-full w-6 h-6 flex items-center justify-center mr-2 rtl:ml-2 text-sm font-medium">
              {cartCount}
            </span>
            <span className="text-black text-base font-medium">
              {t("go_to_checkout_label")}
            </span>
          </div>
          <span className="text-black text-base font-medium">
            {formattedSubtotal}
          </span>
        </button>

        <button
          onClick={clearCart}
          className="mt-3 w-full flex items-center justify-center gap-2 rounded-full px-4 py-3 border border-red-500 text-red-500 hover:bg-red-50 dark:hover:border-red-700 dark:hover:bg-inherit transition-colors"
          type="button"
        >
          <span className="text-base font-medium">
            {t("clear_cart_button")}
          </span>
        </button>
      </div>
    </div>
  );
}
