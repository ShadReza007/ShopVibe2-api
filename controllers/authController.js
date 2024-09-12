const CartModel = require("../models/Cart");
const User = require("../models/User");
const mongoose = require('mongoose'); 
const jwt = require('jsonwebtoken');
const Product = require("../models/Product");


const handleErrors = (err) => {
  let errors = { email: '', password: '' };

 
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

 
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

 
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }


  if (err.message.includes('user validation failed')) {
   
    Object.values(err.errors).forEach(({ properties }) => {
 
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'net ninja secret', {
    expiresIn: maxAge
  });
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
 
    const emptyArr = []
    const cart = await CartModel.create({user_id : user._id , product_list : emptyArr})
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
 
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } 
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}

module.exports.modify_patch = async (req, res) => {
  const userId = req.query.id;
  const { productId, modifyNumber } = req.body;

  const modifyNumber1 = Number(modifyNumber)
  try {
    let cart = await CartModel.findOne({ user_id: new mongoose.Types.ObjectId(userId) });

    if (!cart) {
      return res.status(400).send({msg: 'Cart not found'});
    }
    const prodList = cart.product_list;
    const record = prodList.find(item => item.product_id.toString() === productId);

    if (!record) {
      prodList.push({
        product_id: productId,
        quantity: Math.max(1, modifyNumber1) 
      });
    } else {
      record.quantity = Math.max(0, record.quantity + modifyNumber1);
    }

    await cart.save();

    return res.send({ msg: 'Query ran successfully, cart updated' });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ error: "An error occurred while updating the cart" });
  }
};

module.exports.getuser_get = async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).send({ msg: "Email is required" });
  }

  const refinedMail = decodeURIComponent(email.replace('%40', '@'));

  try {
    const user = await User.findOne({ email: refinedMail }); 
    if (!user) {
      return res.status(404).send({ msg: "User not found" });
    }

    res.status(200).send({ user: user._id }); 
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: "Internal server error" });
  }
};


module.exports.getproduct_post = async (req, res) => {
  const { id } = req.body; 
  if (!id) {
    return res.status(400).send({ msg: "Product ID is required" });
  }

  try {
    const product = await Product.findOne({ id: id }); 
    if (!product) {
      return res.status(404).send({ msg: "Product not found" });
    }
  
    const productid = product._id.toString();
    res.status(200).send({ productid: productid });
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: "Internal server error" });
  }
};


module.exports.getcart_get = async (req, res) => {
  const userId = req.query.id;
  if (!userId) {
    return res.status(400).send({ msg: "User ID not found" });
  }
  try {
    let cart = await CartModel.findOne({ user_id: new mongoose.Types.ObjectId(userId) });
    
    if (!cart) {
      return res.status(400).send({msg: 'Cart not found'});
    }
    const prodList = cart.product_list;
    let prods=[]
    for(let i=0;i<prodList.length;i++){
      prods[i] = prodList[i];
    }
    return res.send({ prod_arr : prods });
  } catch (error) {
    res.status(500).send({ error: "Error occurred" });
  }

}


module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}
