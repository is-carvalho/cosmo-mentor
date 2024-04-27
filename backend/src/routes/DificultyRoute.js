const express = require('express')
const { celebrate, Segments, Joi } = require("celebrate");
const DificultyController = require('../controllers/DificultyController');
const routes = express.Router()
const cors = require('cors')
routes.use(cors())

routes.get('/dificulties', DificultyController.all);

module.exports = routes