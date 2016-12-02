'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Invoice = mongoose.model('Invoice'),
  Product = mongoose.model('Product'),
  Company = mongoose.model('Company');

/**
 * Globals
 */
var user,
  invoice,
  product,
  company;

/**
 * Unit tests
 */
describe('Invoice Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    product = new Product({
      name: 'Product Name',
      description: 'Product Description',
      category: 'P',
      buyprice: 50,
      saleprice: 100,
      isincludevat: false,
      unitname: 'Product Unitname'
    });

    company = new Company({
      name: 'Company Name',
      address: 'Company Address',
      taxid: 'Company TaxId',
      brunch: 'Company Brunch',
      telofficeno: 'Company TelOfficeNo',
      mobile: 'Company Mobile',
      faxno: 'Company FaxNo',
      email: 'Company Email',
      contact: 'Company Contact',
      website: 'Company Website',
      note: 'Company Note'
    });

    user.save(function () {
      invoice = new Invoice({
        docno: 'Quotation Docno',
        client: company,
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return invoice.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without docno', function (done) {
      invoice.docno = '';

      return invoice.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without client', function (done) {
      invoice.client = null;

      return invoice.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Invoice.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});
