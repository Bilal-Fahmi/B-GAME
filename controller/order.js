const Order = require("../models/orderSchema");
const Cart = require("../models/cartSchema");
const { model } = require("mongoose");
const Coupon = require("../models/couponSchema");

const { response } = require("express");
const User = require("../models/usermodel");
const Product = require("../models/productSchema");

exports.createOrder = (req, res) => {
  try {
    Cart.findOne({ user: req.user._id })
      .populate({
        path: "cartItems.product",
        model: "Product",
      })
      .exec(async (error, cart) => {
        if (error) {
          console.log(error);
        }
        // console.log(cart);
        if (cart) {
          let totalCost = 0;
          for (let item of cart.cartItems) {
            totalCost += item.quantity * item.product.price;
          }
          // console.log(totalCost);
          // console.log(req.body);
          // console.log(cart.cartItems);
          if (req.body.payment == "COD") {
            const newOrder = new Order({
              status: "Confirmed",
              products: cart.cartItems,
              user: req.user._id,
              payment: req.body.payment,
              code: req.body.coupon,
              billamount:
                totalCost - (req.body.couponAmount ? req.body.couponAmount : 0),
              discount: req.body.couponAmount,
              billingaddress: {
                name: req.body.username,
                state: req.body.state,
                district: req.body.district,
                city: req.body.city,
                phone: req.body.phone,
                zip: req.body.zip,
                address: req.body.address,
              },
            });
            newOrder
              .save()
              .then(async (data) => {
                stockdec(data);
                await Cart.findOneAndDelete({ user: req.user._id });

                res.json({ COD: true });
              })
              .catch((error) => res.send(error));
          }
          if (req.body.payment == "Razorpay") {
            console.log("gettin gere 111");
            const newOrder = new Order({
              status: "Pending",
              products: cart.cartItems,
              user: req.user._id,
              payment: req.body.payment,
              code: req.body.coupon,
              billamount:
                totalCost - (req.body.couponAmount ? req.body.couponAmount : 0),
              discount: req.body.couponAmount,
              billingaddress: {
                name: req.body.username,
                state: req.body.state,
                district: req.body.district,
                city: req.body.city,
                phone: req.body.phone,
                zip: req.body.zip,
                address: req.body.address,
              },
            });
            console.log("gettin gere 222");
            newOrder.save().then(async (data) => {
              stockdec(data);
              await Cart.findOneAndDelete({ user: req.user._id });

              console.log("gettin gere 111444");
              const Razorpay = require("razorpay");
              var instance = new Razorpay({
                key_id: "rzp_test_8emA6zzli6nGP1",
                key_secret: "O4RlOXRxnLAX8IaXM3ifqFZZ",
              });
              instance.orders
                .create({
                  amount: data.billamount * 100,
                  currency: "INR",
                  receipt: "" + data._id,
                })

                .then((response) => {
                  console.log("gettin gere 3");
                  res.json({
                    orderdata: data,
                    user: req.user._id,
                    order: response,
                  });
                });
            });
          }
        }
      });
  } catch (error) {
    console.log(error);
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    let body =
      req.body.response.razorpay_order_id +
      "|" +
      req.body.response.razorpay_payment_id;

    var crypto = require("crypto");
    var expectedSignature = crypto
      .createHmac("sha256", "O4RlOXRxnLAX8IaXM3ifqFZZ")
      .update(body.toString())
      .digest("hex");
    console.log("sig received ", req.body.response.razorpay_signature);
    console.log("sig generated ", expectedSignature);
    var response = { signatureIsValid: "false" };
    if (expectedSignature === req.body.response.razorpay_signature) {
      response = { signatureIsValid: "true" };

      // const userId = req.user._id
      // const user = await User.findById(userId)
      console.log("gettin gere 4");
      await Cart.findOneAndDelete({ user: req.user._id });

      await Order.findOneAndUpdate(
        { _id: req.body.orderData._id },
        { $set: { status: "Placed" } }
      );
    }
    res.json({ response: response });
  } catch (error) {
    console.log("error yo");
    console.log(error);
  }
};

exports.checkCoupon = async (req, res) => {
  try {
    console.log("getting here");

    let couponData = await Coupon.findOne({ code: req.body.coupon });
    // console.log(couponData);
    if (couponData) {
      let currentDate = new Date();
      console.log("current date", currentDate);

      let expiryDate = couponData.expiry;
      console.log("exxxxxxxxxxxxxxdate", expiryDate);
      if (expiryDate >= currentDate) {
        if (req.body.cartAmount > couponData.minimum_purchase) {
          let userId = req.user._id;
          console.log("getting here 111111");
          if (couponData.claimed_users.length <= 0) {
            console.log("getting here222222s");
            let couponAmount = couponData.discount;
            let couponName = couponData.code;
            res.json({
              couponAvailable: true,
              couponAmount,
              couponName,
              cartAmount: req.body.cartAmount,
            });
          } else {
            let isClaimed = couponData.claimed_users.findIndex(
              (element) => element.toString() === userId
            );

            if (isClaimed === -1) {
              let couponAmount = couponData.discountAmount;
              res.json({
                couponAvailable: true,
                couponAmount,
                cartAmount: req.body.cartAmount,
              });
            } else {
              res.json({
                erro: true,
                errorMessage: "Promo Code is already Claimed",
              });
            }
          }
        } else {
          res.json({ erro: true, errorMessage: "Min Cart Amount" });
        }
      } else {
        res.json({ erro: true, errorMessage: "Coupon Expired" });
      }
    } else {
      res.json({ erro: true, errorMessage: "Enter a valid Promo Code" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

async function stockdec(data) {
  data.products.forEach(async (product) => {
    const item = await Product.updateOne(
      { _id: product.product },
      { $inc: { stockQuantity: -1 } },
      { new: true }
    );
    console.log("-----");
    console.log(item);
  });
}
