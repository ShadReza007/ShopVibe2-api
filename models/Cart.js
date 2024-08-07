const mongoose=require('mongoose')

const CartSchema=new mongoose.Schema({
    items:Number,
    id:Number,
    product_name:String,
    price:Number
})

const CartModel=mongoose.model("cart",CartSchema,"cart")

module.exports=CartModel