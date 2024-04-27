const express = require('express')
const { celebrate, Segments, Joi } = require("celebrate");

const CityController = require('../controllers/CityController');

const routes = express.Router()

const cors = require('cors')

routes.use(cors())

routes.get('/cities', celebrate({
    [Segments.HEADERS] : Joi.object({
        state: Joi.number().required()
    }).unknown()
}), CityController.all);

module.exports = routes
