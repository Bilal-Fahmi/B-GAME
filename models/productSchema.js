const mongoose = require("mongoose");
const category =require ('../models/categorySchema')


const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    ref : "Category"
  },
  price: {
    type: Number,
    required: true
  },
  stockQuantity: {
    type: Number,
    required: true
  },
  productImage: {
    type: String,
    required: true
  },
  status : {
    type : String,
    default : 'Listed'
  },
  
},{timestamps:true});

const Product = mongoose.model('Product',productSchema)
module.exports=Product
