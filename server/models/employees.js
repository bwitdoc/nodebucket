/*=========================
Name: Brittany Dockter
Date: March 10, 2020
Assignment: employees.js
Description: creating a mongoose schema
==========================*/

const mongoose = require('mongoose');

// employee schema
let employeeSchema = mongoose.Schema({
    empId: {type: String, unique: true, dropDups: true},
    firstName: {type: String},
    lastName: {type: String}
});

// export for public use
module.exports = mongoose.model('Employee', employeeSchema);