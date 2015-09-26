var express = require('express');
var router = express.Router();
var Avatar = require('../../models/Avatar');

router.route('/')

    .get(function(req, res) {
        Avatar.find(function(err, avatars) {
            if (err) res.send(err);
            res.status(200).json(avatars);
        });
    })

    .post(function(req, res) {
        var avatar = new Avatar();
        avatar.url = req.body.url;

        avatar.save(function(err, avatar) {
            if (err) res.send(err);
            res.status(201).json({ message: 'Avatar created!', avatar: avatar });
        });
    })
    .all(function(req, res) {
        res.status(400).send('Bad HTTP request: ' + req.originalMethod);
    });

router.route('/:avatar_id')

    .get(function(req, res) {
        Avatar.findById(req.params.avatar_id, function(err, avatar) {
            if (err) res.send(err);
            res.status(200).json(avatar);
        });
    })

    .put(function(req, res) {
        Avatar.findById(req.params.avatar_id, function(err, avatar) {
            if (err) res.send(err);

            if (req.body.url)
                avatar.url = req.body.url;

            avatar.save(function(err) {
                if (err) res.send(err);
                res.status(200).json({ message:'Avatar updated!' });
            });
        });
    })

    .delete(function(req, res) {
        Avatar.remove({
            _id: req.params.avatar_id
        }, function(err, avatar) {
            if (err) res.send(err);
            res.status(200).json({ message: 'Successfully deleted avatar' })
        });
    })

    .all(function(req, res) {
        res.status(400).send('Unsupported HTTP request: ' + req.originalMethod);
    });

module.exports = router;
