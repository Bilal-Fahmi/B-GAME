const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Product = require("../models/productSchema");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmpassword: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "Unblocked",
  },
  address: [
    {
      address: { type: String },
      state: { type: String },
      district: { type: String },
      city: { type: String },
      zip: { type: String },
      phone: { type: String },
      email: { type: String },
      name: { type: String },
    },
  ],
});

userSchema.virtual("pass", "confirmpass").set(function (pass, confirmpass) {
  (this.password = bcrypt.hashSync(pass, 10)),
    (this.confirmpassword = bcrypt.hashSync(confirmpass, 10));
});

userSchema.methods.authenticate = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
