const Cart = require("../models/cartSchema");
const Product = require("../models/productSchema");
const User = require("../models/usermodel");
const { propfind } = require("../routes/userRouter");

exports.addToCart = async (req, res) => {
  Cart.findOne({ user: req.user._id }).exec(async (err, cart) => {
    if (err) return res.send(err);
    if (cart) {
      //if cart is already existing
      console.log("cart exist");
      const item = cart.cartItems.find((c) =>
        c.product.equals(req.product._id)
      );
      console.log(item);

      let proPrice = req.product.price;
      let totalPricee = cart.totalPrice;
      totalPricee += proPrice;

      if (item) {
        res.json({ message: "product already exist" });
      } else {
        //product is not existing
        await Cart.findOneAndUpdate(
          { user: req.user._id },
          { $push: { cartItems: { product: req.product } } },
          { new: true }
        );
        Cart.findOneAndUpdate(
          { user: req.user._id },
          { $set: { totalPrice: totalPricee } },
          { new: true }
        ).exec((err, result) => {
          console.log(result);
          if (err) {
            console.error(err);
            return res
              .status(500)
              .send("An error occurred while updating the cart");
          }

          if (!result) {
            return res
              .status(404)
              .send("No cart was found for the specified user");
          }
          if (result) {
            User.findOneAndUpdate(
              { _id: req.user._id }
              // { $inc: { cartQuantity: 1 } }
            );
            res.redirect("/user/cart");
          }
        });
      }
    } else {
      //if cart is not existing

      let totalP = req.product.price;
      const newCart = new Cart({
        user: req.user._id,
        cartItems: { product: req.product._id },
        totalPrice: totalP,
      });

      newCart
        .save()
        .then((data) => {
          res.redirect("/user/cart");
        })
        .catch((err) => res.send(err));
    }
  });
};

exports.updateCart = async (req, res) => {
  // if (req.body.action === 'inc') {
  //   req.body.action = 1;
  // } else if (req.body.action === 'dec') {
  //   req.body.action = -1;
  // } else {
  //   req.body.action = 0;
  // }
  Cart.findOneAndUpdate(
    {
      user: req.user._id,
      "cartItems.product": req.product._id,
    },
    // {
    //   $inc: { 'cartItems.$.quantity': req.body.action },
    // },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(err.code).json({ message: err.message });
    }
    if (result) {
      // IF CART IS QUANTITY IS EMPTY DELETE PRODUCT
      if (req.body.action === -1) {
        Cart.findOneAndUpdate(
          {
            user: req.user._id,
            "cartItems.product": req.product._id,
          },
          {
            $pull: { cartItems: { quantity: 0 } },
          }
        ).exec((err, result) => {
          if (err) {
            return console.log(err);
          }
        });

        //IF CART IS EMPTY DELETE CART

        Cart.findOneAndDelete({ user: req.user._id, cartItems: [] }).exec(
          (err, result) => {
            if (err) {
              return console.log(err);
            }
            if (result) {
              res.status(200).json({ message: "cart deleted successfully" });
            }
          }
        );
      }
    }
  });
};

exports.deleteItem = async (req, res) => {
  console.log(req.params.id);
  Cart.findOneAndUpdate(
    {
      user: req.user._id,
    },
    {
      $pull: { cartItems: { _id: req.params.id } },
    },
    { new: true }
  ).exec((err, result) => {
    if (err) {
      return console.log(err);
    }
    if (result) {
      console.log("noo");
      console.log(result);
      res.redirect("/user/cart");
    }
  });
};
