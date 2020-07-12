const { gql, ApolloServer, UserInputError } = require("apollo-server-express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 11;
const SECRET = process.env.SECRET;

const OrderModel = require("./models/order");
const AdminModel = require("./models/admin");

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
  type Order {
    id: ID!
    trackID: Int
    customer: Customer!
    details: String!
    notes: String!
    finished: Boolean!
    cancelled: Boolean!
    shipped: Boolean
    price: Float!
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
      created_by: String!
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
      updated_by: String!
    ): Order
    finishOrder(id: ID, trackID: Int): String
    shipOrder(id: ID!): String
    unShipOrder(id: ID!): String
    cancelOrder(id: ID!): String
    unFinishOrder(id: ID!): String
    UnCancelOrder(id: ID!): String
    deleteOrder(id: ID!): String
    finishOrders(ids: [ID!]!): String
    unFinishOrders(ids: [ID!]!): String
    cancelOrders(ids: [ID!]!): String
    unCancelOrders(ids: [ID!]!): String
    shipOrders(ids: [ID!]!): String
    unShipOrders(ids: [ID!]!): String
    deleteOrders(ids: [ID!]!): String
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
    getOrder(id: ID, trackID: Int): Order
    lastOrders(
      limit: Int!
      category: String
      cursor: ID
      search: String
    ): [Order!]!
    lastFinsiedOrders(limit: Int!, cursor: ID, search: String): [Order!]!
    lastWaitingOrders(limit: Int!, cursor: ID, search: String): [Order!]!
    lastCancelledOrders(limit: Int!, cursor: ID, search: String): [Order!]!
  }
`;

const orArrF = (search) => {
  return [
    { "customer.name": search },
    { "customer.phone": search },
    { "customer.address": search },
    { details: search },
    { notes: search },
  ];
};

const resolvers = {
  Query: {
    allOrders: () => OrderModel.find({}).sort("-_id"),
    lastOrders: async (root, args, c) => {
      const search = args.search ? new RegExp(args.search, "ig") : "";
      const orArr = orArrF(search);
      let query = args.category
        ? args.category === "waiting"
          ? { finished: false }
          : { [args.category]: true }
        : {};
      if (args.cursor) {
        query._id = { $lt: args.cursor };
      }
      if (args.search) {
        query = {
          ...query,
          $or: orArr,
        };
      }
      return await OrderModel.find(query).limit(args.limit).sort("-_id");
    },
    lastFinsiedOrders: async (root, args) => {
      const search = args.search ? new RegExp(args.search, "ig") : "";
      const orArr = orArrF(search);
      return await OrderModel.find(
        args.cursor
          ? {
              _id: { $lt: args.cursor },
              finished: true,
              $or: orArr,
            }
          : { finished: true, $or: orArr }
      )
        .limit(args.limit)
        .sort("-updated_at");
    },

    lastWaitingOrders: async (root, args) => {
      const search = args.search ? new RegExp(args.search, "ig") : "";
      const orArr = orArrF(search);
      return await OrderModel.find(
        args.cursor
          ? {
              _id: { $lt: args.cursor },
              finished: false,
              $or: orArr,
            }
          : { finished: false, $or: orArr }
      )
        .limit(args.limit)
        .sort("-updated_at");
    },

    lastCancelledOrders: async (root, args) => {
      const search = args.search ? new RegExp(args.search, "ig") : "";
      const orArr = orArrF(search);
      return await OrderModel.find(
        args.cursor
          ? {
              _id: { $lt: args.cursor },
              cancelled: true,
              $or: orArr,
            }
          : { cancelled: true, $or: orArr }
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
    getOrder: (root, args) =>
      OrderModel.findOne(
        args.id ? { _id: args.id } : { trackID: args.trackID }
      ),
  },
  Mutation: {
    createAdmin: async (root, args) => {
      const password = await bcrypt.hash(args.password, saltRounds);
      const admin = new AdminModel({
        username: args.username,
        password,
        name: args.name,
        img: args.img ? args.img : null,
      });
      return admin.save();
    },
    login: async (root, args) => {
      const admin = await AdminModel.findOne({ username: args.username });
      if (!admin || !(await bcrypt.compare(args.password, admin.password)))
        throw new UserInputError("Wrong credentials", {
          invalidArgs: args,
        });
      const adminForToken = {
        name: admin.name,
        username: admin.username,
        id: admin._id,
      };
      return {
        value: jwt.sign(adminForToken, SECRET),
        name: admin.name,
        img: admin.img ? admin.img : null,
      };
    },
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
        created_by: args.created_by,
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
          updated_by: args.updated_by,
        },
        { new: true }
      );
      if (!order) return null;

      return order;
    },
    finishOrder: async (root, args) => {
      await OrderModel.findOneAndUpdate(
        args.id ? { _id: args.id } : { trackID: args.trackID },
        { finished: true }
      );
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
    shipOrder: async (root, args) => {
      await OrderModel.findByIdAndUpdate(args.id, { shipped: true });
      return "Order shipped successfuly";
    },
    unShipOrder: async (root, args) => {
      await OrderModel.findByIdAndUpdate(args.id, { shipped: false });
      return "Order unshipped successfuly";
    },
    finishOrders: async (root, args) => {
      await OrderModel.updateMany(
        { _id: { $in: args.ids } },
        { finished: true }
      );
      return `Finished ${args.ids.length} orders successfully`;
    },
    unFinishOrders: async (root, args) => {
      await OrderModel.updateMany(
        { _id: { $in: args.ids } },
        { finished: false }
      );
      return `Unfinished ${args.ids.length} orders successfully`;
    },
    cancelOrders: async (root, args) => {
      await OrderModel.updateMany(
        { _id: { $in: args.ids } },
        { cancelled: true }
      );
      return `Cancelled ${args.ids.length} orders successfully`;
    },
    unCancelOrders: async (root, args) => {
      await OrderModel.updateMany(
        { _id: { $in: args.ids } },
        { cancelled: false }
      );
      return `Uncancelled ${args.ids.length} orders successfully`;
    },
    shipOrders: async (root, args) => {
      await OrderModel.updateMany(
        { _id: { $in: args.ids } },
        { shipped: true }
      );
      return `Shipped ${args.ids.length} orders successfully`;
    },
    unShipOrders: async (root, args) => {
      await OrderModel.updateMany(
        { _id: { $in: args.ids } },
        { shipped: false }
      );
      return `Unshipped ${args.ids.length} orders successfully`;
    },
    deleteOrders: async (root, args) => {
      await OrderModel.deleteMany({ _id: { $in: args.ids } });
      return `Deleted ${args.ids.length} orders successfully`;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      const decodedToken = jwt.verify(auth.substring(7), SECRET);
      const currentAdmin = await AdminModel.findById(decodedToken.id);
      return { currentAdmin };
    }
  },
});

module.exports = server;
