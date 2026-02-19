'use client'

import Link from "next/link";
import { PaddingContainer } from "../../useable-components/containers";
import { useProducts } from "@/lib/hooks/useProducts";

const Storefront = () => {
  const { products, loading, error } = useProducts();
  const displayedProducts = products.slice(0, 3);

  return (
    <div className="w-screen bg-white">
      <div className="border-b border-gray-200">
        <PaddingContainer>
          <div className="py-10">
            <h1 className="text-3xl font-semibold tracking-tight">Apparel Store</h1>
            <p className="text-gray-600 mt-2">Browse products and variants.</p>
          </div>
        </PaddingContainer>
      </div>

      <PaddingContainer>
        <div className="py-8">
          {loading && <div className="text-gray-500">Loading products...</div>}
          {error && <div className="text-red-600">Failed to load products</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}/${product.id}`}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-[4/3] bg-gray-100">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="font-medium text-gray-900">{product.title}</div>
                  <div className="text-sm text-gray-600 line-clamp-2">
                    {product.description}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {product.categories?.join(", ") || "Apparel"}
                  </div>
                </div>
              </Link>
            ))}
            {!loading && !displayedProducts.length && !error && (
              <div className="col-span-full text-center text-gray-500">
                No products yet.
              </div>
            )}
          </div>
        </div>
      </PaddingContainer>
    </div>
  );
};

export default Storefront;
