const dotenv = require('dotenv');
dotenv.config();

const jwt = require('jsonwebtoken');

module.exports = function parseToken(token) {
    let payload;
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        payload = decoded;
    });
    return payload;
}