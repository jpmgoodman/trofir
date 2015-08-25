var express = require('express');
var router = express.Router();
var Course = require('../../models/Course');
var School = require('../../models/School');

router.route('/')

    .get(function(req, res) {
        Course.find(function(err, courses) {
            if (err) res.send(err);
            res.status(200).json(courses);
        });
    })

    .post(function(req, res) {
        var course = new Course();

        course.name = req.body.name;
        course.code = req.body.code;

        if (req.body.name_2)
            course.name_2 = req.body.name_2
        if (req.body.description)
            course.description = req.body.description;
        if (req.body.time_hours)
            course.time_hours = req.body.time_hours;
        if (req.body.time_days)
            course.time_days = req.body.time_days;
        if (req.body.prof)
            course.prof = req.body.prof;
        if (req.body.dept)
            course.dept = req.body.dept;

        School.findOne({ name: req.body.school_name }, function(err, school) {
                            if (err) res.send(err);
                            course.school_id = school.id

                            course.save(function(err) {
                                if (err) res.send(err);
                                res.status(201).json({ message: 'Course created!' });
                            });
                        });
    })

    .all(function(req, res) {
        res.status(400).send('Bad HTTP request: ' + req.originalMethod);
    });

router.route('/:course_id')

    .get(function(req, res) {
        Course.findById(req.params.course_id, function(err, course) {
            if (err) res.send(err);
            res.status(200).json(course);
        });
    })

    .put(function(req, res) {
        Course.findById(req.params.course_id, function(err, course) {
            if (err) res.send(err);

            if (req.body.name)
                course.name = req.body.name;
            if (req.body.name_2)
                course.name_2 = req.body.name_2;
            if (req.body.code)
                course.code = req.body.code;
            if (req.body.description)
                course.description = req.body.description;
            if (req.body.time_hours)
                course.time_hours = req.body.time_hours;
            if (req.body.time_days)
                course.time_days = req.body.time_days;
            if (req.body.prof)
                course.prof = req.body.prof;
            if (req.body.dept)
                course.dept = req.body.dept;
            if (req.body.school_name)
                School.findOne({ name: req.body.school_name }, function(err, school) {
                                    if (err) res.send(err);
                                    course.school_id = school.id

                                    course.save(function(err) {
                                        if (err) res.send(err);
                                        res.status(200).json({ message: course.name + ' updated!' });
                                    });
                                });
            else
                course.save(function(err) {
                    if (err) res.send(err);
                    res.status(200).json({ message: course.name + ' updated!' });
                });
        });
    })

    .delete(function(req, res) {
        Course.remove({
            _id: req.params.course_id
        }, function(err, school) {
            if (err) res.send(err);
            res.status(200).json({ message: 'Successfully deleted' })
        });
    })

    .all(function(req, res) {
        res.status(400).send('Unsupported HTTP request: ' + req.originalMethod);
    });

module.exports = router;
