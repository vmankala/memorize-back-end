const validator = require('validator');

// validation for new/edited card set -- does not modify card subdocument
module.exports = function validateCardSet(data) {
    let error = '';

    data.title = (data.title && data.title.trim()) ? data.title : '';
    data.description = (data.description) ? data.description : '';

    if (!validator.isAscii(data.title)) {
        error = 'Title cannot have special characters';
    }

    if (validator.isEmpty(data.title, {ignore_whitespace: true})) {
        error = 'Title field is required';
    }

    return { validSet: error.length === 0, setError: error }
}