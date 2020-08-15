const validator = require('validator');

// validation for /users/register endpoint
module.exports = function validateRegister(data) {
    let errors = {}

    data.username = (data.username && data.username.trim()) ? data.username : '';
    data.password = (data.password) ? data.password : '';
    data.password2 = (data.password2) ? data.password2 : '';

    if (validator.isEmpty(data.username, {ignore_whitespace: true})) {
        errors.username = "Username field is required";
    }

    if (validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }

    if (validator.isEmpty(data.password2)) {
        errors.password2 = "Confirm password field is required";
    }

    if (!validator.isLength(data.username, {min: 6})) {
        errors.username = "Username must be at least 6 characters long";
    }

    if (!validator.isLength(data.password, {min: 6})) {
        errors.password = "Password must be at least 6 characters long";
    }

    if (!validator.isAlphanumeric(data.username)) {
        errors.username = "Username must be alphanumeric";
    }

    if (!validator.isAscii(data.password)) {
        errors.password = "Password cannot contain special characters";
    }

    if (!validator.equals(data.password, data.password2)) {
        errors.password2 = "Passwords must match";
    }

    return { valid: Object.keys(errors).length === 0, errors: errors }
}