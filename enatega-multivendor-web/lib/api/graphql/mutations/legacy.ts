import { gql } from "@apollo/client";

// Legacy compatibility for old order tracking widgets.
export const ABORT_ORDER = gql`
  mutation AbortOrderCompat($id: ID!) {
    __typename
  }
`;
