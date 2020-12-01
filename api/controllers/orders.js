const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');
const { findOne } = require('../models/order');

exports.orders_get_all = (req, res, next) => {
  Order.find()
    .select('product quantity _id')
    .populate('product', 'name')
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            _id: doc.id,
            product: doc.product,
            quantity: doc.quantity,
            url: 'http://localhost:3000/orders/' + doc._id,
          };
        }),
      });
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      });
    });
};

exports.orders_createorder = (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: 'Product not found',
        });
      }
      const order = new Order({
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      return order.save();
    })
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: 'Order stored',
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/orders/' + result._id,
          },
        },
      });
    })
    .catch((err) => {
      //console.log(err);
      return res.status(500).json({
        error: err,
      });
    });
};