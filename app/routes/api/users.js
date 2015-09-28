var express = require('express');
var router = express.Router();
var User = require('../../models/User');
var Avatar = require('../../models/Avatar');
var Message = require('../../models/Message');

router.route('/')
    .get(function(req, res) {

        User.find(function(err, users) {
            if (err) res.send(err);
            res.status(200).json(users);
        });

    })
    .post(function(req, res) {

        var user = new User();

        var ip = req.headers['x-forwarded-for'] ||
             req.connection.remoteAddress ||
             req.socket.remoteAddress ||
             req.connection.socket.remoteAddress;

        var username = req.body.username;
        var school_id = req.body.school_id;
        var current_course_id = req.body.current_course_id;
        var saved_course_ids = req.body.saved_course_ids;

        var NUM_AVAILABLE_AVATARS = 100;
        var selected_avatar = Math.floor(Math.random()*NUM_AVAILABLE_AVATARS);

        Avatar.find({}, 'url', function(err, avatars) {
            var avatar_url = err ? 'http://images.freeimages.com/images/thumbs/a31/jessica-1409983.jpg' : avatars[selected_avatar].url;

            user.school_id = school_id
            user.avatar_url = avatar_url;
            user.current_course_id = current_course_id;
            user.username = username;
            user.saved_course_ids = saved_course_ids;
            user.last_logged_on_ip = ip;
            user.last_logged_off_ip = ip;

            user.save(function(err, user) {
                if (err) res.send(err);
                res.status(201).json({ message: 'User created!', user: user });
            });
        });

    })
    .all(function(req, res) {
        res.status(400).send('Bad HTTP request: ' + req.originalMethod);
    });

router.route('/:user_id')

    .get(function(req, res) {
        User.findById(req.params.user_id)
            .populate({ path: 'saved_course_ids' })
            .exec(function(err, user) {
                if (err) res.send(err);
                res.status(200).json(user);
            });
    })

    .put(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err) res.send(err);

            if (req.body.school_id)
                user.school_id = req.body.school_id;
            if (req.body.avatar_url)
                user.avatar_url = req.body.avatar_url;
            if (req.body.current_course_id)
                user.current_course_id = req.body.current_course_id;
            if (req.body.saved_course_ids)
                user.saved_course_ids = req.body.saved_course_ids;
            if (req.body.liked_message_ids)
                user.liked_message_ids = req.body.liked_message_ids;
            if (req.body.username)
                user.username = req.body.username;
            if (req.body.last_logged_on)
                user.last_logged_on = req.body.last_logged_on;
            if (req.body.last_logged_off)
                user.last_logged_off = req.body.last_logged_off;
            if (req.body.last_ping_from_user)
                user.last_ping_from_user = req.body.last_ping_from_user;
            if (req.body.last_logged_on_ip)
                user.last_logged_on_ip = req.body.last_logged_on_ip;
            if (req.body.last_logged_off_ip)
                user.last_logged_off_ip = req.body.last_logged_off_ip;

            user.save(function(err) {
                if (err) res.send(err);
                res.status(200).json({ message: user.username + ' updated!' });
            });
        });

    })

    .delete(function(req, res) {
        User.remove({
            _id: req.params.user_id
        }, function(err, user) {
            if (err) res.send(err);
            res.status(200).json({ message: 'Succes deleted user' });
        });
    })

    .all(function(req, res) {
        res.status(400).send('Unsupported HTTP request: ' + req.originalMethod);
    });

router.route('/:user_id/messages')
    .get(function(req, res) {
        Message.find({ user_id: req.params.user_id }, function(err, messages) {
            if (err) res.send(err);
            res.status(200).json(messages);
        });
    })

    .all(function(req, res) {
        res.status(400).send('Unsupported HTTP request: ' + req.originalMethod);
    });

module.exports = router;
