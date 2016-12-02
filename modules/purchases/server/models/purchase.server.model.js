'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Purchase Schema
 */
var PurchaseSchema = new Schema({
  docno: {
    type: String,
    default: '',
    unique: true,
    required: 'Please fill Purchase docno',
    trim: true
  },
  docdate: {
    type: Date,
    default: Date.now
  },
  refno: {
    type: String
  },
  client: {
    type: Schema.Types.ObjectId,
    required: 'Please fill Purchase client',
    ref: 'Company'
  },
  items: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    qty: {
      type: Number
    },
    unitprice: {
      type: Number,
      default: 0
    },
    amount: {
      type: Number,
      default: 0
    },
    vatamount: {
      type: Number,
      default: 0
    },
    whtamount: {
      type: Number,
      default: 0
    },
    totalamount: {
      type: Number,
      default: 0
    }
  }],
  drilldate: {
    type: Date,
  },
  creditday: {
    type: Number
  },
  isincludevat: {
    type: Boolean
  },
  amount: {
    type: Number,
    default: 0
  },
  discountamount: {
    type: Number,
    default: 0
  },
  amountafterdiscount: {
    type: Number,
    default: 0
  },
  vatamount: {
    type: Number,
    default: 0
  },
  whtamount: {
    type: Number,
    default: 0
  },
  totalamount: {
    type: Number,
    default: 0
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Purchase', PurchaseSchema);
