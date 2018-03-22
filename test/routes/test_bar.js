var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../server');
var expect = chai.expect;
var Bar = require('../../app/models/bar.js');
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

describe('Bar', function (){
    beforeEach(function (done) {

        Bar.remove({}, function (err) {

            if (err)
                done(err);
            else {
                var bar1 = new Bar();

                bar1._id = "59f6f0b99bd9dc7f544d7dac";
                bar1.barName ='bradys'
                bar1.location = "waterford";
                bar1.earnings = 10000000;

                bar1.save(function (err) {
                    if (err)
                        console.log(err);
                    else {
                        var bar2 = new Bar();

                        bar2._id = "5a00e4020bdef11a9cd6720f";
                        bar2.barName ='martins';
                        bar2.location = "waterford";
                        bar2.earnings = 50000;

                        bar2.save(function (err) {
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
    describe('GET /bar', function () {
        it('should return all the bars in the collection', function(done) {
            chai.request(server)
                .get('/bar')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(2);
                    done();
                });
        });
    });
    describe('GET /bar/id', function () {
        it('should return a single staff member from the collection', function(done) {
            chai.request(server)
                .get('/bar/5a00e4020bdef11a9cd6720f')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(1);
                    done();
                });
        });
    });
   /* describe('POST /Bar', function () {
        it('should return confirmation message and update collection', function(done) {
            var bar = {
                barName: 'McBrides',
                location: 'waterford',
                earnings: 100000
            };
            chai.request(server)
                .post('/bar')
                .send(bar)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('Bar  Added!' ) ;
                    done();
                });
        });
    });*/
    describe('DELETE /bar', function () {
        it('should return confirmation message and delete staff member', function(done) {

            chai.request(server)
                .delete('/bar/59f6f0b99bd9dc7f544d7dac')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('Bar Deleted!' ) ;
                    done();
                });
        });
    });
    // describe('POST /bar/id', function () {
    //     it('should return confirmation message and update bar earnings', function(done) {
    //         var earnings = {
    //             earnings: 50000
    //         };
    //         chai.request(server)
    //             .post('/bar/5a00e4020bdef11a9cd6720f')
    //             .send(earnings)
    //             .end(function(err, res) {
    //                 expect(res).to.have.status(200);
    //                 expect(res.body).to.have.property('message').equal('Bar martins earnings have been updated!' ) ;
    //                 done();
    //             });
    //     });
    // });
});
