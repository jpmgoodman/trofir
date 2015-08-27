var express = require('express');
var router = express.Router();
var User = require('../../models/User');

router.route('/')
    .get(function(req, res) {

        User.find(function(err, users) {
            if (err) res.send(err);
            res.status(200).json(users);
        });
    })
    .post(function(req, res) {

        var user = new User();
        user.username = req.body.username;

        user.save(function(err) {
            if (err) res.send(err);
            res.status(201).json({ message: 'User created!' });
        });
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
