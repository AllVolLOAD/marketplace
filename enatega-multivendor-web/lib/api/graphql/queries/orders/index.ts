import { gql } from "@apollo/client";

export const MY_ORDERS = gql`
  query MyOrders {
    myOrders {
      id
      status
      amounts {
        subtotal
        discount
        shipping
        tax
        total
        currency
      }
      items {
        titleSnapshot
        optionsSnapshot {
          size
          color
        }
        qty
        unitPrice
      }
      shippingAddress {
        label
        fullName
        phone
        country
        city
        zip
        line1
        line2
      }
    }
  }
`;

export const ORDER = gql`
  query Order($id: ID!) {
    order(id: $id) {
      id
      status
      amounts {
        subtotal
        discount
        shipping
        tax
        total
        currency
      }
      items {
        titleSnapshot
        optionsSnapshot {
          size
          color
        }
        qty
        unitPrice
      }
      shippingAddress {
        label
        fullName
        phone
        country
        city
        zip
        line1
        line2
      }
    }
  }
`;
