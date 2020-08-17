const router = require('express').Router();
let CardSet = require('../models/cardset.model');

const validateToken = require('../validation/token');
const validateCardSet = require('../validation/cardset');
const validateCard = require('../validation/card');

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
            if (cardset) {
                res.status(200).json(cardset);
            } else {
                res.status(404).json({id: "Invalid cardset id"});
            } 
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
                res.status(404).json({id: "Invalid cardset id"});
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
                res.status(404).json({id: "Invalid cardset id"});
            } 
        })
        .catch(err => res.status(400).json('Err: ' + err));
    } else {
        res.status(400).json({token: "Invalid token"});
    }
});

// Add a new card to a cardset
router.post('/:setId/new', (req, res) => {
    const {validToken, tokenError} = validateToken(req.body);
    if (!validToken) {
        return res.status(400).json(tokenError);
    }

    const {validCard, cardErrors} = validateCard(req.body);
    if (!validCard) {
        return res.status(400).json(cardErrors);
    }

    const payload = parseToken(req.body.token);
    if (payload) {
        CardSet.findOne({
            _id: req.params.setId,
            username: payload.username
        })
        .then(cardset => {
            if (cardset) {
                cardset.cards.push({prompt: req.body.prompt, answer: req.body.answer});
                const card = cardset.cards[cardset.cards.length - 1];
                cardset.save()
                    .then(() => res.status(200).json(card))
                    .catch(err => res.status(400).json('Err: ' + err));
            } else {
                res.status(404).json({id: "Invalid cardset id"});
            }
        })
        .catch(err => res.status(400).json('Err: ' + err));
    } else {
        res.status(400).json({token: "Invalid token"});
    }
});

// Get a single card from a set
router.post('/:setId/:cardId', (req, res) => {
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
            if (cardset) {
                const card = cardset.cards.id(req.params.cardId);
                if (card) {
                    res.status(200).json(card);
                } else {
                    res.status(404).json({id: "Invalid card id"});
                }
            } else {
                res.status(404).json({id: "Invalid cardset id"});
            }
        })
        .catch(err => res.status(400).json('Err: ' + err));
    } else {
        res.status(400).json({token: "Invalid token"});
    }
});

// Edit a single card from a set
router.post('/:setId/:cardId/edit', (req, res) => {
    const {validToken, tokenError} = validateToken(req.body);
    if (!validToken) {
        return res.status(400).json(tokenError);
    }

    const {validCard, cardErrors} = validateCard(req.body);
    if (!validCard) {
        return res.status(400).json(cardErrors);
    }

    const payload = parseToken(req.body.token);
    if (payload) {
        CardSet.findOne({
            _id: req.params.setId,
            username: payload.username
        })
        .then(cardset => {
            if (cardset) {
                let card = cardset.cards.id(req.params.cardId);
                if (card) {
                    card.prompt = req.body.prompt;
                    card.answer = req.body.answer;
                    cardset.save()
                        .then(() => res.status(200).json(card))
                        .catch(err => res.status(400).json('Err: ' + err));
                } else {
                    res.status(404).json({id: "Invalid card id"});
                }
            } else {
                res.status(404).json({id: "Invalid cardset id"});
            }
        })
        .catch(err => res.status(400).json('Err: ' + err));
    } else {
        res.status(400).json({token: "Invalid token"});
    }
});

// Delete a single card from a cardset
router.post('/:setId/:cardId/delete', (req, res) => {
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
            if (cardset) {
                let card = cardset.cards.id(req.params.cardId);
                if (card) {
                    card.remove();
                    cardset.save()
                        .then(() => res.status(200).json(card))
                        .catch(err => res.status(400).json('Err: ' + err));
                } else {
                    res.status(404).json({id: "Invalid card id"});
                }
            } else {
                res.status(404).json({id: "Invalid cardset id"});
            }
        })
        .catch(err => res.status(400).json('Err: ' + err));
    } else {
        res.status(400).json({token: "Invalid token"});
    }
});

module.exports = router;