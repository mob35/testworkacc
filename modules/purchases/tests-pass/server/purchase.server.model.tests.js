'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Purchase = mongoose.model('Purchase'),
  Product = mongoose.model('Product'),
  Company = mongoose.model('Company');

/**
 * Globals
 */
var user,
  product,
  company,
  purchase;

/**
 * Unit tests
 */
describe('Purchase Model Unit Tests:', function () {
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
      purchase = new Purchase({
        docno: 'Purchase Docno',
        client: company,
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return purchase.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without docno', function (done) {
      purchase.docno = '';

      return purchase.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without client', function (done) {
      purchase.client = null;

      return purchase.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Purchase.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});
