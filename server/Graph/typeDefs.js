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
  }
  type Mutation {
    createAdmin(
      username: String!
      password: String!
      name: String!
      img: String
    ): Admin
    login(username: String!, password: String!): Token
    addOrder(
      customer_name: String!
      customer_phone: String!
      customer_address: String!
      details: String!
      notes: String
      order_price: Float!
      shipment_price: Float
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
    ): Order
    updateStatus(ids: [ID!]!, status: String!): String
    cancelOrders(ids: [ID!]!): String
    unCancelOrders(ids: [ID!]!): String

    deleteOrders(ids: [ID!]!): String
  }

  type Query {
    allOrders: [Order!]!
    ordersCount: Int!
    getOrder(id: ID, trackID: Int): Order
    lastOrders(
      limit: Int!
      category: String
      cursor: ID
      search: String
    ): [Order!]!
  }
`;

module.exports = typeDefs;
