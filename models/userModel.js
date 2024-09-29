// models/userModel.js

const mongoose = require('mongoose');

// Define Mongoose User Schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

// Create and export the Mongoose model
const User = mongoose.model('User', userSchema);

module.exports = User;
