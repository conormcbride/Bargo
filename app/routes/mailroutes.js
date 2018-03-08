var Mail = require('../models/mail');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

router.findAll = function(req, res) {

    Mail.find(function(err, mails) {
        if (err)
            res.send(err);

        res.json(mails);
    });
}
router.findOne = function(req, res) {

    Mail.find({ "_id" : req.params.id },function(err, Mail) {
        if (err)
            res.json({ message: 'Mail NOT Found!', errmsg : err } );
        else
            res.json(Mail);
    });
}

router.addMail = function(req, res) {

    var mail = new Mail();

    mail.sender = req.body.sender;
    mail.recipient = req.body.recipient;
    mail.bodyOfMessage = req.body.bodyOfMessage;


    console.log('Adding mail: ' + JSON.stringify(Mail));


    mail.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Mail  sent!', data: Mail });
    });
}

router.deleteMail = function(req, res) {
    Mail.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            res.send(err);
        else
            res.json({ message: 'Mail Deleted!'});
    });
}


module.exports = router;