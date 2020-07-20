import { gql } from "apollo-boost";

const PERSON_DETALIS = gql`
  fragment allFields on Order {
    id
    customer {
      name
      phone
      address
    }
    details
    notes
    price {
      order
      shipment
    }
    status
    cancelled
    trackID
    created_by
    updated_by
    created_at
    updated_at
  }
`;

export const GET_ORDER = gql`
  query order($id: ID, $trackID: Int) {
    getOrder(id: $id, trackID: $trackID) {
      ...allFields
    }
  }
  ${PERSON_DETALIS}
`;
export const GET_ORDER_SENSETIVE = gql`
  query order($id: ID, $trackID: Int) {
    getOrder(id: $id, trackID: $trackID) {
      details
      notes
      price {
        order
        shipment
      }
      customer {
        name
      }
      status
      cancelled
      trackID
    }
  }
`;

export const LAST_ORDERS = gql`
  query lastOrders(
    $limit: Int!
    $cursor: ID
    $search: String
    $category: String
  ) {
    lastOrders(
      limit: $limit
      cursor: $cursor
      search: $search
      category: $category
    ) {
      ...allFields
    }
  }
  ${PERSON_DETALIS}
`;

export const ADD_ORDER = gql`
  mutation addOrder(
    $customer_name: String!
    $customer_phone: String!
    $customer_address: String!
    $details: String!
    $notes: String
    $order_price: Float!
    $shipment_price: Float
  ) {
    addOrder(
      customer_name: $customer_name
      customer_phone: $customer_phone
      customer_address: $customer_address
      details: $details
      notes: $notes
      order_price: $order_price
      shipment_price: $shipment_price
    ) {
      id
    }
  }
`;

export const EDIT_ORDER = gql`
  mutation editOrder(
    $id: ID!
    $customer_name: String!
    $customer_phone: String!
    $customer_address: String!
    $details: String!
    $notes: String
    $order_price: Float!
    $shipment_price: Float
  ) {
    editOrder(
      id: $id
      customer_name: $customer_name
      customer_phone: $customer_phone
      customer_address: $customer_address
      details: $details
      notes: $notes
      order_price: $order_price
      shipment_price: $shipment_price
    ) {
      ...allFields
    }
  }
  ${PERSON_DETALIS}
`;

export const UPDATE_ORDERS = gql`
  mutation UpdateStatus(
    $ids: [ID!]!
    $status: String!
    $phones: [String!]
    $trackIds: [Int!]
  ) {
    updateStatus(
      ids: $ids
      status: $status
      phones: $phones
      trackIds: $trackIds
    )
  }
`;

export const CANCEL_ORDERS = gql`
  mutation cancelOrders($ids: [ID!]!, $phones: [String!], $trackIds: [Int!]) {
    cancelOrders(ids: $ids, phones: $phones, trackIds: $trackIds)
  }
`;
export const UNCANCEL_ORDERS = gql`
  mutation unCancelOrders($ids: [ID!]!) {
    unCancelOrders(ids: $ids)
  }
`;

export const DELETE_ORDERS = gql`
  mutation deleteOrders($ids: [ID!]!) {
    deleteOrders(ids: $ids)
  }
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
      name
      img
    }
  }
`;
export const CREATE_ADMIN = gql`
  mutation createAdmin(
    $username: String!
    $password: string!
    $name: String!
    $img: String
  ) {
    createAdmin(
      username: $username
      password: $password
      name: $name
      img: $img
    ) {
      name
      username
    }
  }
`;
