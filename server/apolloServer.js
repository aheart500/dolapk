const { gql, ApolloServer } = require("apollo-server-express");
const OrderModel = require("./models/order");
const order = require("./models/order");

const typeDefs = gql`
  type Customer {
    name: String!
    phone: String!
    address: String!
  }
  type Order {
    id: ID!
    customer: Customer!
    details: String!
    notes: String!
    finished: Boolean!
    cancelled: Boolean!
    price: Float!
  }
  type Mutation {
    addOrder(
      customer_name: String!
      customer_phone: String!
      customer_address: String!
      details: String!
      notes: String
      price: Float!
    ): Order
    editOrder(
      id: ID!
      customer_name: String!
      customer_phone: String!
      customer_address: String!
      details: String!
      notes: String
      price: Float!
    ): Order
    finishOrder(id: ID!): String
    cancelOrder(id: ID!): String
    unFinishOrder(id: ID!): String
    UnCancelOrder(id: ID!): String
    deleteOrder(id: ID!): String
  }

  type Query {
    allOrders: [Order!]!
    finishedOrders: [Order!]!
    cancelledOrders: [Order!]!
    waitingOrders: [Order!]!
    ordersCount: Int!
    finishedOrdersCount: Int!
    waitingOrdersCount: Int!
    cancelledOrdersCount: Int!
    getOrder(id: ID!): Order
    lastOrders(limit: Int!): [Order!]!
    lastFinsiedOrders(limit: Int!): [Order!]!
    lastWaitingOrders(limit: Int!): [Order!]!
    lastCancelledOrders(limit: Int!): [Order!]!
    scrollOrders(cursor: ID!, limit: Int!): [Order!]!
    scrollFinishedOrders(cursor: ID!, limit: Int!): [Order!]!
    scrollWaitingOrders(cursor: ID!, limit: Int!): [Order!]!
    scrollCancelledOrders(cursor: ID!, limit: Int!): [Order!]!
  }
`;

const resolvers = {
  Query: {
    allOrders: () => OrderModel.find({}).sort("-_id"),
    lastOrders: async (root, args) =>
      await OrderModel.find({}).limit(args.limit).sort("-_id"),
    lastFinsiedOrders: async (root, args) =>
      await OrderModel.find({ finished: true }).limit(args.limit).sort("-_id"),
    lastWaitingOrders: async (root, args) =>
      await OrderModel.find({ finished: false }).limit(args.limit).sort("-_id"),
    lastCancelledOrders: async (root, args) =>
      await OrderModel.find({ cancelled: true }).limit(args.limit).sort("-_id"),
    scrollOrders: async (root, args) =>
      await OrderModel.find({ _id: { $lt: args.cursor } })
        .limit(args.limit)
        .sort("-_id"),
    scrollFinishedOrders: async (root, args) =>
      await OrderModel.find({ _id: { $lt: args.cursor }, finished: true })
        .limit(args.limit)
        .sort("-_id"),
    scrollWaitingOrders: async (root, args) =>
      await OrderModel.find({ _id: { $lt: args.cursor }, finished: false })
        .limit(args.limit)
        .sort("-_id"),
    scrollCancelledOrders: async (root, args) =>
      await OrderModel.find({ _id: { $lt: args.cursor }, cancelled: true })
        .limit(args.limit)
        .sort("-_id"),
    ordersCount: () => OrderModel.estimatedDocumentCount(),
    finishedOrders: () => OrderModel.find({ finished: true }).sort("-_id"),
    waitingOrders: () => OrderModel.find({ finished: false }).sort("-_id"),
    cancelledOrders: () => OrderModel.find({ cancelled: true }).sort("-_id"),
    cancelledOrdersCount: () => OrderModel.countDocuments({ cancelled: true }),
    waitingOrdersCount: () => OrderModel.countDocuments({ finished: false }),
    finishedOrdersCount: () => OrderModel.countDocuments({ finished: true }),
    getOrder: (root, args) => OrderModel.findById(args.id),
  },
  Mutation: {
    addOrder: (root, args) => {
      const newOrder = new OrderModel({
        id: Math.floor(Math.random() * 100),
        finished: false,
        cancelled: false,
        notes: args.notes ? args.notes : "",
        customer: {
          name: args.customer_name,
          phone: args.customer_phone,
          address: args.customer_address,
        },
        details: args.details,
        price: args.price,
      });
      return newOrder.save();
    },
    editOrder: async (root, args) => {
      const order = await OrderModel.findByIdAndUpdate(
        args.id,
        {
          notes: args.notes ? args.notes : "",
          customer: {
            name: args.customer_name,
            phone: args.customer_phone,
            address: args.customer_address,
          },
          details: args.details,
          price: args.price,
        },
        { new: true }
      );
      if (!order) return null;

      return order;
    },
    finishOrder: async (root, args) => {
      await OrderModel.findByIdAndUpdate(args.id, { finished: true });
      return "Order finished successfuly";
    },
    cancelOrder: async (root, args) => {
      await OrderModel.findByIdAndUpdate(args.id, { cancelled: true });
      return "Order cancelled successfuly";
    },
    unFinishOrder: async (root, args) => {
      await OrderModel.findByIdAndUpdate(args.id, { finished: false });
      return "Order unfinished successfuly";
    },
    UnCancelOrder: async (root, args) => {
      await OrderModel.findByIdAndUpdate(args.id, { cancelled: false });
      return "Order uncancelled successfuly";
    },
    deleteOrder: async (root, args) => {
      await OrderModel.findByIdAndDelete(args.id);
      return "Order deleted successfuly";
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

module.exports = server;
