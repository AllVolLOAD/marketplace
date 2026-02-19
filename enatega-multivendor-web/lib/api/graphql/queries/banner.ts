import { gql } from "@apollo/client";

// Legacy compatibility for discovery banner widgets.
export const GET_BANNERS = gql`
  query BannersCompat {
    products(limit: 0, offset: 0) {
      id
    }
  }
`;
