import { gql } from "@apollo/client";

export const GET_USER_PROFILE = gql`
  query Profile {
    profile {
      id
      name
      email
      role
    }
  }
`;

// Legacy compatibility for old favourites screens.
export const GET_USER_FAVOURITE = gql`
  query UserFavouriteCompat {
    products(limit: 1, offset: 0) {
      id
    }
  }
`;
