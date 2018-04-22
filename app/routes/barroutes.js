var Bar = require('../models/bar');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

router.findAll = function(req, res) {

    Bar.find(function(err, bars) {
        if (err)
            res.send(err);

        res.json(bars);
    });
}
router.findOne = function(req, res) {

    Bar.find({ "_id" : req.params.id },function(err, Bar) {
        if (err)
            res.json({ message: 'Bar NOT Found!', errmsg : err } );
        else
            res.json(Bar);
    });
}

router.addBar = function(req, res) {

    var bar = new Bar();

    bar.barName = req.body.barName;
    bar.location = req.body.location;
    // bar.earnings = req.body.earnings;

    console.log('Adding bar: ' + JSON.stringify(Bar));


    bar.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Bar  Added!', data: Bar });
    });
}

router.deleteBar = function(req, res) {
    Bar.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            res.send(err);
        else
            res.json({ message: 'Bar Deleted!'});
    });
}

// router.updateBarEarnings = function(req, res) {
//
//     Bar.findById(req.params.id, function(err,bar) {
//         if (err)
//             res.send(err);
//         else {
//             bar.earnings =+ req.body.earnings;
//             bar.save(function (err) {
//                 if (err)
//                     res.send(err);
//                 else
//                     res.json({ message: 'Bar '+bar.barName+' earnings have been updated!', data: bar });
//             });
//         }
//     })
// }

module.exports = router;