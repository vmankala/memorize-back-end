const router = require('express').Router();
let CardSet = require('../models/cardset.model');

const validateToken = require('../validation/token');
const validateCardSet = require('../validation/cardset');

const parseToken = require('../helpers/parsetoken');

// Get all of a user's card sets
router.post('/', (req, res) => {
    const {validToken, tokenError} = validateToken(req.body);
    if (!validToken) {
        return res.status(400).json(tokenError);
    }

    const payload = parseToken(req.body.token);
    if (payload) {
        CardSet.find({
            username: payload.username
        })
        .then(cardsets => {
            res.status(200).json(cardsets);
        })
        .catch(err => res.status(400).json('Err: ' + err));
    } else {
        res.status(400).json({token: "Invalid token"});
    }
});

// Add a new card set
router.post('/new', (req, res) => {
    const {validToken, tokenError} = validateToken(req.body);
    if (!validToken) {
        return res.status(400).json(tokenError);
    }

    const {validSet, setError} = validateCardSet(req.body);
    if (!validSet) {
        return res.status(400).json(setError);
    }

    const payload = parseToken(req.body.token);
    if (payload) {
        let newSet = new CardSet({
            username: payload.username,
            title: req.body.title,
            description: req.body.description
        });
        newSet.save()
            .then(() => res.status(201).json(newSet))
            .catch(err => res.status(400).json('Err: ' + err));
    } else {
        res.status(400).json({token: "Invalid token"});
    }
});

// Get a single card set
router.post('/:setId', (req, res) => {
    const {validToken, tokenError} = validateToken(req.body);
    if (!validToken) {
        return res.status(400).json(tokenError);
    }

    const payload = parseToken(req.body.token);
    if (payload) {
        CardSet.findOne({
            _id: req.params.setId,
            username: payload.username
        })
        .then(cardset => {
            res.status(200).json(cardset);
        })
        .catch(err => res.status(400).json('Err: ' + err));
    } else {
        res.status(400).json({token: "Invalid token"});
    }
});

// Edit a card set (title & description only)
router.post('/:setId/edit', (req, res) => {
    const {validToken, tokenError} = validateToken(req.body);
    if (!validToken) {
        return res.status(400).json(tokenError);
    }

    let {validSet, setError} = validateCardSet(req.body);
    if (!validSet) {
        return res.status(400).json(setError);
    }

    const payload = parseToken(req.body.token);
    if (payload) {
        CardSet.findOne({
            _id: req.params.setId,
            username: payload.username
        })
        .then(cardset => {
            if (cardset) {
                cardset.title = req.body.title;
                cardset.description = req.body.description;
    
                cardset.save()
                    .then(() => res.status(201).json(cardset))
                    .catch(err => res.status(400).json('Err: ' + err));
            } else {
                res.status(400).json({id: "Invalid id"});
            }
        })
        .catch(err => res.status(400).json('Err: ' + err));
    } else {
        res.status(400).json({token: "Invalid token"});
    }
});

// Delete a card set
router.post('/:setId/delete', (req, res) => {
    const {validToken, tokenError} = validateToken(req.body);
    if (!validToken) {
        return res.status(400).json(tokenError);
    }

    const payload = parseToken(req.body.token);
    if (payload) {
        CardSet.findOneAndDelete({
            _id: req.params.setId,
            username: payload.username
        })
        .then(cardset => {
            if (cardset) {
                res.status(200).json(cardset);
            } else {
                res.status(400).json({id: "Invalid id"});
            } 
        })
        .catch(err => res.status(400).json('Err: ' + err));
    } else {
        res.status(400).json({token: "Invalid token"});
    }
});

module.exports = router;