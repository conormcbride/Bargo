var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../server');
var expect = chai.expect;
var Mail = require('../../app/models/mail.js');
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

describe('Mail', function (){
    beforeEach(function (done) {

        Mail.remove({}, function (err) {

            if (err)
                done(err);
            else {
                var mail1 = new Mail();

                mail1._id = "59f6f0b99bd9dc7f544d7dac";
                mail1.sender ='Brian'
                mail1.recipient = "Frank";
                mail1.bodyOfMessage = "Test 1";

                mail1.save(function (err) {
                    if (err)
                        console.log(err);
                    else {
                        var mail2 = new Mail();

                        mail2._id = "5a00e4020bdef11a9cd6720f";
                        mail2.sender ='Conor'
                        mail2.recipient = "Ian";
                        mail2.bodyOfMessage = "Test 2";
                        mail2.save(function (err) {
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
    describe('GET /mail', function () {
        it('should return all the Mail in the collection', function(done) {
            chai.request(server)
                .get('/mail')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(2);
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
    describe('DELETE /mail', function () {
        it('should return confirmation message and delete mail', function(done) {

            chai.request(server)
                .delete('/mail/59f6f0b99bd9dc7f544d7dac')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('Mail Deleted!' ) ;
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
