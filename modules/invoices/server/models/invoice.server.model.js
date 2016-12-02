'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Invoice Schema
 */
var InvoiceSchema = new Schema({
  docno: {
    type: String,
    default: '',
    unique: true,
    required: 'Please fill Invoice docno',
    trim: true
  },
  docdate: {
    type: Date,
    default: Date.now
  },
  creditday: Number,
  drilldate: Date,
  refno: String,
  isincludevat: Boolean,
  client: {
    required: 'Please fill Invoice client',
    type: Schema.ObjectId,
    ref: 'Company'
  },
  items: [{
    product: {
      type: Schema.ObjectId,
      ref: 'Product'
    },
    qty: Number,
    unitprice: Number,
    amount: Number,
    vatamount: Number,
    whtamount: Number,
    totalamount: Number
  }],
  amount: Number,
  discountamount: Number,
  amountafterdiscount: Number,
  vatamount: Number,
  whtamount: Number,
  totalamount: Number,
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Invoice', InvoiceSchema);
