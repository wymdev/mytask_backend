'use strict';
const Tasks = require('../models/tasklist.models');
exports.findAll = function (req, res) {
    Tasks.findAll(function (err, task) {
        console.log('controller')
        if (err)
            res.send(err);
        console.log('res', task);
        res.send(task);
    });
};
exports.create = function (req, res) {
    const new_task = new Tasks(req.body);
    //handles null error
    // console.log(req.body);
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({ error: true, message: 'Please provide all required field' });
    } else {
        const steps = req.body.steps || []; 
        console.log("Steps Object:", steps);
        Tasks.create(new_task,steps, function (err, task) {
            if (err)
                res.send(err);
            res.json({ error: false, message: "New Task added successfully!", data: task });
        });
    }
};
exports.findById = function (req, res) {
    Tasks.findById(req.params.id, function (err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};
exports.update = function (req, res) {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({ error: true, message: 'Please provide all required field' });
    } else {
        Tasks.update(req.params.id, new Tasks(req.body), function (err, task) {
            if (err)
                res.send(err);
            res.json({ error: false, message: 'Task successfully updated' });
        });
    }
};
exports.delete = function (req, res) {
    Tasks.delete(req.params.id, function (err, task) {
        if (err)
            res.send(err);
        res.json({ error: false, message: 'Task successfully deleted' });
    });
};