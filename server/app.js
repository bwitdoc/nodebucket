/*=========================
Name: Brittany Dockter
Date: March 17, 2020
Assignment: app.js
Description: added all API's
==========================*/

/**
 * Require statements
 */
const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const Employee = require('./models/employees');
const cors = require('cors');

/**
 * App configurations
 */
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended': true}));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../dist/nodebucket')));
app.use('/', express.static(path.join(__dirname, '../dist/nodebucket')));
app.use(cors());

/**
 * Variables
 */
const port = process.env.PORT || 3000; // server port

// TODO: This line will need to be replaced with your actual database connection string
const conn = 'mongodb+srv://admin:admin@bu-webdev-cluster-1-9y4bw.mongodb.net/nodebucket?retryWrites=true&w=majority';

/**
 * Database connection
 */
mongoose.connect(conn, {
  promiseLibrary: require('bluebird'),
  useUnifiedTopology: true,
  useNewUrlParser: true
}).then(() => {
  console.debug(`Connection to the database instance was successful`);
}).catch(err => {
  console.log(`MongoDB Error: ${err.message}`)
}); // end mongoose connection

/**
 * API(s)
 */
// FindEmployeeById -- allows users to find a single employee attached to an employee id
 app.get('/api/employees/:empId', function(req, res, next) {
    Employee.findOne({ 'empId': req.params.empId }, function(err, employee) {
      if(err) {
        console.log(err);
        return next(err);
      } else {
        console.log(employee);
        res.json(employee);
      }
    })
 });

 // FindAllTasks -- allows users to find all tasks for a single user
app.get("/api/employees/:empId/tasks", function(req, res, next) {
  Employee.findOne({ empId: req.params.empId }, "empId todo doing done", function(
    err,
    employee
  ) {
    if (err) {
      console.log(err);
      return next(err);
    } else {
      console.log(employee);
      res.json(employee);
    }
  });
});

// CreateTask -- allows users to create new tasks assigned to a single employee
app.post("/api/employees/:empId/tasks", function(req, res, next) {
  Employee.findOne({ empId: req.params.empId }, function(err, employee) {
    if (err) {
      console.log(err);
      return next(err);
    } else {
      console.log(employee);

      const item = {
        text: req.body.text
      };

      employee.todo.push(item);
      employee.save(function(err, employee) {
        if (err) {
          console.log(err);
          return next(err);
        } else {
          console.log(employee);
          res.json(employee);
        }
      });
    }
  });
});

// UpdateTask -- allows users to update the "status" or "contents" of a task
app.put("/api/employees/:empId/tasks/:taskId", function(req, res, next) {
  Employee.findOne({ empId: req.params.empId }, function(err, employee) {
    if (err) {
      console.log(err);
      return next(err);
    } else {
      console.log(employee);

      // find the item in the database with the ._id
      const todoItem = employee.todo.find(
        item => item._id.toString() === req.params.taskId
      );
      const doingItem = employee.doing.find(
        item => item._id.toString() === req.params.taskId
      );
      const doneItem = employee.done.find(
        item => item._id.toString() === req.params.taskId
      );

      // update the task from the body
      if (todoItem) {
        employee.todo.id(todoItem._id).set({
          todo: req.body.todo,
          doing: req.body.doing,
          done: req.body.done
        });
        employee.save(function(err, emp1) {
          if (err) {
            console.log(err);
            return next(err);
          } else {
            console.log(emp1);
            res.json(emp1);
          }
        });
      } else if (doneItem, doingItem) {
        employee.done.id(doneItem._id, doingItem._id).set({
          done: req.body.done,
          doing: req.body.doing,
          todo: req.body.todo
        });
        // save the task after it has been updated and ran through error handling
        employee.save(function(err, emp2) {
          if (err) {
            console.log(err);
            return next(err);
          } else {
            console.log(emp2);
            res.json(emp2);
          }
        });
      } else {
        // send status code 404 if the taskId from the database can't be found
        console.log("Unable to locate task: ${req.params.taskId}");
        res.status(404).send({
          type: "warning",
          text: "Unable to locate task: ${req.params.taskId}"
        });
      }
    }
  });
});

// DeleteTask -- allows users to delete a task for a single employee
app.delete("/api/employees/:empId/tasks/:taskId", function(req, res, next) {
  Employee.findOne({ empId: req.params.empId }, function(err, employee) {
    if (err) {
      console.log(err);
      return next(err);
    } else {
      console.log(employee);
      // just like the UpdateTask, find the ._id from the database
      const todoItem = employee.todo.find(
        item => item._id.toString() === req.params.taskId
      );
      const doingItem = employee.doing.find(
        item => item._id.toString() === req.params.taskId
      );
      const doneItem = employee.done.find(
        item => item._id.toString() === req.params.taskId
      );
        // remove the todoItem (task) with error handling
      if (todoItem) {
        employee.todo.id(todoItem._id).remove();
        employee.save(function(err, emp1) {
          if (err) {
            console.log(err);
            return next(err);
          } else {
            console.log(emp1);
            res.json(emp1);
          }
        });
        // remove the doneItem (task) with error handling
      } else if (doneItem) {
        employee.done.id(doneItem._id).remove();
        employee.save(function(err, emp2) {
          if (err) {
            console.log(err);
            return next(err);
          } else {
            console.log(emp2);
            res.json(emp2);
          }
        });
      } else if (doingItem) {
        employee.doing.id(doingItem._id).remove();
        employee.save(function(err, emp2) {
          if (err) {
            console.log(err);
            return next(err);
          } else {
            console.log(emp2);
            res.json(emp2);
          }
        });
      } else {
        // send status code 404 if ._id can't be found in database
        console.log("Unable to locate task: ${req.params.taskId}");
        res.status(404).send({
          type: "warning",
          text: "Unable to locate task: ${req.params.taskId}"
        });
      }
    }
  });
});

/**
 * Create and start server
 */
http.createServer(app).listen(port, function() {
  console.log(`Application started and listening on port: ${port}`)
}); // end http create server function
