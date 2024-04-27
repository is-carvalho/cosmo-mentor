const express = require('express')
const { celebrate, Segments, Joi } = require("celebrate");
const CategoryController = require('../controllers/CategoryController');
const routes = express.Router()
const cors = require('cors')
routes.use(cors())

routes.get('/categories', CategoryController.all);

module.exports = routes