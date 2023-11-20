const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    default: "Listed",
  },
  minimum_purchase: {
    type: Number,
    required: true,
  },
  claimed_users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  last_updated: {
    type: Date,
  },
  last_updated_user: {
    type: String,
  },
  expiry: {
    type: Date,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
});

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
