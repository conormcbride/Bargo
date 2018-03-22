var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../server');
var expect = chai.expect;
var Staff = require('../../app/models/staff');
chai.use(chaiHttp);
var _ = require('lodash' );
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/staffs');
var db = mongoose.connection;

db.on('error', function (err) {
    console.log('connection error', err);
});
db.once('open', function () {
    console.log('connected to database');
});

describe('Staff', function (){
    beforeEach(function (done) {

        Staff.remove({}, function (err) {

            if (err)
                done(err);
            else {
                var staff1 = new Staff();

                staff1._id = "59f6f0b99bd9dc7f544d7dac";
                staff1.name = "lukas";
                staff1.wage = 10;
                staff1.role = "waiter";
                staff1.daysabsent = 0;



                staff1.save(function (err) {
                    if (err)
                        console.log(err);
                    else {
                        var staff2 = new Staff();

                        staff2._id = "5a01839c6ae69425c47e1faf";
                        staff2.name = "siobhan";
                        staff2.wage = 10;
                        staff2.role = "bar";
                        staff2.daysabsent = 0;

                        staff2.save(function (err) {
                            if (err)
                                console.log(err);
                            else {
                                done();
                            }
                        });
                    }
                });
            }
        });
    });
    describe('GET /staff', function () {
        it('should return all the staff members in the collection', function(done) {
            chai.request(server)
                .get('/staff')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(2);
                    done();
                });
        });
    });
    describe('POST /staff', function () {
        it('should return confirmation message and update collection', function(done) {
            var staff = {
                staffid:101,
                name: 'Brian Mcbride',
                wage: 10,
                role: 'waiter'
            };
            chai.request(server)
                .post('/staff')
                .send(staff)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('Staff Member Added!' ) ;
                    done();
                });
        });
    });
    describe('GET /staff/id', function () {
        it('should return a single staff member from the collection', function(done) {
            chai.request(server)
                .get('/staff/5a01839c6ae69425c47e1faf')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(1);
                    done();
                });
        });
    });

   // describe('POST /staff', function () {
   //      it('should return confirmation message and update staff members wages', function(done) {
   //          var staff = {
   //              wage: 10
   //          };
   //          chai.request(server)
   //              .post('/staff/5a01839c6ae69425c47e1faf')
   //              .send(staff)
   //              .end(function(err, res) {
   //                  expect(res).to.have.status(200);
   //                  expect(res.body).to.have.property('message').equal('Staff member siobhan rate of pay has been updated!' ) ;
   //                  done();
   //              });
   //      });
   //  });
    describe('DELETE /staff', function () {
        it('should return confirmation message and delete staff member', function(done) {

            chai.request(server)
                .delete('/staff/59f6f0b99bd9dc7f544d7dac')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('Staff member Deleted!' ) ;
                    done();
                });
        });
    });
    // describe('PUT /staff/:id', function () {
    //     it('should change the absent days by one and print message', function(done) {
    //         chai.request(server)
    //             .put('/staff/5a01839c6ae69425c47e1faf')
    //             .end(function(err, res) {
    //                 expect(res).to.have.status(200);
    //                 expect(res.body).to.have.property('message').equal('Days Absent updated' ) ;
    //                 done();
    //             });
    //     });
    //
    //
    // });
});
