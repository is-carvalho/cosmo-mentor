const express = require('express')
const { celebrate, Segments, Joi } = require("celebrate");
const CourseController = require('../controllers/CourseController');
const routes = express.Router()
const cors = require('cors')
routes.use(cors())


/*
retorna um array de cursos com o nome do curso, seu criador, id e descricao
*/
routes.get('/courses', CourseController.all)

routes.get('/course/:id', celebrate({
    [Segments.PARAMS] : Joi.object().keys({
        id: Joi.number().required()
    })
}), CourseController.single)


module.exports = routes
