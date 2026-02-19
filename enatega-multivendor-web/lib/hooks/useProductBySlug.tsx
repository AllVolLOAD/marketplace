import { useQuery } from "@apollo/client";
import { PRODUCT_QUERY } from "../api/graphql/queries/products";
import type { Product } from "./useProducts";

export const useProductBySlug = (slug?: string) => {
  const { data, loading, error } = useQuery(PRODUCT_QUERY, {
    variables: { slug },
    skip: !slug,
    fetchPolicy: "network-only",
  });

  return {
    product: (data?.product ?? null) as Product | null,
    loading,
    error,
  };
};
