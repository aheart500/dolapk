const {
  UserInputError,
  AuthenticationError,
} = require("apollo-server-express");
const bcrypt = require("bcrypt");
const saltRounds = 11;
const SECRET = process.env.SECRET;
const jwt = require("jsonwebtoken");
const OrderModel = require("../models/order");
const AdminModel = require("../models/admin");
const messages = require("../utils/messages");
const sendMessage = require("../utils/sendMessage");
/* const sendMiddleWare = async (token, ids, status) => {
  
  if (message) {
    let orders = await OrderModel.find({ _id: { $in: ids } }).select({
      trackID: 1,
      customer: 1,
    });

    orders.forEach((order) => {
      sendMessages(token, message(order.trackID), [order.customer.phone]);
    });
  }
}; */

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
          ? {
              status: {
                $in: [
                  "قيد المعالجة",
                  "جاهز للشحن",
                  "تم التسليم للشحن",
                  "جاري توزيع الشحنة",
                ],
              },
            }
          : args.category === "finished"
          ? { status: "تم التسليم" }
          : args.category === "cancelled"
          ? { cancelled: true }
          : {}
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

    ordersCount: () => OrderModel.estimatedDocumentCount(),

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
    addOrder: async (root, args, c) => {
      if (!c.currentAdmin) throw new AuthenticationError("Not Authinticated");
      let newOrder = new OrderModel({
        id: Math.floor(Math.random() * 100),
        cancelled: false,
        notes: args.notes ? args.notes : null,
        customer: {
          name: args.customer_name,
          phone: args.customer_phone,
          address: args.customer_address,
        },
        details: args.details,
        price: {
          order: args.order_price,
          shipment: args.shipment_price,
        },
        created_by: c.currentAdmin.name,
      });
      await newOrder.save();
      sendMessage(messages.added_message(), [args.customer_phone]);
      return newOrder;
    },
    editOrder: async (root, args, c) => {
      if (!c.currentAdmin) throw new AuthenticationError("Not Authinticated");
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
          price: {
            order: args.order_price,
            shipment: args.shipment_price,
          },
          updated_by: c.currentAdmin.name,
        },
        { new: true }
      );
      if (!order) return null;

      return order;
    },

    updateStatus: async (root, args) => {
      await OrderModel.updateMany(
        { _id: { $in: args.ids } },
        { status: args.status }
      );
      if (args.phones) {
        const message =
          args.status === "تم التسليم"
            ? messages.delivered
            : args.status === "جاهز للشحن"
            ? messages.ready_for_shipment
            : args.status === "جاري توزيع الشحنة"
            ? messages.ready_for_distribution
            : args.status === "تم التسليم للشحن"
            ? messages.shipped
            : null;
        if (message && !args.trackIds) {
          sendMessage(message(), args.phones);
        }
        if (message && args.trackIds) {
          args.trackIds.forEach((id, index) => {
            sendMessage(message(id), [args.phones[index]]);
          });
        }
      }

      return `Updated ${args.ids.length} orders successfully`;
    },
    cancelOrders: async (root, args) => {
      const orders = await OrderModel.updateMany(
        { _id: { $in: args.ids } },
        { cancelled: true }
      );
      if (args.phones) {
        sendMessage(messages.cancelled(), args.phones);
      }
      return `Cancelled ${args.ids.length} orders successfully`;
    },
    unCancelOrders: async (root, args) => {
      await OrderModel.updateMany(
        { _id: { $in: args.ids } },
        { cancelled: false }
      );
      return `Uncancelled ${args.ids.length} orders successfully`;
    },
    deleteOrders: async (root, args) => {
      await OrderModel.deleteMany({ _id: { $in: args.ids } });
      return `Deleted ${args.ids.length} orders successfully`;
    },
  },
};

module.exports = resolvers;
