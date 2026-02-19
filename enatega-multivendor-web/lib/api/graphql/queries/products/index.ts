import { gql } from "@apollo/client";

export const PRODUCTS_QUERY = gql`
  query Products($limit: Int, $offset: Int, $category: String, $tag: String, $q: String) {
    products(limit: $limit, offset: $offset, category: $category, tag: $tag, q: $q) {
      id
      title
      description
      slug
      images
      categories
      tags
      variants {
        id
        sku
        price
        currency
        stock
        options {
          size
          color
        }
      }
    }
  }
`;

export const PRODUCT_QUERY = gql`
  query Product($slug: String!) {
    product(slug: $slug) {
      id
      title
      description
      slug
      images
      categories
      tags
      variants {
        id
        sku
        price
        currency
        stock
        options {
          size
          color
        }
      }
    }
  }
`;
