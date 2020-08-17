const validator = require('validator');

// validation for jwt tokens
module.exports = function validateToken(token) {
    token = (token) ? token : '';

    if (!validator.isJWT(token)) {
        return {validToken: false, tokenError: 'Invalid token'};
    } else {
        return {validToken: true, tokenError: ''}
    }
}