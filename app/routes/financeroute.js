var Finance = require('../models/finance');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

router.findAll = function(req, res) {

    Finance.find(function(err, finances) {
        if (err)
            res.send(err);

        res.json(finances);
    });
}
router.findOne = function(req, res) {

    Finance.find({ "_id" : req.params.id },function(err, Finance) {
        if (err)
            res.json({ message: 'Finance NOT Found!', errmsg : err } );
        else
            res.json(Finance);
    });
}
router.newFinance = function(req, res) {

    var finance = new Finance();

    finance.income = req.body.income;
    finance.expenditure = req.body.expenditure;
    finance.barName = req.body.barName;
    //finance.profit = req.body.income - req.body.expenditure;

    console.log('Adding finance: ' + JSON.stringify(Finance));


    finance.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Finance  Added!', data: Finance });
    });
}
// router.calculateProfit = function(req, res){
//
//     var profit = income - expenditure;
//
//     if(income == 0 || expenditure == 0) {
//
//         res.send(err)
//
//     }else{
//         res.send(profit)
//     }
// }

// router.deleteBar = function(req, res) {
//     Bar.findByIdAndRemove(req.params.id, function(err) {
//         if (err)
//             res.send(err);
//         else
//             res.json({ message: 'Bar Deleted!'});
//     });
// }

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