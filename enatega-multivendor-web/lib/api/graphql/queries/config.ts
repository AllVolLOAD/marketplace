import { gql } from "@apollo/client";

export const GET_CONFIG = gql`
  query Configuration {
    configuration {
      currency
      shipping {
        flatRate
        freeFromSubtotal
      }
      tax {
        percent
      }
    }
  }
`;
