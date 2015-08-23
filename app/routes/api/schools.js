var express = require('express');
var router = express.Router();
var School = require('../../models/School');

router.route('/')

    // GET request -- works
    .get(function(req, res) {

        School.find(function(err, schools) {
            if (err) res.send(err);
            res.send(schools);
        });
    })

    // POST request -- works
    .post(function(req, res) {

        var school = new School();

        school.name = req.body.name;
        school.latitude = req.body.latitude;
        school.longitude = req.body.longitude;

        school.save(function(err) {
            if (err) res.send(err);
            res.json({ message: 'School created!' });
        });
    })

    // Fallback -- works
    .all(function(req, res) {
        res.send('Bad HTTP request: ' + req.originalMethod);
    });

router.route('/:school_id')

    // GET request -- works
    .get(function(req, res) {
        School.findById(req.params.school_id, function(err, school) {
            if (err) res.send(err);
            res.status(200).json(school);
        });
    })

    // PUT request -- works
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
                res.json({ message: school.name + ' updated!' });
            });
        });
    })

    // DELETE request -- works
    .delete(function(req, res) {
        School.remove({
            _id: req.params.school_id
        }, function(err, school) {
            if (err) res.send(err);
            res.json({ message: 'Successfully deleted' })
        });
    })

    // Fallback -- works
    .all(function(req, res) {
        res.send('Unsupported HTTP request: ' + req.originalMethod);
    });

module.exports = router;
