const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  categoryimage: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Listed",
  },
});

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
