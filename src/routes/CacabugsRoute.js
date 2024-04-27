const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');

const CacabugsController = require('../controllers/CacabugsController');

const routes = express.Router();

const cors = require('cors');

routes.use(cors());

// routes.get('/cities', celebrate({
//     [Segments.HEADERS] : Joi.object({
//         state: Joi.number().required()
//     }).unknown()
// }), CityController.all);

routes.get('/cacabugs/questoes', CacabugsController.all);

routes.get(
  '/cacabugs/questoes/:idQuestao',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      idQuestao: Joi.number().required(),
    }).unknown(),
  }),
  CacabugsController.single
);

routes.post(
  '/answercb/:userId/:questionId',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      userId: Joi.number().required(),
      questionId: Joi.number().required(),
    }),
    [Segments.BODY]: Joi.object().keys({
      language: Joi.number().required(),
      result: Joi.string().allow(''),
      resultType: Joi.number().required(),
      tempoInicial: Joi.date().required(),
      tempoFinal: Joi.date().required(),
    }),
  }),
  CacabugsController.create
);

routes.get(
  '/cacabugs/submissoes/:userId',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      userId: Joi.number().required(),
    }).unknown(),
  }),
  CacabugsController.submissoesPorUsuario
);

// routes.post('/processAnswer', celebrate({
//   [Segments.BODY] : Joi.object().keys({
//       code: Joi
//         .string().error(new Error('O código-fonte deve ser uma string.'))
//         .required().error(new Error('O código-fonte deve ser informado.')),
//       language: Joi
//         .number().error(new Error('O tipo de linguagem deve ser um número.'))
//         .required().error(new Error('A linguagem de programação deve ser selecionada.'))
//         .min(1).error(new Error('A linguagem de programação deve ser selecionada.')),
//       in: Joi.array().items(Joi.string()).allow(null),
//       out: Joi.array().items(Joi.string()).allow(null),
//   })
// }), AnswerController.process)

module.exports = routes;
