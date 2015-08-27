var express = require('express');
var router = express.Router();
var Message = require('../../models/Message');

router.route('/')
    .get(function(req, res) {

        Message.find(function(err, messages) {
            if (err) res.send(err);
            res.status(200).json(messages);
        });

    })
    .post(function(req, res) {

        var message = new Message();
        message.content = req.body.content;

        message.save(function(err) {
            if (err) res.send(err);
            res.status(201).json({ message: 'Message created!' })
        });
    })
    .all(function(req, res) {
        res.status(400).send('Bad HTTP request: ' + req.originalMethod);
    });

router.route('/:message_id')
    .get(function(req, res) {
        res.status(200).send('cute GET request bro');
    })
    .put(function(req, res) {
        res.status(201).send('cute POST request bro');
    })
    .delete(function(req, res) {
        res.status(200).send('cute DELETE request bro');
    })
    .all(function(req, res) {
        res.status(400).send('Unsupported HTTP request: ' + req.originalMethod);
    });

module.exports = router;
