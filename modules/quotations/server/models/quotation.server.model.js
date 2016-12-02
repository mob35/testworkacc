'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Quotation Schema
 */
var QuotationSchema = new Schema({
    docno: {
        type: String,
        default: '',
        unique: true,
        required: 'Please fill Quotation docno',
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
        required: 'Please fill Quotation client',
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

mongoose.model('Quotation', QuotationSchema);
