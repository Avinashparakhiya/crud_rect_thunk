const mongoose = require('mongoose');
const Joi = require('joi');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        unique: true
    },
    mobileNumber: {
        type: String,
    },
    gender: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,

    }
}, {
    timestamps: true
});

var User = mongoose.model('user', UserSchema);

const validate = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().required().label('First Name').min(5),
        lastName: Joi.string().required().label('Last Name'),
        email: Joi.string().email().required().label('Email'),
        mobileNumber: Joi.string().label('Mobile'),
        gender: Joi.string().required().label('Gender'),
        dateOfBirth: Joi.string().required().label('DateOfBirth'),
        password: Joi.string().required().label('Password'),
    });
    return schema.validate(data);
};

module.exports = { User, validate };