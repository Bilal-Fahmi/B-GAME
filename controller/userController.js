const Cart = require("../models/cartSchema");
const Order = require("../models/orderSchema");
const Product = require("../models/productSchema");
const User = require("../models/usermodel");
const Banner = require("../models/bannerSchema");

const profile = async (req, res) => {
  let userData = await User.findOne({ _id: req.user._id });
  console.log(userData);
  res.render("user/profile", { user: userData });
};

const userHome = async (req, res) => {
  try {
    let banner = await Banner.find({});
    let product = await Product.find({}).limit(4);

    res.render("user/userHome", { banner: banner, product: product });
  } catch (error) {
    console.log("no home page found");
  }
};

const category = (req, res) => {
  console.log(req.categorylist);
  res.render("user/category", {
    categorylist: req.categorylist,
    productlist: req.productlist,
  });
};

const singleproduct = async (req, res, next) => {
  Product.findOne({ _id: req.params.id }, (error, product) => {
    if (error) {
      res.send("something went wrong");
    }
    if (product) {
      console.log(product);
      product = req.product;
      next();
    }
  });
};

const productpage = (req, res) => {
  try {
    res.render("user/single-product", { product: req.product, message: "" });
  } catch (error) {
    console.log("no product found");
  }
};

const cart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: "cartItems.product",
      model: "Product",
    });

    res.render("user/cart", { cartlist: cart });
  } catch (error) {
    console.log("no page found");
  }
};

const confirmation = async (req, res) => {
  try {
    let order = await Order.findOne({ user: req.user._id }).populate({
      path: "products.product",
      model: Product,
    });
    console.log(order);
    res.render("user/confirmation", { order: order });
  } catch (error) {
    console.log(error);
    console.log("no page found");
  }
};

const checkout = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate({
        path: "cartItems.product",
        model: "Product",
      })
      .populate({
        path: "user",
        model: "User",
      });

    res.render("user/checkout", { cartlist: cart });
  } catch (error) {
    console.log("no page found");
  }
};

const loadEdituser = async (req, res) => {
  try {
    const data = await User.findOne({ _id: req.user._id });
    res.render("user/edituser", {
      address: data.address,
      username: data.username,
      email: data.email,
    });
  } catch (error) {
    console.log(error);
  }
};

const addAddress = async (req, res) => {
  try {
    console.log(req.body);
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $push: { address: req.body } }
    );
    res.json({ message: "Address added successfully" });
  } catch (error) {
    console.log(error);
  }
};

const editAddress = async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.user._id, "address._id": req.params.id },
      {
        $set: {
          address: {
            name: req.body.name,
            state: req.body.state,
            district: req.body.district,
            city: req.body.city,
            phone: req.body.phone,
            zip: req.body.zip,
            email: req.body.email,
            address: req.body.address,
          },
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const loadOrderhistory = async (req, res) => {
  try {
    const order = await Order.find({ user: req.user._id }).populate({
      path: "products.product",
      model: "Product",
    });
    res.render("user/orderhistory", { orders: order });
  } catch (error) {
    console.log(error);
  }
};

const cancelOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findOneAndUpdate(
      { _id: id },
      { $set: { status: "Canceled" } },
      { new: true }
    );
    stockinc(order);
    res.json({ message: "increased" });
  } catch (error) {
    res.json({ error });
  }
};

function stockinc(data) {
  data.products.forEach(async (product) => {
    const item = await Product.updateOne(
      { _id: product.product },
      { $inc: { stockQuantity: 1 } },
      { new: true }
    );
    console.log("increased");
  });
  return;
}

const userDetails = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      { _id: req.user._id },
      { $set: { username: req.body.username, email: req.body.email } },
      { new: true }
    );
    // res.json({success:true, data:user})
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Server error" });
  }
};

module.exports = {
  userHome,
  category,
  singleproduct,
  productpage,
  cart,
  confirmation,
  checkout,
  profile,
  addAddress,
  editAddress,
  loadEdituser,
  loadOrderhistory,
  cancelOrder,
  userDetails,
};
