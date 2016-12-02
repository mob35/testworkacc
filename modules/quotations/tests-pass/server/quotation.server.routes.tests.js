'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Quotation = mongoose.model('Quotation'),
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
  quotation,
  product,
  product2,
  company;

/**
 * Quotation routes tests
 */
describe('Quotation CRUD tests', function () {

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

    // Save a user to the test db and create new Quotation
    user.save(function () {
      company.save(function () {
        product.save(function () {
          quotation = {
            docno: 'Quotation docno',
            refno: 'Quotation refno',
            client: company,
            items: [{
              product: product,
              qty: 1,
              // unitprice: 107,
              // amount: 107,
              // vatamount: 7,
              // whtamount: 0,
              // totalamount: 107,
            }],
            creditday: 0,
            isincludevat: 0,
            // amount: 107,
            // discountamount: 0,
            // amountafterdiscount: 0,
            // vatamount: 7,
            // totalamount: 107,
            user: user
          };

          done();
        });
      });
    });
  });

  it('should be able to save a Quotation if logged in', function (done) {
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

        // Save a new Quotation
        agent.post('/api/quotations')
          .send(quotation)
          .expect(200)
          .end(function (quotationSaveErr, quotationSaveRes) {
            // Handle Quotation save error
            if (quotationSaveErr) {
              return done(quotationSaveErr);
            }

            // Get a list of Quotations
            agent.get('/api/quotations')
              .end(function (quotationsGetErr, quotationsGetRes) {
                // Handle Quotations save error
                if (quotationsGetErr) {
                  return done(quotationsGetErr);
                }

                // Get Quotations list
                var quotations = quotationsGetRes.body;

                // Set assertions
                (quotations[0].user._id).should.equal(userId);
                (quotations[0].docno).should.match('Quotation docno');
                (quotations[0].refno).should.match('Quotation refno');
                (quotations[0].client.name).should.match('Company Name');
                (quotations[0].items[0].product.name).should.match('Product Name');
                // (quotations[0].items[0].qty).should.match(1);
                // (quotations[0].items[0].unitprice).should.match(107);
                // (quotations[0].items[0].amount).should.match(107);
                // (quotations[0].items[0].vatamount).should.match(7);
                // (quotations[0].items[0].whtamount).should.match(0);
                // (quotations[0].items[0].totalamount).should.match(107);
                // (quotations[0].creditday).should.match(0);
                // (quotations[0].isincludevat).should.match(0);
                // (quotations[0].amount).should.match(107);
                // (quotations[0].discountamount).should.match(0);
                // (quotations[0].amountafterdiscount).should.match(0);
                // (quotations[0].vatamount).should.match(7);
                // (quotations[0].totalamount).should.match(107);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Quotation if not logged in', function (done) {
    agent.post('/api/quotations')
      .send(quotation)
      .expect(403)
      .end(function (quotationSaveErr, quotationSaveRes) {
        // Call the assertion callback
        done(quotationSaveErr);
      });
  });

  it('should not be able to save an Quotation if docno is duplicated', function (done) {

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
        // Save a new quotation
        agent.post('/api/quotations')
          .send(quotation)
          .expect(200)
          .end(function (quotationSaveErr, quotationSaveRes) {
            // Handle quotation save error
            if (quotationSaveErr) {
              return done(quotationSaveErr);
            }
            // Save a new quotation
            agent.post('/api/quotations')
              .send(quotation)
              .expect(400)
              .end(function (quotationSaveErr, quotationSaveRes) {
                // Set message assertion
                (quotationSaveRes.body.message).should.match('11000 duplicate key error collection: mean-test.quotations index: docno already exists');

                // Handle company save error
                done(quotationSaveErr);
              });

          });

      });
  });

  it('should not be able to save an Quotation if no docno is provided', function (done) {
    // Invalidate name field
    quotation.docno = '';

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

        // Save a new Quotation
        agent.post('/api/quotations')
          .send(quotation)
          .expect(400)
          .end(function (quotationSaveErr, quotationSaveRes) {
            // Set message assertion
            (quotationSaveRes.body.message).should.match('Please fill Quotation docno');

            // Handle Quotation save error
            done(quotationSaveErr);
          });
      });
  });

  it('should not be able to save an Quotation if no client is provided', function (done) {
    // Invalidate name field
    quotation.client = null;

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

        // Save a new Quotation
        agent.post('/api/quotations')
          .send(quotation)
          .expect(400)
          .end(function (quotationSaveErr, quotationSaveRes) {
            // Set message assertion
            (quotationSaveRes.body.message).should.match('Please fill Quotation client');

            // Handle Quotation save error
            done(quotationSaveErr);
          });
      });
  });

  it('should be able to update an Quotation if signed in', function (done) {
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

        // Save a new Quotation
        agent.post('/api/quotations')
          .send(quotation)
          .expect(200)
          .end(function (quotationSaveErr, quotationSaveRes) {
            // Handle Quotation save error
            if (quotationSaveErr) {
              return done(quotationSaveErr);
            }

            // Update Quotation name
            quotation.docno = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Quotation
            agent.put('/api/quotations/' + quotationSaveRes.body._id)
              .send(quotation)
              .expect(200)
              .end(function (quotationUpdateErr, quotationUpdateRes) {
                // Handle Quotation update error
                if (quotationUpdateErr) {
                  return done(quotationUpdateErr);
                }

                // Set assertions
                (quotationUpdateRes.body._id).should.equal(quotationSaveRes.body._id);
                (quotationUpdateRes.body.docno).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Quotation if update product', function (done) {
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

        // Save a new Quotation
        agent.post('/api/quotations')
          .send(quotation)
          .expect(200)
          .end(function (quotationSaveErr, quotationSaveRes) {
            // Handle Quotation save error
            if (quotationSaveErr) {
              return done(quotationSaveErr);
            }

            // Update Quotation name
            quotation.docno = 'WHY YOU GOTTA BE SO MEAN?';
            quotation.items.push(product2);
            // Update an existing Quotation
            agent.put('/api/quotations/' + quotationSaveRes.body._id)
              .send(quotation)
              .expect(200)
              .end(function (quotationUpdateErr, quotationUpdateRes) {
                // Handle Quotation update error
                if (quotationUpdateErr) {
                  return done(quotationUpdateErr);
                }

                // Set assertions
                (quotationUpdateRes.body._id).should.equal(quotationSaveRes.body._id);
                (quotationUpdateRes.body.docno).should.match('WHY YOU GOTTA BE SO MEAN?');
                (quotationUpdateRes.body.items.length).should.match(2);
                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Quotations if not signed in', function (done) {
    // Create new Quotation model instance
    var quotationObj = new Quotation(quotation);

    // Save the quotation
    quotationObj.save(function () {
      // Request Quotations
      request(app).get('/api/quotations')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Quotation if not signed in', function (done) {
    // Create new Quotation model instance
    var quotationObj = new Quotation(quotation);

    // Save the Quotation
    quotationObj.save(function () {
      request(app).get('/api/quotations/' + quotationObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('docno', quotation.docno);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Quotation with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/quotations/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Quotation is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Quotation which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Quotation
    request(app).get('/api/quotations/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Quotation with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Quotation if signed in', function (done) {
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

        // Save a new Quotation
        agent.post('/api/quotations')
          .send(quotation)
          .expect(200)
          .end(function (quotationSaveErr, quotationSaveRes) {
            // Handle Quotation save error
            if (quotationSaveErr) {
              return done(quotationSaveErr);
            }

            // Delete an existing Quotation
            agent.delete('/api/quotations/' + quotationSaveRes.body._id)
              .send(quotation)
              .expect(200)
              .end(function (quotationDeleteErr, quotationDeleteRes) {
                // Handle quotation error error
                if (quotationDeleteErr) {
                  return done(quotationDeleteErr);
                }

                // Set assertions
                (quotationDeleteRes.body._id).should.equal(quotationSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Quotation if not signed in', function (done) {
    // Set Quotation user
    quotation.user = user;

    // Create new Quotation model instance
    var quotationObj = new Quotation(quotation);

    // Save the Quotation
    quotationObj.save(function () {
      // Try deleting Quotation
      request(app).delete('/api/quotations/' + quotationObj._id)
        .expect(403)
        .end(function (quotationDeleteErr, quotationDeleteRes) {
          // Set message assertion
          (quotationDeleteRes.body.message).should.match('User is not authorized');

          // Handle Quotation error error
          done(quotationDeleteErr);
        });

    });
  });

  it('should be able to get a single Quotation that has an orphaned user reference', function (done) {
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

          // Save a new Quotation
          agent.post('/api/quotations')
            .send(quotation)
            .expect(200)
            .end(function (quotationSaveErr, quotationSaveRes) {
              // Handle Quotation save error
              if (quotationSaveErr) {
                return done(quotationSaveErr);
              }

              // Set assertions on new Quotation
              (quotationSaveRes.body.docno).should.equal(quotation.docno);
              should.exist(quotationSaveRes.body.user);
              should.equal(quotationSaveRes.body.user._id, orphanId);

              // force the Quotation to have an orphaned user reference
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

                    // Get the Quotation
                    agent.get('/api/quotations/' + quotationSaveRes.body._id)
                      .expect(200)
                      .end(function (quotationInfoErr, quotationInfoRes) {
                        // Handle Quotation error
                        if (quotationInfoErr) {
                          return done(quotationInfoErr);
                        }

                        // Set assertions
                        (quotationInfoRes.body._id).should.equal(quotationSaveRes.body._id);
                        (quotationInfoRes.body.docno).should.equal(quotation.docno);
                        should.equal(quotationInfoRes.body.user, undefined);

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
          Quotation.remove().exec(done);
        });
      });
    });
  });
});
