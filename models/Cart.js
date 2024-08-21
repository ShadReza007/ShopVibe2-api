const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    product_list: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'productlist'
            },
            quantity: {
                type: Number,
                default: 0 // Default quantity is 1
            }
        }
    ]
});

const CartModel = mongoose.model('cart', CartSchema, 'cart');

module.exports = CartModel;
