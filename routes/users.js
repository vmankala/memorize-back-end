const router = require('express').Router();
let User = require('../models/user.model');

const validateRegister = require('../validation/register');
const validateLogin = require('../validation/login');

// Register user
router.post('/register', (req, res) => {
    const {valid, errors} = validateRegister(req.body);

    if (!valid) {
        return res.status(400).json(errors);
    }

    User.findOne({
        username: req.body.username
    })
    .then(user => {
        if (!user) {
            let newUser = new User({
                username: req.body.username
            });
            newUser.password = newUser.hashPass(req.body.password);
            newUser.save()
                .then(() => res.status(201).json('User created'))
                .catch(err => res.status(400).json('Err: ' + err));
        } else {
            res.status(409).json({username: 'Username is already taken'});
        }
    })
    .catch(err => res.status(400).json('Err: ' + err));
});

// Login user
router.post('/login', (req, res) => {
    const {valid, errors} = validateLogin(req.body);

    if (!valid) {
        return res.status(400).json(errors);
    }

    User.findOne({
        username: req.body.username
    })
    .then(user => {
        if (user) {
            if (user.validatePass(req.body.password)) {
                let token = user.generateToken();
                res.status(200).json(token);
            } else {
                res.status(401).json({username: 'Password or username does not match'});
            }
        } else {
            res.status(404).json({username: 'Password or username does not match'});
        }
    })
    .catch(err => res.status(400).json('Err: ' + err));
});

module.exports = router;