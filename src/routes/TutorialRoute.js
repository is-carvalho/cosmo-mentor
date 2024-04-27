const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');

const TutorialController = require('../controllers/TutorialController');

const routes = express.Router();

const cors = require('cors');

routes.use(cors());

// routes.get('/cities', celebrate({
//     [Segments.HEADERS] : Joi.object({
//         state: Joi.number().required()
//     }).unknown()
// }), CityController.all);

routes.get(
  '/tutorial/:idUsuario',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      idUsuario: Joi.number().required(),
    }).unknown(),
  }),
  TutorialController.showTutorial
);

routes.post(
  '/tutorial/:idUsuario/:status',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      idUsuario: Joi.number().required(),
      status: Joi.boolean().required(),
    }).unknown(),
  }),
  TutorialController.setTutorialStatus
);

// routes.post(
//   '/answercb/:userId/:questionId',
//   celebrate({
//     [Segments.PARAMS]: Joi.object().keys({
//       userId: Joi.number().required(),
//       questionId: Joi.number().required(),
//     }),
//     [Segments.BODY]: Joi.object().keys({
//       language: Joi.number().required(),
//       result: Joi.string().allow(''),
//       resultType: Joi.number().required(),
//       tempoInicial: Joi.date().required(),
//       tempoFinal: Joi.date().required(),
//     }),
//   }),
//   CacabugsController.create
// );

module.exports = routes;