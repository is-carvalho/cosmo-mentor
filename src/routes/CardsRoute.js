const express = require('express')
const { celebrate, Segments, Joi } = require("celebrate");

const routes = express.Router()
const cors = require('cors');
const CardsController = require('../controllers/CardsController');

routes.use(cors())

routes.get('/searchQuestions', celebrate({
    [Segments.HEADERS]: Joi.object({
        user: Joi.number().required()
    }).unknown()
}), CardsController.searchQuestions)

routes.get('/searchIdClass', celebrate({
    [Segments.HEADERS]: Joi.object({
        user: Joi.number().required()
    }).unknown()
}), CardsController.searchIdClass)

module.exports = routes
