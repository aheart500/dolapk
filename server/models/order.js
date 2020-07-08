const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
  customer: {
    name: String,
    phone: String,
    address: String,
  },
  details: String,
  notes: { type: String, default: "" },
  price: Number,
  finished: { type: Boolean, default: false },
  cancelled: { type: Boolean, default: false },
});

OrderSchema.index({ finished: -1 });
OrderSchema.index({ cancelled: -1 });

module.exports =
  mongoose.models.Order || new mongoose.model("Order", OrderSchema);
