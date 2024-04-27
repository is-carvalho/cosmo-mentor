const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');
const ClassController = require('../controllers/ClassController');
const routes = express.Router();
const cors = require('cors');
routes.use(cors());

/*
get na rota /turma/:id onde id é um parametro onde se coloca o id do curso
retorna false caso erro na query ou um array com as turmas caso contrário
*/
routes.get(
  '/classesUser',
  celebrate({
    [Segments.HEADERS]: Joi.object({
      course: Joi.number().required(),
      user: Joi.number().required(),
    }).unknown(),
  }),
  ClassController.classesUser
);

routes.get(
  '/classesCreatedByUser',
  celebrate({
    [Segments.HEADERS]: Joi.object({
      user: Joi.number().required(),
    }).unknown(),
  }),
  ClassController.classesCreatedByUser
);

routes.get(
  '/class/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().required(),
    }),
  }),
  ClassController.single
);

routes.post(
  '/registerInClass',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      class: Joi.number().required(),
      user: Joi.number().required(),
    }),
  }),
  ClassController.register
);

module.exports = routes;
