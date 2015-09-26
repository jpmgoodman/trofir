var express = require('express');
var router = express.Router();
var School = require('../../models/School');
var Course = require('../../models/Course');
var Message = require('../../models/Message');
var User = require('../../models/User');


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

        if (req.body.distr_area)
            course.distr_area = req.body.distr_area;
        if (req.body.name_tech)
            course.name_tech = req.body.name_tech
        if (req.body.description)
            course.description = req.body.description;
        if (req.body.time_hours)
            course.time_hours = req.body.time_hours;
        if (req.body.time_days)
            course.time_days = req.body.time_days;
        if (req.body.prof)
            course.prof = req.body.prof;
        if (req.body.course_sect)
            course.course_sect = req.body.course_sect;

        School.findOne({ name: req.body.school_name }, function(err, school) {
                            if (err) res.send(err);
                            course.school_id = school.id

                            course.save(function(err, course) {
                                if (err) res.send(err);
                                res.status(201).json({ message: 'Course created!', course: course });
                            });
                        });
    })

    .all(function(req, res) {
        res.status(400).send('Bad HTTP request: ' + req.originalMethod);
    });


// get five most recently visited courses
router.route('/active')

    .get(function(req, res) {
        Course.find().sort({ updated_at: -1}).limit(5).exec(function(err, courses) {
            if (err) res.send(err);
            res.status(200).json(courses);
        });
    })

    .all(function(req, res) {
        res.status(400).send('Unsupported HTTP request: ' + req.originalMethod);
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
            if (req.body.distr_area)
                course.distr_area = req.body.distr_area;
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


/* CONVENIENT ROUTES */

router.route('/:course_id/messages')

    .get(function(req, res) {
        Message .find({ course_id: req.params.course_id })
                .populate({ path: 'user_id', select: 'username avatar_url'})
                .exec(function(err, messages) {
                    if (err) res.send(err);
                    res.status(200).json(messages);
                })
    })

    .all(function(req, res) {
        res.status(400).send('Unsupported HTTP request: ' + req.originalMethod);
    });

router.route('/:course_id/users')
    // returns users, sorted by online, then offline
    .get(function(req, res) {
        User.find({ current_course_id: req.params.course_id }, function(err, users) {
            if (err) res.send(err);
            var numUsers = users.length;
            var online  = [];
            var offline = [];
            var lastPing
            var diff;

            for (var i = 0; i < numUsers; i++) {
                lastPing = new Date(users[i].last_ping_from_user).getTime();
                diff = Date.now() - lastPing;

                // if havent heard back in > 60 secs * 2
                if (diff > 60000*2)
                    offline.push(users[i]);
                else
                    online.push(users[i]);
            }

            courseUsers = { online: online, offline: offline }
            res.status(200).json(courseUsers);
        });
    })

    .all(function(req, res) {
        res.status(400).send('Unsupported HTTP request: ' + req.originalMethod);
    });

module.exports = router;
