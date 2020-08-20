const validator = require('validator');

// validation for new/edited card set -- does not modify card subdocument
module.exports = function validateCardSet(data) {
    let errors = {};

    data.title = (data.title && data.title.trim()) ? data.title : '';
    data.description = (data.description) ? data.description : '';

    if (!validator.isAscii(data.title)) {
        errors.title = 'Title cannot have special characters';
    }

    if (validator.isEmpty(data.title, {ignore_whitespace: true})) {
        errors.title = 'Title field is required';
    }

    return { validSet: Object.keys(errors).length === 0, setErrors: errors }
}