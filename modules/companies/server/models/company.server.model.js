'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Company Schema
 */
var CompanySchema = new Schema({
  name: {
    type: String,
    default: '',
    unique: true,
    required: 'Please fill Company name',
    trim: true
  },
  address: {
    type: String,
    required: 'Please fill Company address'
  },
  taxid: {
    type: String,
    default: '',
    unique: true,
    required: 'Please fill Company taxid',
    trim: true
  },
  brunch: String,
  telofficeno: String,
  mobileno: String,
  faxno: String,
  email: String,
  contact: String,
  website: String,
  creditday: {
    type: Number,
    default: 0
  },
  note: String,
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Company', CompanySchema);
