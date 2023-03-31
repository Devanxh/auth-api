const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name : {type: String, required: true},
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    aadhar: {
        type: String,
        unique: true,
        required: true
    },
    pan: {
        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    }
})

module.exports = mongoose.model('User', userSchema);