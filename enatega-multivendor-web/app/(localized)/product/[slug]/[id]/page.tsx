'use client'

import { useProductBySlug } from "@/lib/hooks/useProductBySlug";
import { PaddingContainer } from "@/lib/ui/useable-components/containers";
import useUser from "@/lib/hooks/useUser";
import { useConfig } from "@/lib/context/configuration/configuration.context";
import { useParams } from "next/navigation";

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const { product, loading, error } = useProductBySlug(params?.slug);
  const { addItem } = useUser();
  const { CURRENCY_SYMBOL } = useConfig();

  if (loading) {
    return <div className="p-6">Loading product...</div>;
  }
  if (error || !product) {
    return <div className="p-6 text-red-600">Product not found</div>;
  }

  return (
    <div className="w-screen bg-white">
      <PaddingContainer>
        <div className="py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-[4/3] bg-gray-100">
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : null}
          </div>
          <div>
            <h1 className="text-3xl font-semibold">{product.title}</h1>
            <p className="text-gray-600 mt-2">{product.description}</p>
            <div className="mt-4 text-sm text-gray-500">
              {product.categories?.join(", ")}
            </div>
            <div className="mt-6">
              <h2 className="text-lg font-medium mb-2">Variants</h2>
              <div className="space-y-2">
                {product.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="flex items-center justify-between border border-gray-200 rounded px-3 py-2"
                  >
                    <div className="text-sm">
                      {variant.options.size} / {variant.options.color}
                    </div>
                    <div className="text-sm font-medium">
                      {CURRENCY_SYMBOL} {(variant.price / 100).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Stock: {variant.stock}
                    </div>
                    <button
                      type="button"
                      className="ml-3 bg-primary-color text-black text-xs px-3 py-1 rounded-full disabled:opacity-50"
                      disabled={variant.stock < 1}
                      onClick={() =>
                        addItem({
                          variantId: variant.id,
                          productId: product.id,
                          title: product.title,
                          image: product.images?.[0],
                          options: variant.options,
                          price: variant.price / 100,
                          currency: variant.currency,
                          quantity: 1,
                        })
                      }
                    >
                      Add to cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PaddingContainer>
    </div>
  );
}
