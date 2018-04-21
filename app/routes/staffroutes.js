var Staff = require('../models/staff');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:LXXURH6t3@ds147459.mlab.com:47459/staffs');

var db = mongoose.connection;

router.findAll = function(req, res) {

    Staff.find(function(err, bars) {
        if (err)
            res.send(err);

        res.json(bars);
    });
}
router.findOne = function(req, res) {

    Staff.find({ "_id" : req.params.id },function(err, Staff) {
        if (err)
            res.json({ message: 'Staff Member NOT Found!', errmsg : err } );
        else
            res.json(Staff);
    });
}

router.newStaff = function(req, res) {

    var staff = new Staff();

    staff.name = req.body.name;
    staff.wage = req.body.wage;
    staff.role = req.body.role;
    staff.daysabsent = req.body.daysabsent;

    console.log('Adding staff member: ' + JSON.stringify(Staff));


    staff.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Staff Member Added!', data: Staff });
    });
}

router.deleteStaff = function(req, res) {

    Staff.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            res.send(err);
        else
            res.json({ message: 'Staff member Deleted!'});
    });
}

router.incrementDaysAbscent = function(req, res) {

    Staff.findById(req.params.id, function(err,staff) {
        if (err)
            res.send(err);
        else {
            staff.daysabsent += 1;
            staff.save(function (err) {
                if (err)
                    res.send(err);
                else
                    res.json({ message: 'Days Absent updated', data: staff });
            });
        }
    });
}

router.updateRateOfPay = function(req, res) {

    Staff.findById(req.params.id, function(err,staff) {
        if (err)
            res.send(err);
        else {
            staff.wage =+ req.body.wage;
            staff.save(function (err) {
                if (err)
                    res.send(err);
                else
                    res.json({ message: 'Staff member '+staff.name+' rate of pay has been updated!', data: staff });
            });
        }
    });
}

db.on('error', function (err) {
    console.log('connection error', err);
});
db.once('open', function () {
    console.log('connected to database');
});
module.exports = router;