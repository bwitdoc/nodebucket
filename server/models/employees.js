/*=========================
Name: Brittany Dockter
Date: March 17, 2020
Assignment: employees.js
Description: creating a mongoose schema -- added todo & done
==========================*/

const mongoose = require('mongoose');
const Item = require('./item');

// employee schema
let employeeSchema = mongoose.Schema({
    empId: {type: String, unique: true, dropDups: true},
    firstName: {type: String},
    lastName: {type: String},
    todo: [Item],
    done: [Item]
});

// export for public use
module.exports = mongoose.model('Employee', employeeSchema);