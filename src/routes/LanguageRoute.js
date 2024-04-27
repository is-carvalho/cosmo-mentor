const express = require('express')
const { celebrate, Segments, Joi } = require("celebrate");
const LanguageController = require('../controllers/LanguageController');
const routes = express.Router()
const cors = require('cors')
routes.use(cors())

routes.get('/languages', LanguageController.all);

module.exports = routes
