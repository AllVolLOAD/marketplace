"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { PaddingContainer } from "@/lib/ui/useable-components/containers";
import useUser from "@/lib/hooks/useUser";
import { useConfig } from "@/lib/context/configuration/configuration.context";
import useToast from "@/lib/hooks/useToast";

type AddressForm = {
  label: string;
  fullName: string;
  phone: string;
  country: string;
  city: string;
  zip: string;
  line1: string;
  line2: string;
};

export default function OrderCheckoutScreen() {
  const router = useRouter();
  const { cart, clearCart, calculateSubtotal } = useUser();
  const { SERVER_URL, CURRENCY_SYMBOL } = useConfig();
  const { showToast } = useToast();

  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<AddressForm>({
    label: "Home",
    fullName: "",
    phone: "",
    country: "",
    city: "",
    zip: "",
    line1: "",
    line2: "",
  });

  const subtotal = useMemo(() => calculateSubtotal(), [calculateSubtotal]);

  const onChangeAddress = (key: keyof AddressForm, value: string) => {
    setAddress((prev) => ({ ...prev, [key]: value }));
  };

  const onCheckout = async () => {
    if (!cart.length) {
      showToast({
        type: "warn",
        title: "Cart",
        message: "Your cart is empty.",
      });
      return;
    }

    const requiredFields: Array<keyof AddressForm> = [
      "fullName",
      "phone",
      "country",
      "city",
      "zip",
      "line1",
    ];
    const missing = requiredFields.filter((field) => !address[field]?.trim());
    if (missing.length) {
      showToast({
        type: "warn",
        title: "Shipping address",
        message: "Please fill all required shipping fields.",
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showToast({
          type: "warn",
          title: "Login",
          message: "Please login to continue.",
        });
        setLoading(false);
        return;
      }

      const payload = {
        items: cart.map((item) => ({
          variantId: item.variantId,
          qty: item.quantity,
        })),
        couponCode: couponCode || undefined,
        address,
      };

      const response = await fetch(
        `${SERVER_URL}stripe/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error?.message || "Checkout failed");
      }

      const data = await response.json();
      if (data?.url) {
        clearCart();
        window.location.href = data.url;
      } else {
        throw new Error("Checkout URL missing");
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Checkout failed";
      showToast({
        type: "error",
        title: "Checkout",
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen bg-white dark:bg-gray-900 dark:text-gray-100">
      <PaddingContainer>
        <div className="py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <h2 className="text-lg font-semibold mb-4">Shipping address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  className="border rounded px-3 py-2 dark:bg-gray-900"
                  placeholder="Label (Home/Office)"
                  value={address.label}
                  onChange={(e) => onChangeAddress("label", e.target.value)}
                />
                <input
                  className="border rounded px-3 py-2 dark:bg-gray-900"
                  placeholder="Full name*"
                  value={address.fullName}
                  onChange={(e) => onChangeAddress("fullName", e.target.value)}
                />
                <input
                  className="border rounded px-3 py-2 dark:bg-gray-900"
                  placeholder="Phone*"
                  value={address.phone}
                  onChange={(e) => onChangeAddress("phone", e.target.value)}
                />
                <input
                  className="border rounded px-3 py-2 dark:bg-gray-900"
                  placeholder="Country*"
                  value={address.country}
                  onChange={(e) => onChangeAddress("country", e.target.value)}
                />
                <input
                  className="border rounded px-3 py-2 dark:bg-gray-900"
                  placeholder="City*"
                  value={address.city}
                  onChange={(e) => onChangeAddress("city", e.target.value)}
                />
                <input
                  className="border rounded px-3 py-2 dark:bg-gray-900"
                  placeholder="ZIP*"
                  value={address.zip}
                  onChange={(e) => onChangeAddress("zip", e.target.value)}
                />
                <input
                  className="md:col-span-2 border rounded px-3 py-2 dark:bg-gray-900"
                  placeholder="Address line 1*"
                  value={address.line1}
                  onChange={(e) => onChangeAddress("line1", e.target.value)}
                />
                <input
                  className="md:col-span-2 border rounded px-3 py-2 dark:bg-gray-900"
                  placeholder="Address line 2"
                  value={address.line2}
                  onChange={(e) => onChangeAddress("line2", e.target.value)}
                />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <h2 className="text-lg font-semibold mb-3">Promo code</h2>
              <input
                className="border rounded px-3 py-2 w-full dark:bg-gray-900"
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <h2 className="text-lg font-semibold mb-4">Order summary</h2>
              <div className="space-y-2 text-sm">
                {cart.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs text-gray-500">
                        {item.options?.size || "-"} /{" "}
                        {item.options?.color || "-"} × {item.quantity}
                      </div>
                    </div>
                    <div>
                      {CURRENCY_SYMBOL}
                      {(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4 flex items-center justify-between font-semibold">
                <span>Subtotal</span>
                <span>
                  {CURRENCY_SYMBOL}
                  {subtotal}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Taxes and shipping are calculated by the backend during
                checkout.
              </p>
              <button
                className="mt-4 w-full bg-primary-color text-black rounded-full py-2 font-semibold disabled:opacity-60"
                onClick={onCheckout}
                disabled={loading}
              >
                {loading ? "Creating checkout..." : "Proceed to payment"}
              </button>
              <button
                className="mt-3 w-full border rounded-full py-2 text-sm"
                onClick={() => router.push("/")}
              >
                Continue shopping
              </button>
            </div>
          </div>
        </div>
      </PaddingContainer>
    </div>
  );
}
