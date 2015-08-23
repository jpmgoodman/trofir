var express = require('express');
var router = express.Router();

router.route('/')
    .get(function(req, res) {
        res.status(200).send('cute GET request bro');
    })
    .post(function(req, res) {
        res.status(201).send('cute POST request bro');
    })
    .all(function(req, res) {
        res.status(400).send('Bad HTTP request: ' + req.originalMethod);
    });

router.route('/:user_id')
    .get(function(req, res) {
        res.status(200).send('cute GET request bro');
    })
    .put(function(req, res) {
        res.status(201).send('cute PUT request bro');
    })
    .delete(function(req, res) {
        res.status(200).send('cute DELETE request bro');
    })
    .all(function(req, res) {
        res.status(400).send('Unsupported HTTP request: ' + req.originalMethod);
    });

router.route('/:user_id/courses')
    .get(function(req, res) {
        res.status(200).send('cute GET request bro');
    })
    .put(function(req, res) {
        res.status(201).send('cute POST request bro');
    })




module.exports = router;
