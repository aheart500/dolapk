const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

OrderSchema.index({ finished: -1 });
OrderSchema.index({ cancelled: -1 });

module.exports =
  mongoose.models.Order || new mongoose.model("Order", OrderSchema);
