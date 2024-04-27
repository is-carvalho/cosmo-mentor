const express = require('express')
const { celebrate, Segments, Joi } = require("celebrate");
const StateController = require('../controllers/StateController');
const routes = express.Router()
const cors = require('cors')
routes.use(cors())


routes.get('/states', StateController.all);


module.exports = routes
