const validator = require('validator');

// validation for jwt tokens
module.exports = function validateToken(data) {
    data.token = (data.token) ? data.token : '';

    if (!validator.isJWT(data.token)) {
        return {validToken: false, tokenError: 'Invalid token'};
    } else {
        return {validToken: true, tokenError: ''}
    }
}