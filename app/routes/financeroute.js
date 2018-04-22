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
    finance.profit = req.body.income - req.body.expenditure;

    console.log('Adding finance: ' + JSON.stringify(Finance));


    finance.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Finance  Added!', data: Finance });
    });
};


module.exports = router;