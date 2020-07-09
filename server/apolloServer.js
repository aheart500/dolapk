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
    created_at: String
    updated_at: String
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
    lastOrders(limit: Int!, cursor: ID): [Order!]!
    lastFinsiedOrders(limit: Int!, cursor: ID): [Order!]!
    lastWaitingOrders(limit: Int!, cursor: ID): [Order!]!
    lastCancelledOrders(limit: Int!, cursor: ID): [Order!]!
  }
`;

const resolvers = {
  Query: {
    allOrders: () => OrderModel.find({}).sort("-_id"),
    lastOrders: async (root, args) => {
      return await OrderModel.find(
        args.cursor ? { _id: { $lt: args.cursor } } : {}
      )
        .limit(args.limit)
        .sort("-_id");
    },
    lastFinsiedOrders: async (root, args) => {
      return await OrderModel.find(
        args.cursor
          ? {
              _id: { $lt: args.cursor },
              finished: true,
            }
          : { finished: true }
      )
        .limit(args.limit)
        .sort("-updated_at");
    },

    lastWaitingOrders: async (root, args) => {
      return await OrderModel.find(
        args.cursor
          ? {
              _id: { $lt: args.cursor },
              finished: false,
            }
          : { finished: false }
      )
        .limit(args.limit)
        .sort("-updated_at");
    },

    lastCancelledOrders: async (root, args) => {
      return await OrderModel.find(
        args.cursor
          ? {
              _id: { $lt: args.cursor },
              cancelled: true,
            }
          : { cancelled: true }
      )
        .limit(args.limit)
        .sort("-updated_at");
    },

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
