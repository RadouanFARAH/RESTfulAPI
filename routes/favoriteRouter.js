const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const Favorite = require('../models/favorite');
const cors = require('./cors');
const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

.get(cors.cors,authenticate.verifyUser, (req,res,next) => {
    Favorite.findOne({user: req.user._id}).populate('user').populate('dishes').exec((err, favorites)=>{
        if (err) return next(err);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites); 
    });
})

.post(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    Favorite.findOne({user:req.user._id}, (err, favorite)=>{
        if (err) return next(err);
        if (!favorite){
            Favorite.create({user: req.user._id})
            .then((favorite)=>{
                for (i=0; i<req.body.length; i++) {
                    favorite.dishes.push({"_id":req.body[i]._id});
                }
                favorite.save()
                .then((favorite)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({favorite, message:'you\'ve just created your list of favorites'}); 
                })
                .catch((err) => {return next(err)})
            })
            .catch((err) => {return next(err)})
        }
        else {
            for (i=0; i<req.body.length; i++) {
                if (favorite.dishes.indexOf(req.body[i]._id)===-1){
                    favorite.dishes.push({"_id":req.body[i]._id});
                }
            }
            favorite.save()
            .then((favorite)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({favorite, message:'you\'ve just added this list to your favorites'}); 
            })
            .catch((err) => {return next(err)})
        }
    })
})


.put(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain');
    res.end('PUT operation not supported on /favorites');
})

.delete(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    Favorite.findOneAndRemove({user: req.user._id}, (err, resp)=>{
        if (err) return next(err);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You have cleared your favorites list');
    })
})


favoriteRouter.route('/:favoriteId')

.get(cors.cors,authenticate.verifyUser,(req,res,next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain');
    res.end('GET not supported on /favorites/'+req.params.favoriteId);
})

.post(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user:req.user._id}, (err, favorite)=>{
        if (err) return next(err);
        if (!favorite){
            Favorite.create({user: req.user._id})
            .then((favorite)=>{
                favorite.dishes.push({"_id":req.params.favoriteId});
                favorite.save()
                .then((favorite)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({favorite, message:'you\'ve just created your list of favorites and added a dish to it'}); 
                })
                .catch((err) => {return next(err)})
            })
            .catch((err) => {return next(err)})
        }
        else {
            if (favorite.dishes.indexOf(req.params.favoriteId)===-1){
                favorite.dishes.push(req.params.favoriteId);
                favorite.save()
                .then((favorite)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({favorite, message:'you\'ve just added a dish to your favorites'}); 
                })
                .catch((err) => {return next(err)})
            }
            else {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Dish' +req.params.favoriteId + 'already exists in your favorites'); 
            }
        }
    })
})

.put(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain');
    res.end('PUT not supported on /favorites/'+req.params.favoriteId);
})

.delete(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) =>{
    Favorite.findOne({user:req.user._id}, (err, favorite)=>{
        if (err) return next(err);
        else if (!favorite){
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.end('You have no favorites to delete from'); 
        }
        else {
            if (favorite.dishes.indexOf(req.params.favoriteId)===-1){
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain');
                res.end('this dish does not exist in your favorites'); 
            }
            else {
                favorite.dishes.splice(favorite.dishes.indexOf(req.params.favoriteId),1)
                favorite.save()
                .then((favorite)=> {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({favorite,message:'Dish' +req.params.favoriteId + 'has been deleted'});
                }).catch((err)=>{return next(err)});
            }
        }
    }).catch((err)=>{return next(err)});
});

module.exports = favoriteRouter;