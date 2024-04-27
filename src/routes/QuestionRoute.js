const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');
const QuestionController = require('../controllers/QuestionController');
const routes = express.Router();
const cors = require('cors');
routes.use(cors());

//retorna as questões que existem dentro de um curso
routes.get(
  '/questions',
  celebrate({
    [Segments.HEADERS]: Joi.object()
      .keys({
        user: Joi.number().required(),
        course: Joi.alternatives(Joi.number(), Joi.string()).required(),
      })
      .unknown(),
  }),
  QuestionController.allInCourse
);

routes.get(
  '/questions3',
  celebrate({
    [Segments.HEADERS]: Joi.object()
      .keys({
        user: Joi.number().required(),
        course: Joi.alternatives(Joi.number(), Joi.string()).required(),
      })
      .unknown(),
  }),
  QuestionController.allInCourse3
);

routes.get(
  '/xpTotalQuestoes',
  celebrate({
    [Segments.HEADERS]: Joi.object()
      .keys({
        cursoid: Joi.number().required(),
      })
      .unknown(),
  }),
  QuestionController.totalXp
);

routes.get(
  '/question/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().required(),
    }),
  }),
  QuestionController.single
);

routes.put(
  '/question/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().required(),
    }),
  }),
  QuestionController.update
);

routes.post('/question', QuestionController.create);

routes.delete(
  '/question/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().required(),
    }),
  }),
  QuestionController.delete
);

routes.get(
  '/searchCardQuestions',
  celebrate({
    [Segments.HEADERS]: Joi.object({
      user: Joi.number().required(),
    }).unknown(),
  }),
  QuestionController.searchCardQuestions
);

routes.get(
  '/allQuestions',
  celebrate({
    [Segments.HEADERS]: Joi.object({
      userId: Joi.number(),
    }).unknown(),
  }),
  QuestionController.allQuestions
);

routes.put(
  '/likeQuestion',
  celebrate({
    [Segments.HEADERS]: Joi.object({
      questaoId: Joi.number(),
    }).unknown(),
  }),
  QuestionController.likeQuestion
);

routes.put(
  '/questionOrder',
  celebrate({
    [Segments.BODY]: Joi.object({
      questionId: Joi.number(),
      newOrder: Joi.number(),
    }).unknown(),
  }),
  QuestionController.updateOrder
);

routes.get('/listAllQuestions', QuestionController.listAllQuestions);

routes.get(
  '/questaoTipoCacabugs/:questionId',
  celebrate({
    [Segments.PARAMS]: Joi.object()
      .keys({
        questionId: Joi.number().required(),
      })
      .unknown(),
  }),
  QuestionController.selectQuestaoEstiloCacabugs
);

routes.post(
  '/submitQuestaoEstiloCacabugs',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      userId: Joi.number().required(),
      questionId: Joi.number().required(),
      language: Joi.number().required(),
      result: Joi.string().allow(''),
      resultType: Joi.number().required(),
      tempoInicial: Joi.date().required(),
      tempoFinal: Joi.date().required(),
    }),
  }),
  QuestionController.submitQuestaoEstiloCacabugs
);

routes.get(
  '/situacaoQuestoesEstiloCacabugs/:userId',
  celebrate({
    [Segments.PARAMS]: Joi.object()
      .keys({
        userId: Joi.number().required(),
      })
      .unknown(),
  }),
  QuestionController.situacaoQuestoesEstiloCacabugs
);

module.exports = routes;
