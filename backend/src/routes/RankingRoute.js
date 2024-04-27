const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');

const RankingController = require('../controllers/RankingController');

const routes = express.Router();

const cors = require('cors');

routes.use(cors());

routes.get('/ranking', RankingController.all);

routes.get(
  '/ranking/:idAluno/turmas',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      idAluno: Joi.number().required(),
    }).unknown(),
  }),
  RankingController.turmasAluno
);
routes.get('/ranking/turmas', RankingController.turmas);

routes.get(
  '/ranking/alunos/:idTurma',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      idTurma: Joi.number().required(),
    }).unknown(),
  }),
  RankingController.alunosTurma
);

module.exports = routes;
