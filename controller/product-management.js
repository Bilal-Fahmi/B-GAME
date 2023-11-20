const Product = require("../models/productSchema");
const path = require("path");
const fs = require("fs");
const { privateDecrypt } = require("crypto");
const { uploadImage } = require("../middleware/cloudinary");

const productCheck = async (name) => {
  try {
    const coupon = await Product.findOne({ name });
    return coupon ? true : false;
  } catch (error) {
    console.error(error);
  }
};

const addproduct = async (req, res) => {
  const { path } = req.file;  
  try {
      const imgUrl = await uploadImage(path);
      console.log(imgUrl,'hrtereed');
    if (!imgUrl) throw new Error("Error in creating image url");
    const newProduct = new Product({
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      stockQuantity: req.body.stockQuantity,
      productImage: imgUrl,
    });
    newProduct.save();
    if (!newProduct) throw new Error("New product not created");
    res.redirect("/admin/productTable");
  } catch (error) {
    console.log(error);
  }
};

const allproduct = (req, res) => {
  Product.find({}, (error, products) => {
    if (error) {
      res.send("Something went wrong");
    } else {
      res.send(products);
    }
  });
};

const singleproduct = (req, res, next) => {
  Product.findOne({ _id: req.params.id }, (error, product) => {
    if (error) {
      res.send("Something went wrong");
    } else {
      req.product = product;
      next();
    }
  });
};

const updateproduct = (req, res) => {
  Product.findOneandUpdate(
    { name },
    { description },
    { category },
    { price },
    { stockQuantity },
    { productImage },
    (error) => {
      if (error) {
        res.send("Something went wrong");
      } else {
        res.send("Product updated successfully");
      }
    }
  );
};

const listproduct = async (req, res) => {
  const id = req.params.id;
  await Product.findOneAndUpdate({ _id: id }, { $set: { status: "Listed" } })
    .then(() => {
      res.redirect("/admin/productTable");
    })
    .catch((err) => {
      next(err);
    });
};

const unlistproduct = async (req, res) => {
  const id = req.params.id;
  await Product.findOneAndUpdate({ _id: id }, { $set: { status: "Unlisted" } })
    .then(() => {
      res.redirect("/admin/productTable");
    })
    .catch((err) => {
      next(err);
    });
};

const deleteproduct = async (req, res) => {
  const id = req.params.id;
  await Product.deleteOne({ _id: id })
    .then(() => {
      res.redirect("/admin/productTable");
      console.log("category deleted");
    })
    .catch((err) => {
      next(err);
    });
};

const getallproduct = async (req, res, next) => {
  Product.find({}).exec((error, productlist) => {
    if (productlist) {
      req.productlist = productlist;
      next();
    }
    if (error) {
      console.log(error);
    }
  });
};

module.exports = {
  productCheck,
  addproduct,
  allproduct,
  singleproduct,
  updateproduct,
  deleteproduct,
  listproduct,
  unlistproduct,
  getallproduct,
};
