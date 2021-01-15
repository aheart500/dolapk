const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

AutoIncrement.initialize(mongoose.connection);
const OrderSchema = new mongoose.Schema(
  {
    customer: {
      name: String,
      phone: String,
      address: String,
    },
    trackID: Number,
    details: String,
    notes: { type: String, default: "" },
    price: {
      order: Number,
      shipment: Number,
    },
    status: { type: String, default: "قيد المعالجة" },
    cancelled: { type: Boolean, default: false },
    deliveryType: String,
    created_by: String,
    updated_by: String,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

OrderSchema.index({ status: -1 });
OrderSchema.index({ cancelled: -1 });
OrderSchema.index({ updated_at: -1 });
OrderSchema.plugin(AutoIncrement.plugin, {
  model: "Order",
  field: "trackID",
  startAt: 0,
  incrementBy: 1,
});

module.exports =
  mongoose.models.Order || new mongoose.model("Order", OrderSchema);
