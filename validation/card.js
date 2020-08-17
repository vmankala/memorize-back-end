const validator = require('validator');

// validation for card endpoints
module.exports = function validateCard(data) {
    let errors = {}

    data.prompt = (data.prompt && data.prompt.trim()) ? data.prompt : '';
    data.answer = (data.answer && data.answer.trim()) ? data.answer : '';

    if (validator.isEmpty(data.prompt, {ignore_whitespace: true})) {
        errors.prompt = 'Prompt field is required';
    }

    if (validator.isEmpty(data.answer, {ignore_whitespace: true})) {
        errors.answer = 'Answer field is required';
    }

    return { validCard: Object.keys(errors).length === 0, cardErrors: errors }
}