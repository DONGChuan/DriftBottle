'use strict';

var express = require('express');
var router = express.Router();

// Import redis.js
var redis = require('../models/redis');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/throw', function(req, res, next) {

    var body = req.body;
    var owner = body.owner;
    var type = body.type;
    var content = body.content;

    if (!(owner && type && content)) {
        return res.json({ code: 0, msg: 'Info not complete'});
    }

    if(type && ['male', 'female'].indexOf(type) === -1) {
        return res.json({ code: 0, msg: 'Type is wrong'});
    }

    redis.throw(body, function(result) {
        res.json(result);
    })
});

router.get('/pick', function(req, res, next) {

    var user = req.query.user;
    var type = req.query.type;

    if (!user) {
        return res.json({ code: 0, msg: 'Info not complete' });
    }

    if (!type || ['male', 'female'].indexOf(type) === -1) {
        return res.json({ code: 0, msg: 'Type is wrong' });
    }

    redis.pick(req.query, function(result) {
        res.json(result);
    });
});

module.exports = router;
