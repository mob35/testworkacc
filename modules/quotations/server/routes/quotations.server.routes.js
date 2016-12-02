'use strict';

/**
 * Module dependencies
 */
var quotationsPolicy = require('../policies/quotations.server.policy'),
  quotations = require('../controllers/quotations.server.controller');

module.exports = function(app) {
  // Quotations Routes
  app.route('/api/quotations').all(quotationsPolicy.isAllowed)
    .get(quotations.list)
    .post(quotations.create);

  app.route('/api/quotations/:quotationId').all(quotationsPolicy.isAllowed)
    .get(quotations.read)
    .put(quotations.update)
    .delete(quotations.delete);

  // Finish by binding the Quotation middleware
  app.param('quotationId', quotations.quotationByID);
};
