'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Receipt = mongoose.model('Receipt'),
  Product = mongoose.model('Product'),
  Company = mongoose.model('Company'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  receipt,
  product,
  product2,
  company;

/**
 * Receipt routes tests
 */
describe('Receipt CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
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

    product2 = new Product({
      name: 'Product Name2',
      description: 'Product Description2',
      category: 'P',
      buyprice: 50,
      saleprice: 100,
      isincludevat: false,
      unitname: 'Product Unitname2'
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

    // Save a user to the test db and create new Receipt
    user.save(function () {
      company.save(function () {
        product.save(function () {
          receipt = {
            receiptno: 'Receipt receiptno',
            docno: 'Receipt docno',
            refno: 'Receipt refno',
            client: company,
            items: [{
              product: product,
              qty: 1,
            }],
            creditday: 0,
            isincludevat: 0,
            user: user
          };

          done();
        });
      });
    });
  });

  it('should be able to save a Receipt if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Receipt
        agent.post('/api/receipts')
          .send(receipt)
          .expect(200)
          .end(function (receiptSaveErr, receiptSaveRes) {
            // Handle Receipt save error
            if (receiptSaveErr) {
              return done(receiptSaveErr);
            }

            // Get a list of Receipts
            agent.get('/api/receipts')
              .end(function (receiptsGetErr, receiptsGetRes) {
                // Handle Receipts save error
                if (receiptsGetErr) {
                  return done(receiptsGetErr);
                }

                // Get Receipts list
                var receipts = receiptsGetRes.body;

                // Set assertions
                (receipts[0].user._id).should.equal(userId);
                (receipts[0].docno).should.match('Receipt docno');
                (receipts[0].refno).should.match('Receipt refno');
                (receipts[0].client.name).should.match('Company Name');
                (receipts[0].items[0].product.name).should.match('Product Name');
                // (receipts[0].items[0].qty).should.match(1);
                // (receipts[0].items[0].unitprice).should.match(107);
                // (receipts[0].items[0].amount).should.match(107);
                // (receipts[0].items[0].vatamount).should.match(7);
                // (receipts[0].items[0].whtamount).should.match(0);
                // (receipts[0].items[0].totalamount).should.match(107);
                // (receipts[0].creditday).should.match(0);
                // (receipts[0].isincludevat).should.match(0);
                // (receipts[0].amount).should.match(107);
                // (receipts[0].discountamount).should.match(0);
                // (receipts[0].amountafterdiscount).should.match(0);
                // (receipts[0].vatamount).should.match(7);
                // (receipts[0].totalamount).should.match(107);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Receipt if not logged in', function (done) {
    agent.post('/api/receipts')
      .send(receipt)
      .expect(403)
      .end(function (receiptSaveErr, receiptSaveRes) {
        // Call the assertion callback
        done(receiptSaveErr);
      });
  });

  it('should not be able to save an Receipt if docno is duplicated', function (done) {

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;
        // Save a new receipt
        agent.post('/api/receipts')
          .send(receipt)
          .expect(200)
          .end(function (receiptSaveErr, receiptSaveRes) {
            // Handle receipt save error
            if (receiptSaveErr) {
              return done(receiptSaveErr);
            }
            // Save a new receipt
            agent.post('/api/receipts')
              .send(receipt)
              .expect(400)
              .end(function (receiptSaveErr, receiptSaveRes) {
                // Set message assertion
                (receiptSaveRes.body.message).should.match('11000 duplicate key error collection: mean-test.receipts index: docno already exists');

                // Handle company save error
                done(receiptSaveErr);
              });

          });

      });
  });

  it('should not be able to save an Receipt if no receiptno is provided', function (done) {
    // Invalidate receiptno field
    receipt.receiptno = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Receipt
        agent.post('/api/receipts')
          .send(receipt)
          .expect(400)
          .end(function (receiptSaveErr, receiptSaveRes) {
            // Set message assertion
            (receiptSaveRes.body.message).should.match('Please fill Receipt receiptno');

            // Handle Receipt save error
            done(receiptSaveErr);
          });
      });
  });

  it('should not be able to save an Receipt if no docno is provided', function (done) {
    // Invalidate name field
    receipt.docno = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Receipt
        agent.post('/api/receipts')
          .send(receipt)
          .expect(400)
          .end(function (receiptSaveErr, receiptSaveRes) {
            // Set message assertion
            (receiptSaveRes.body.message).should.match('Please fill Receipt docno');

            // Handle Receipt save error
            done(receiptSaveErr);
          });
      });
  });

  it('should not be able to save an Receipt if no client is provided', function (done) {
    // Invalidate name field
    receipt.client = null;

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Receipt
        agent.post('/api/receipts')
          .send(receipt)
          .expect(400)
          .end(function (receiptSaveErr, receiptSaveRes) {
            // Set message assertion
            (receiptSaveRes.body.message).should.match('Please fill Receipt client');

            // Handle Receipt save error
            done(receiptSaveErr);
          });
      });
  });

  it('should be able to update an Receipt if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Receipt
        agent.post('/api/receipts')
          .send(receipt)
          .expect(200)
          .end(function (receiptSaveErr, receiptSaveRes) {
            // Handle Receipt save error
            if (receiptSaveErr) {
              return done(receiptSaveErr);
            }

            // Update Receipt name
            receipt.docno = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Receipt
            agent.put('/api/receipts/' + receiptSaveRes.body._id)
              .send(receipt)
              .expect(200)
              .end(function (receiptUpdateErr, receiptUpdateRes) {
                // Handle Receipt update error
                if (receiptUpdateErr) {
                  return done(receiptUpdateErr);
                }

                // Set assertions
                (receiptUpdateRes.body._id).should.equal(receiptSaveRes.body._id);
                (receiptUpdateRes.body.docno).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Receipt if update product', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Receipt
        agent.post('/api/receipts')
          .send(receipt)
          .expect(200)
          .end(function (receiptSaveErr, receiptSaveRes) {
            // Handle Receipt save error
            if (receiptSaveErr) {
              return done(receiptSaveErr);
            }

            // Update Receipt name
            receipt.docno = 'WHY YOU GOTTA BE SO MEAN?';
            receipt.items.push(product2);
            // Update an existing Receipt
            agent.put('/api/receipts/' + receiptSaveRes.body._id)
              .send(receipt)
              .expect(200)
              .end(function (receiptUpdateErr, receiptUpdateRes) {
                // Handle Receipt update error
                if (receiptUpdateErr) {
                  return done(receiptUpdateErr);
                }

                // Set assertions
                (receiptUpdateRes.body._id).should.equal(receiptSaveRes.body._id);
                (receiptUpdateRes.body.docno).should.match('WHY YOU GOTTA BE SO MEAN?');
                (receiptUpdateRes.body.items.length).should.match(2);
                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Receipts if not signed in', function (done) {
    // Create new Receipt model instance
    var receiptObj = new Receipt(receipt);

    // Save the receipt
    receiptObj.save(function () {
      // Request Receipts
      request(app).get('/api/receipts')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Receipt if not signed in', function (done) {
    // Create new Receipt model instance
    var receiptObj = new Receipt(receipt);

    // Save the Receipt
    receiptObj.save(function () {
      request(app).get('/api/receipts/' + receiptObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('docno', receipt.docno);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Receipt with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/receipts/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Receipt is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Receipt which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Receipt
    request(app).get('/api/receipts/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Receipt with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Receipt if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Receipt
        agent.post('/api/receipts')
          .send(receipt)
          .expect(200)
          .end(function (receiptSaveErr, receiptSaveRes) {
            // Handle Receipt save error
            if (receiptSaveErr) {
              return done(receiptSaveErr);
            }

            // Delete an existing Receipt
            agent.delete('/api/receipts/' + receiptSaveRes.body._id)
              .send(receipt)
              .expect(200)
              .end(function (receiptDeleteErr, receiptDeleteRes) {
                // Handle receipt error error
                if (receiptDeleteErr) {
                  return done(receiptDeleteErr);
                }

                // Set assertions
                (receiptDeleteRes.body._id).should.equal(receiptSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Receipt if not signed in', function (done) {
    // Set Receipt user
    receipt.user = user;

    // Create new Receipt model instance
    var receiptObj = new Receipt(receipt);

    // Save the Receipt
    receiptObj.save(function () {
      // Try deleting Receipt
      request(app).delete('/api/receipts/' + receiptObj._id)
        .expect(403)
        .end(function (receiptDeleteErr, receiptDeleteRes) {
          // Set message assertion
          (receiptDeleteRes.body.message).should.match('User is not authorized');

          // Handle Receipt error error
          done(receiptDeleteErr);
        });

    });
  });

  it('should be able to get a single Receipt that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Receipt
          agent.post('/api/receipts')
            .send(receipt)
            .expect(200)
            .end(function (receiptSaveErr, receiptSaveRes) {
              // Handle Receipt save error
              if (receiptSaveErr) {
                return done(receiptSaveErr);
              }

              // Set assertions on new Receipt
              (receiptSaveRes.body.docno).should.equal(receipt.docno);
              should.exist(receiptSaveRes.body.user);
              should.equal(receiptSaveRes.body.user._id, orphanId);

              // force the Receipt to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Receipt
                    agent.get('/api/receipts/' + receiptSaveRes.body._id)
                      .expect(200)
                      .end(function (receiptInfoErr, receiptInfoRes) {
                        // Handle Receipt error
                        if (receiptInfoErr) {
                          return done(receiptInfoErr);
                        }

                        // Set assertions
                        (receiptInfoRes.body._id).should.equal(receiptSaveRes.body._id);
                        (receiptInfoRes.body.docno).should.equal(receipt.docno);
                        should.equal(receiptInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Company.remove().exec(function () {
        Product.remove().exec(function () {
          Receipt.remove().exec(done);
        });
      });
    });
  });
});
