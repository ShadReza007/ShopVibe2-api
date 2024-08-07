const mongoose=require('mongoose')

const CartSchema=new mongoose.Schema({
    id: Number,
    quantity: Number
})

const CartModel=mongoose.model("cart",CartSchema,"cart")

module.exports=CartModel