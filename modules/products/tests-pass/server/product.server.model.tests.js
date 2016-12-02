'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Product = mongoose.model('Product');

/**
 * Globals
 */
var user,
  product;

/**
 * Unit tests
 */
describe('Product Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function () {
      product = new Product({
        name: 'Product Name',
        description: 'Product Description',
        category: 'P',
        buyprice: 50,
        saleprice: 100,
        isincludevat: false,
        unitname: 'Product Unitname',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return product.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save duplicate name', function (done) {
      var product2 = new Product({
        name: 'Product Name',
        description: 'Product Description',
        category: 'Product Category',
        buyprice: 50,
        saleprice: 100,
        isincludevat: false,
        unitname: 'Product Unitname',
        user: user
      });
      return product.save(function () {
        product2.save(function (err) {
          should.exist(err);
          product.remove(function (err) {
            should.not.exist(err);
            done();
          });
        });
      });
    });

    it('should be able to show an error when try to save without name', function (done) {
      product.name = '';

      return product.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save valid enum value for category', function (done) {
      product.category = 'O';

      return product.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save valid without isincludevat', function (done) {
      product.isincludevat = null;

      return product.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save valid without saleprice', function (done) {
      product.saleprice = null;

      return product.save(function (err) {
        should.exist(err);
        done();
      });
    });

  });

  afterEach(function (done) {
    Product.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});
