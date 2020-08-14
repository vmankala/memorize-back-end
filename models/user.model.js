const mongoose = require('mongoose');
const Schema = mongoose.Schema;
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

userSchema.methods.hashPass = (pass) => {
    return bcrypt.hashSync(pass, 10);
}

userSchema.methods.validatePass = (pass) => {
    return bcrypt.compareSync(pass, this.password);
}

const User = mongoose.model('User', userSchema);

module.exports = User;