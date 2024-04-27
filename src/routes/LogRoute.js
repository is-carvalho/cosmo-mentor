const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');
const LogController = require('../controllers/LogController');
const routes = express.Router();
const cors = require('cors');
routes.use(cors());

routes.get(
  '/logStudents',
  celebrate({
    [Segments.HEADERS]: Joi.object({
      turma: Joi.number().required(),
    }).unknown(),
  }),
  LogController.students
);

routes.get(
  '/logQuestions',
  celebrate({
    [Segments.HEADERS]: Joi.object({
      turma: Joi.number().required(),
    }).unknown(),
  }),
  LogController.questions
);

routes.get(
  '/log/allClassByUser',
  celebrate({
    [Segments.HEADERS]: Joi.object({
      user: Joi.number().required(),
    }).unknown(),
  }),
  LogController.allClassByUser
);

routes.get('/log/courseLog', LogController.courseLog);

routes.post('/log/userLog', LogController.userLog);

/*
 * Rota para pegar todos os logs de submissões de questões
 */

routes.get('/log/allSubmissions', LogController.allSubmissions);

/*
 * Rota para pegar todos os logs de submissões de questões de um usuário, de uma turma e de um curso
 */

routes.get('/log/searchSubmissions', LogController.searchSubmissions);

/*
 * Rota para pegar todos os logs de submissões de questões de um usuário específico, recebendo o id do usuário como parâmetro
 */

routes.get('/log/userSubmissions', LogController.userSubmissions);

/*
 * Rota para pegar todas as emoções de uma questão específica, recebendo o id da questão como parâmetro e o usuario id
 */

routes.get('/log/emotionsOnQuestions', LogController.emotionsOnQuestions);

module.exports = routes;
