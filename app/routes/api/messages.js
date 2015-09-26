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
        message.user_id = req.body.user_id;
        message.course_id = req.body.course_id;
        message.school_id = req.body.school_id;

        message.save(function(err, message) {
            if (err) res.send(err);
            res.status(201).json({ message: 'Message created!', message: message })
        });
    })

    .all(function(req, res) {
        res.status(400).send('Bad HTTP request: ' + req.originalMethod);
    });

router.route('/top')

    .get(function(req, res) {
        Message.find()
                .sort({score: -1})
                .limit(20)
                .populate({ path: 'user_id course_id', select: 'username name_tech'})
                .exec(function(err, messages) {
                    if (err) res.send(err);
                    res.status(200).json(messages);
                });
    })

    .all(function(req, res) {
        res.status(400).send('Unsupported HTTP request: ' + req.originalMethod);
    });

router.route('/:message_id')

    .get(function(req, res) {
        Message.findById(req.params.message_id, function(err, message) {
            if (err) res.send(err);
            res.status(200).json(message);
        });
    })

    .put(function(req, res) {
        Message.findById(req.params.message_id, function(err, message) {
            if (err) res.send(err);

            if (req.body.user_id)
                message.user_id = req.body.user_id;
            if (req.body.course_id)
                message.course_id = req.body.course_id;
            if (req.body.school_id)
                message.school_id = req.body.school_id;
            if (req.body.is_anonymous)
                message.is_anonymous = req.body.is_anonymous;
            if (req.body.content)
                message.content = req.body.content;
            if (req.body.score)
                message.score = req.body.score;

            message.save(function(err) {
                if (err) res.send(err);
                res.status(200).json({ message: 'message updated!' });
            });
        });
    })

    .delete(function(req, res) {
        Message.delete({
            _id: req.params.message_id
        }, function(err, message) {
            if (err) res.send(err);
            res.status(200).json({ message: 'Successfully deleted message' });
        });
    })

    .all(function(req, res) {
        res.status(400).send('Unsupported HTTP request: ' + req.originalMethod);
    });


module.exports = router;
