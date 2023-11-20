const Order = require("../models/orderSchema");

exports.allOrder = (req, res) => {
  Order.find({}, (error, order) => {
    if (error) {
      res.send("Something went wrong");
    } else {
      res.send(order);
    }
  });
};
