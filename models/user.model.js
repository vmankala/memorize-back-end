const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dotenv = require('dotenv');
dotenv.config();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 6,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
}, {
    timestamps: true
});

userSchema.methods.hashPass = function(pass) {
    return bcrypt.hashSync(pass, 10);
}

userSchema.methods.validatePass = function(pass) {
    return bcrypt.compareSync(pass, this.password);
}

userSchema.methods.generateToken = function() {
    const payload = {
        _id: this._id,
        username: this.username
    }
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 1200});
}

const User = mongoose.model('User', userSchema);

module.exports = User;