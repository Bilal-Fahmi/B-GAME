const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  status: {
    type: String,
    default: "Pending",
  },
  products: [
    {
      product: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },

  payment: {
    type: String,
    required: true,
  },
  coupon: {
    type: String,
  },
  discount: {
    type: Number,
  },

  billamount: {
    type: Number,
    required: true,
  },
  orderdate: {
    type: Date,
    default: Date.now,
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    refer: "Address",
  },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
