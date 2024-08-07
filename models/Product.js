const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
  id : Number,
  product_name : String,
  price : Number
})

const ProductModel = mongoose.model("productlist", ProductSchema,"productlist")
module.exports = ProductModel