/*=========================
Name: Brittany Dockter
Date: March 17, 2020
Assignment: item.js
Description: creating a mongoose schema for tasks
==========================*/

// requires mongoose
const mongoose = require('mongoose');

// create an item schema
let itemSchema = mongoose.Schema({
  text: {type: String}
});
// export for public use
module.exports = itemSchema;