const router = require('express').Router();
let User = require('../models/user.model')

// Register user
router.post('/register', (req, res) => {
    User.findOne({
        username: req.body.username
    })
    .then(user => {
        if (!user) {
            if (req.body.password.length >= 6) {
                let newUser = new User({
                    username: req.body.username
                });
                newUser.password = newUser.hashPass(req.body.password);
                newUser.save()
                    .then(() => res.status(201).json('User created'))
                    .catch(err => res.status(400).json('Err: ' + err));
            } else {
                res.status(400).json('Err: Password too short')
            }
        } else {
            res.status(409).json('Err: Username taken');
        }
    })
    .catch(err => res.status(400).json('Err: ' + err));
});

// Login user
router.post('/login', (req, res) => {
    User.findOne({
        username: req.body.username
    })
    .then(user => {
        if (user) {
            if (user.validatePass(req.body.password)) {
                let token = user.generateToken();
                res.status(200).json(token);
            } else {
                res.status(401).json('Err: Password does not match');
            }
        } else {
            res.status(404).json('Err: Username does not exist');
        }
    })
    .catch(err => res.status(400).json('Err: ' + err));
});

module.exports = router;