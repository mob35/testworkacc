'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Purchase = mongoose.model('Purchase'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Purchase
 */
exports.create = function(req, res) {
  var purchase = new Purchase(req.body);
  purchase.user = req.user;

  purchase.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(purchase);
    }
  });
};

/**
 * Show the current Purchase
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var purchase = req.purchase ? req.purchase.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  purchase.isCurrentUserOwner = req.user && purchase.user && purchase.user._id.toString() === req.user._id.toString();

  res.jsonp(purchase);
};

/**
 * Update a Purchase
 */
exports.update = function(req, res) {
  var purchase = req.purchase;

  purchase = _.extend(purchase, req.body);

  purchase.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(purchase);
    }
  });
};

/**
 * Delete an Purchase
 */
exports.delete = function(req, res) {
  var purchase = req.purchase;

  purchase.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(purchase);
    }
  });
};

/**
 * List of Purchases
 */
exports.list = function(req, res) {
  Purchase.find().sort('-created').populate('user', 'displayName').populate('client').populate('items.product').exec(function(err, purchases) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(purchases);
    }
  });
};

/**
 * Purchase middleware
 */
exports.purchaseByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Purchase is invalid'
    });
  }

  Purchase.findById(id).populate('user', 'displayName').populate('client').populate('items.product').exec(function (err, purchase) {
    if (err) {
      return next(err);
    } else if (!purchase) {
      return res.status(404).send({
        message: 'No Purchase with that identifier has been found'
      });
    }
    req.purchase = purchase;
    next();
  });
};
