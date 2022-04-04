const path = require('path');
const db = require('../database/models');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator')

const moviesController = {

    list: (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies});
            })
            .catch((error)=>console.log(error));
    },
    detail: (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            })
            .then((error)=>console.log(error));
    },
    new: (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
        .then(movies => {
            res.render('newestMovies', {movies});
        })
        .catch((error)=>console.log(error));
    },

    recomended: (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
        .then(movies => {
            res.render('recommendedMovies.ejs', {movies});
        })
        .catch((error)=>console.log(error));
    },

    //Aqui dispongo las rutas para trabajar con el CRUD.

    add: (req, res) => {
        db.Genre.findAll()
        .then((allGenres) => {
            res.render('moviesAdd', {
                allGenres
            });
        })
        .catch((error)=>console.log(error));
    },

    create: (req, res) => {
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            const {title, rating, awards, release_date, length, genre_id} = req.body;
            db.Movie.create({title, rating, awards, release_date, length, genre_id})
            .then((movie)=>{
                res.redirect('/movies');
            })
            .catch((error)=>console.log(error));
        } else {
            db.Genre.findAll()
            .then((allGenres) => {
                res.render('moviesAdd', {
                    allGenres,
                    errors: errors.mapped(),
                    old: req.body
                });
            })
            .catch((error)=>console.log(error)); 
        }
    },

    edit: (req, res) => {
        const movie = db.Movie.findByPk(req.params.id);
        const allGenres = db.Genre.findAll();
        Promise.all([movie, allGenres])
        .then(([movie, allGenres])=>{
            res.render('moviesEdit', {movie, allGenres});
        })
        .catch((error)=>console.log(error));
    },

    update: (req,res) => {
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            const {title, rating, awards, release_date, length, genre_id} = req.body;
            db.Movie.update({
                title, 
                rating, 
                awards, 
                release_date, 
                length, 
                genre_id
            }, 
            {
                where: {id: req.params.id}
            })
            .then(()=>{
                res.redirect('/movies');
            })
            .catch((error)=>console.log(error));
        } else {
            const movie = db.Movie.findByPk(req.params.id);
            const allGenres = db.Genre.findAll();
            Promise.all([movie, allGenres])
            .then(([movie, allGenres])=>{
                res.render('moviesEdit', {
                    movie, 
                    allGenres,
                    errors: errors.mapped(),
                    old: req.body
                });
            })
            .catch((error)=>console.log(error)); 
        }
    },

    delete: (req,res) => {
        db.Movie.findByPk(req.params.id)
        .then((movie)=>{
            res.render('moviesDelete', {movie});
        })
        .catch((error)=>console.log(error));
    },

    destroy: (req,res) => {
        db.Movie.destroy({where: {id: req.params.id}})
        .then(()=>{
            res.redirect('/movies');
        })
        .catch((error)=>console.log(error));
    }
}

module.exports = moviesController;