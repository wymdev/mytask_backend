'use strict';
var dbConn = require('./../../config/dbconfig');
//Tasks object create
var Tasks = function (task) {
    this.title = task.title;
    this.description = task.description;
    this.picture = task.picture;
    this.location = task.location;
    this.status = task.status ? task.status : 1;
    this.created_at = new Date();
};
Tasks.create = function (newTask, steps, result) {
    dbConn.query("INSERT INTO tasks set ?", newTask, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            console.log(res.insertId);
            // result(null, res.insertId);
            const taskId = res.insertId;
            console.log(taskId);

            const taskSteps = steps.map((step) => {
                return [taskId, step.picture, step.description];
            });
            console.log('taskSteps', taskSteps);
            dbConn.query("INSERT INTO task_steps (task_id, picture, description) VALUES ?", [taskSteps], function (err, res) {
                if (err) {
                    dbConn.rollback(function () {
                        console.log("error: ", err);
                        result(err, null);
                    });
                } else {
                    dbConn.commit(function (err) {
                        if (err) {
                            dbConn.rollback(function () {
                                console.log("error: ", err);
                                result(err, null);
                            });
                        } else {
                            console.log(res.insertId);
                            result(null, taskId);
                        }
                    });
                }
            });

        }
    });
};
Tasks.findById = function (id, result) {
    dbConn.query("Select * from tasks where id = ? ", id, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            result(null, res);
        }
    });
};
Tasks.findAll = function (result) {
    const query = `
        SELECT tasks.*, task_steps.picture, task_steps.description
        FROM tasks
        LEFT JOIN task_steps ON tasks.id = task_steps.task_id
    `;

    dbConn.query(query, function (err, rows) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            const tasks = {};
            rows.forEach((row) => {
                const taskId = row.id;
                if (!tasks[taskId]) {
                    tasks[taskId] = {
                        id: row.id,
                        title: row.title,
                        description: row.description,
                        picture: row.picture,
                        location: row.location,
                        status: row.status,
                        created_at: row.created_at,
                        updated_at: row.updated_at,
                        deleted_at: row.deleted_at,
                        steps: []
                    };
                }

                if (row.picture && row.description) {
                    tasks[taskId].steps.push({
                        picture: row.picture,
                        description: row.description
                    });
                }
            });

            const taskList = Object.values(tasks);
            console.log('tasks : ', taskList);
            result(null, taskList);
        }
    });
};
Tasks.update = function (id, task, result) {
    dbConn.query("UPDATE tasks SET status=? WHERE id = ?", [task.status, id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        } else {
            result(null, res);
        }
    });
};
Tasks.delete = function (id, result) {
    dbConn.query("DELETE FROM tasks WHERE id = ?", [id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            result(null, res);
        }
    });
};
module.exports = Tasks;