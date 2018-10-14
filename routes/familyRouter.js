const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Family = require('../models/family');
var authenticate = require('../authenticate');
const cors = require('../cors');

const familyRouter = express.Router();

familyRouter.use(bodyParser.json());

familyRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Family.find(req.query)
    .then((family) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(family);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
    Family.create(req.body)
    .then((family) => {
        console.log('Family members data Created ', family);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(family);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /family');
})
.delete(cors.corsWithOptions, authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
    Family.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

familyRouter.route('/:familyId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Family.findById(req.params.familyId)
    .then((family) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(family);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /family/'+ req.params.familyId);
})
.put(cors.corsWithOptions, authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
    Family.findByIdAndUpdate(req.params.familyId, {
        $set: req.body
    }, { new: true })
    .then((family) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(family);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
    Family.findByIdAndRemove(req.params.familyId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = familyRouter;