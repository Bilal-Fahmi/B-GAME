const fs = require("fs");
const path = require("path");
const Category = require("../models/categorySchema");
const { uploadImage } = require("../middleware/cloudinary");

const categoryCheck = async (name) => {
  try {
    const coupon = await Category.findOne({ name });
    return coupon ? true : false;
  } catch (error) {
    console.error(error);
  }
};

const addcategory = async (req, res) => {
  const { path } = req.file;
  try {
    const imageUrl = await uploadImage(path);
    const newCategory = new Category({
      name: req.body.name.toLowerCase(),
      description: req.body.description,
      categoryimage: imageUrl,
    });
    newCategory.save();
    if (!newCategory) throw new Error("New category not created");
    res.redirect("/admin/categorytable");
  } catch (error) {
    console.log(error);
  }
};

const getallcategory = async (req, res, next) => {
  Category.find({}).exec((error, categorylist) => {
    if (categorylist) {
      req.categorylist = categorylist;
      next();
    }
    if (error) {
      console.log(error);
    }
  });
};

const singlecategory = (req, res) => {
  Category.findOne({ coupon_id }, (error, product) => {
    if (error) {
      res.send("Something went wrong");
    } else {
      res.send(product);
    }
  });
};

const updatecategory = (req, res) => {
  Category.findOneandUpdate(
    { name },
    { description },
    { categoryimage },
    (error) => {
      if (error) {
        res.send("Something went wrong");
      } else {
        res.send("Category updated successfully");
      }
    }
  );
};

const listcategory = async (req, res) => {
  try {
    const id = req.params.id;
    await Category.findOneAndUpdate(
      { _id: id },
      { $set: { status: "Listed" } }
    ).then(() => {
      res.redirect("/admin/categorytable");
    });
  } catch (err) {
    next(err);
  }
};

const unlistcategory = async (req, res) => {
  const id = req.params.id;
  await Category.findOneAndUpdate({ _id: id }, { $set: { status: "Unlisted" } })
    .then(() => {
      res.redirect("/admin/categorytable");
    })
    .catch((err) => {
      next(err);
    });
};

const deletecategory = async (req, res) => {
  const name = req.params.name;
  await Category.deleteOne({ name: name })
    .then(() => {
      res.redirect("/admin/categorytable");
      console.log("category deleted");
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  categoryCheck,
  addcategory,
  singlecategory,
  updatecategory,
  deletecategory,
  listcategory,
  unlistcategory,
  getallcategory,
};
