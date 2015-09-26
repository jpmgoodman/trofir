var express = require('express');
var router = express.Router();
var School = require('../../models/School');

router.route('/')

    .get(function(req, res) {

        School.find(function(err, schools) {
            if (err) res.send(err);
            res.status(200).json(schools);
        });
    })

    .post(function(req, res) {

        var school = new School();
        school.name = req.body.name;
        school.latitude = req.body.latitude;
        school.longitude = req.body.longitude;

        school.save(function(err, school) {
            if (err) res.send(err);
            res.status(201).json({ message: 'School created!', school: school });
        });
    })

    .all(function(req, res) {
        res.status(400).send('Bad HTTP request: ' + req.originalMethod);
    });

router.route('/:school_id')

    .get(function(req, res) {
        School.findById(req.params.school_id, function(err, school) {
            if (err) res.send(err);
            res.status(200).json(school);
        });
    })

    .put(function(req, res) {
        School.findById(req.params.school_id, function(err, school) {
            if (err) res.send(err);

            if (req.body.name)
                school.name = req.body.name;
            if (req.body.latitude)
                school.latitude = req.body.latitude;
            if (req.body.longitude)
                school.longitude = req.body.longitude;

            school.save(function(err) {
                if (err) res.send(err);
                res.status(200).json({ message: school.name + ' updated!' });
            });
        });
    })

    .delete(function(req, res) {
        School.remove({
            _id: req.params.school_id
        }, function(err, school) {
            if (err) res.send(err);
            res.status(200).json({ message: 'Successfully deleted' })
        });
    })

    .all(function(req, res) {
        res.status(400).send('Unsupported HTTP request: ' + req.originalMethod);
    });

module.exports = router;
