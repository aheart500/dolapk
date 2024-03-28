const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Admin {
    id: ID!
    name: String!
    username: String!
    password: String!
    img: String
  }
  type Token {
    value: String!
    name: String!
    img: String
    id: ID!
  }
  type Customer {
    name: String!
    phone: String!
    address: String!
  }
  type Price {
    order: Float!
    shipment: Float
  }
  type Order {
    id: ID!
    trackID: Int
    customer: Customer!
    details: String!
    notes: String
    status: String!
    cancelled: Boolean!
    price: Price!
    created_at: String
    updated_at: String
    created_by: String
    updated_by: String
    deliveryType: String
    governorate: String
    product: String
  }
  type Mutation {
    createAdmin(
      username: String!
      password: String!
      name: String!
      img: String
    ): Admin
    editAdmin(
      id: ID!
      username: String
      password: String
      name: String
      img: String
    ): Admin
    deleteAdmin(id: ID!): Admin
    login(username: String!, password: String!): Token
    addOrder(
      customer_name: String!
      customer_phone: String!
      customer_address: String!
      details: String!
      notes: String
      order_price: Float!
      shipment_price: Float
      deliveryType: String
      governorate: String
      product: String
    ): Order
    editOrder(
      id: ID!
      customer_name: String!
      customer_phone: String!
      customer_address: String!
      details: String!
      notes: String
      order_price: Float!
      shipment_price: Float
      deliveryType: String
      governorate: String
      product: String
    ): Order
    updateStatus(
      ids: [ID!]!
      status: String!
      phones: [String!]
      trackIds: [Int!]
    ): String
    cancelOrders(ids: [ID!]!, phones: [String!], trackIds: [Int!]): String
    unCancelOrders(ids: [ID!]!): String
    deleteOrders(ids: [ID!]!): String
    isCurrentlyAdmin(id: ID!): Boolean
  }

  type Query {
    allOrders: [Order!]!

    getAdmins: [Admin!]!
    ordersCount: Int!
    getOrder(id: ID, trackID: Int): Order
    lastOrders(
      limit: Int!
      category: String
      deliveryType: String
      cursor: ID
      search: String
    ): [Order!]!
  }
`;

module.exports = typeDefs;
