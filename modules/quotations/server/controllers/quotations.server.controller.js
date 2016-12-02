'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Quotation = mongoose.model('Quotation'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Quotation
 */
exports.create = function(req, res) {
  var quotation = new Quotation(req.body);
  quotation.user = req.user;

  quotation.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(quotation);
    }
  });
};

/**
 * Show the current Quotation
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var quotation = req.quotation ? req.quotation.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  quotation.isCurrentUserOwner = req.user && quotation.user && quotation.user._id.toString() === req.user._id.toString();

  res.jsonp(quotation);
};

/**
 * Update a Quotation
 */
exports.update = function(req, res) {
  var quotation = req.quotation;

  quotation = _.extend(quotation, req.body);

  quotation.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(quotation);
    }
  });
};

/**
 * Delete an Quotation
 */
exports.delete = function(req, res) {
  var quotation = req.quotation;

  quotation.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(quotation);
    }
  });
};

/**
 * List of Quotations
 */
exports.list = function(req, res) {
  Quotation.find().sort('-created').populate('user', 'displayName').populate('client').populate('items.product').exec(function(err, quotations) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(quotations);
    }
  });
};

/**
 * Quotation middleware
 */
exports.quotationByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Quotation is invalid'
    });
  }

  Quotation.findById(id).populate('user', 'displayName').populate('client').populate('items.product').exec(function (err, quotation) {
    if (err) {
      return next(err);
    } else if (!quotation) {
      return res.status(404).send({
        message: 'No Quotation with that identifier has been found'
      });
    }
    req.quotation = quotation;
    next();
  });
};
