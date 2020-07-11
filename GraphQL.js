import gql from "graphql-tag";

export const GET_ORDER = gql`
  query getOrder($id: ID, $trackID: Int) {
    id
    customer {
      name
      phone
      address
    }
    details
    notes
    price
    finished
    cancelled
    shipped
    trackID
    created_by
    updated_by
  }
`;

export const ALL_ORDERS = gql`
  query {
    allOrders {
      id
      customer {
        name
        phone
        address
      }
      details
      notes
      price
      finished
      cancelled
      shipped
      trackID
      created_by
      updated_by
    }
  }
`;

export const LAST_ORDERS = gql`
  query lastOrders($limit: Int!, $cursor: ID, $search: String) {
    lastOrders(limit: $limit, cursor: $cursor, search: $search) {
      id
      customer {
        name
        phone
        address
      }
      details
      notes
      price
      finished
      cancelled
      shipped
      trackID
      created_by
      updated_by
    }
  }
`;

export const LAST_WAITING_ORDERS = gql`
  query lastWaitingOrders($limit: Int!, $cursor: ID, $search: String) {
    lastWaitingOrders(limit: $limit, cursor: $cursor, search: $search) {
      id
      customer {
        name
        phone
        address
      }
      details
      notes
      price
      finished
      cancelled
      shipped
      trackID
      created_by
      updated_by
    }
  }
`;

export const LAST_FINISHED_ORDERS = gql`
  query lastFinsiedOrders($limit: Int!, $cursor: ID, $search: String) {
    lastFinsiedOrders(limit: $limit, cursor: $cursor, search: $search) {
      id
      customer {
        name
        phone
        address
      }
      details
      notes
      price
      finished
      cancelled
      shipped
      trackID
      created_by
      updated_by
    }
  }
`;

export const LAST_CANCELLED_ORDERS = gql`
  query lastCancelledOrders($limit: Int!, $cursor: ID, $search: String) {
    lastCancelledOrders(limit: $limit, cursor: $cursor, search: $search) {
      id
      customer {
        name
        phone
        address
      }
      details
      notes
      price
      finished
      cancelled
      shipped
      trackID
      created_by
      updated_by
    }
  }
`;

export const FINISH_ORDER = gql`
  mutation finishOrder($id: ID, $trackID: Int) {
    finishOrder(id: $id, trackID: $trackID)
  }
`;
export const UNFINISH_ORDER = gql`
  mutation unfinishOrder($id: ID!) {
    unFinishOrder(id: $id)
  }
`;
export const CANCEL_ORDER = gql`
  mutation cancelOrder($id: ID!) {
    cancelOrder(id: $id)
  }
`;
export const UNCANCEL_ORDER = gql`
  mutation UnCancelOrder($id: ID!) {
    UnCancelOrder(id: $id)
  }
`;
export const DELETE_ORDER = gql`
  mutation deleteOrder($id: ID!) {
    deleteOrder(id: $id)
  }
`;

export const ADD_ORDER = gql`
  mutation addOrder(
    $customer_name: String!
    $customer_phone: String!
    $customer_address: String!
    $details: String!
    $notes: String
    $price: Float!
    $created_by: String!
  ) {
    addOrder(
      customer_name: $customer_name
      customer_phone: $customer_phone
      customer_address: $customer_address
      details: $details
      notes: $notes
      price: $price
      created_by: $created_by
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
    $price: Float!
    $updated_by: String!
  ) {
    editOrder(
      id: $id
      customer_name: $customer_name
      customer_phone: $customer_phone
      customer_address: $customer_address
      details: $details
      notes: $notes
      price: $price
      updated_by: $updated_by
    ) {
      id
      customer {
        name
        phone
        address
      }
      details
      notes
      price
      finished
      cancelled
      shipped
      trackID
      created_by
      updated_by
    }
  }
`;

const FINISH_ORDERS = gql`
  mutation finishOrders($ids: [ID!]!) {
    finishOrders(ids: $ids)
  }
`;
const UNFINISH_ORDERS = gql`
  mutation unFinishOrders($ids: [ID!]!) {
    unFinishOrders(ids: $ids)
  }
`;
const CANCEL_ORDERS = gql`
  mutation cancelOrders($ids: [ID!]!) {
    cancelOrders(ids: $ids)
  }
`;
const UNCANCEL_ORDERS = gql`
  mutation unCancelOrders($ids: [ID!]!) {
    unCancelOrders(ids: $ids)
  }
`;
const SHIP_ORDERS = gql`
  mutation shipOrders($ids: [ID!]!) {
    shipOrders(ids: $ids)
  }
`;
const UNSHIP_ORDERS = gql`
  mutation unShipOrders($ids: [ID!]!) {
    unShipOrders(ids: $ids)
  }
`;
const DELETE_ORDERS = gql`
  mutation deleteOrders($ids: [ID!]!) {
    deleteOrders(ids: $ids)
  }
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
      name
    }
  }
`;
export const CREATE_ADMIN = gql`
  mutation createAdmin($username: String!, $password: string!, $name: String!) {
    createAdmin(username: $username, password: $password, name: $name) {
      name
      username
    }
  }
`;