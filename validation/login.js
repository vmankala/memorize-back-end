const validator = require('validator');

// validation for /users/login endpoint
module.exports = function validateLogin(data) {
    let errors = {}

    data.username = (data.username && data.username.trim()) ? data.username : '';
    data.password = (data.password) ? data.password : '';

    if (validator.isEmpty(data.username, {ignore_whitespace: true})) {
        errors.username = 'Username field is required';
    }

    if (validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }

    if (!validator.isLength(data.username, {min: 6})) {
        errors.username = 'Please enter a valid username';
    }

    if (!validator.isLength(data.password, {min: 6})) {
        errors.password = 'Please enter a valid password';
    }

    if (!validator.isAlphanumeric(data.username)) {
        errors.username = 'Please enter a valid username';
    }

    if (!validator.isAscii(data.password)) {
        errors.password = 'Please enter a valid password';
    }

    return { valid: Object.keys(errors).length === 0, errors: errors }
}