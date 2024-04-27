const express = require("express");
const { celebrate, Segments, Joi } = require("celebrate");
const AchievementController = require("../controllers/AchievementController");
const routes = express.Router();
const cors = require("cors");
routes.use(cors());

routes.get("/achievement", AchievementController.all);

routes.get(`/statName/:id_stat`, celebrate({
  [Segments.PARAMS]: Joi.object({
    id_stat: Joi.number().required().error(new Error('O campo "id_stat" deve ser informado.')),
  }).options({ allowUnknown: true }),
}), AchievementController.getStatName);

routes.get(`/statsUser/:id_user`, celebrate({
  [Segments.PARAMS]: Joi.object({
    id_user: Joi.number()/*.required().error(new Error('O campo "id_user" deve ser informado.'))*/,
  }).options({ allowUnknown: true }),
}), AchievementController.getStatsUsuario);

routes.put(`/updateStat/:id_user`, celebrate({
  [Segments.PARAMS]: Joi.object({
    id_user: Joi.number()/*.required().error(new Error('O campo "id_user" deve ser informado.'))*/,
  }).options({ allowUnknown: true }),
  [Segments.BODY]: Joi.object({
    nomeStat: Joi.string()/*.required().error(new Error('O campo "id_user" deve ser informado.'))*/,
    valorStat: Joi.number()/*.required().error(new Error('O campo "id_user" deve ser informado.'))*/,
  }).options({ allowUnknown: true }),
}), AchievementController.updateStat)

routes.post(`/unlockAchievement/`, celebrate({
  [Segments.BODY]: Joi.object({
    userName: Joi.string(),
    userId: Joi.number(),
    achievementName: Joi.string(),
    achievementId: Joi.number(),
  }).options({ allowUnknown: true }),
}), AchievementController.unlockAchievement)

/*routes.get("/duvidas/:idQuestion/:idTurma", AchievementController.getDuvidasQuestao);

routes.get(
  "/forum/reply",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      postId: Joi.number(),
      userId: Joi.number(),
    }).options({ allowUnknown: true }),
  }),
  AchievementController.allReply
);

routes.get("/getForum/:idTurma", AchievementController.getForum);

routes.post(
  "/registerPost",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      userId: Joi.number()
        .required()
        .error(new Error('O campo "userId" deve ser informado.')),
      questionId: Joi.number()
        .required()
        .error(new Error('O campo "questionId" deve ser informado.')),
      forumId: Joi.number()
        .required()
        .error(new Error('O campo "forumId" deve ser informado.')),
      titulo: Joi.string()
        .required()
        .error(new Error('O campo "titulo" deve ser informado.')),
      descricao: Joi.string()
        .required()
        .error(new Error('O campo "descricao" deve ser informado.')),
    }),
  }),
  AchievementController.registerPost
);

routes.post(
  "/forum/registerReply",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      descricao: Joi.string().error(
        new Error('O campo "descricao" deve ser informado e ser string.')
      ),
      userId: Joi.number().error(
        new Error('O campo "userId" deve ser informado e ser number.')
      ),
      postId: Joi.number().error(
        new Error('O campo "postId" deve ser informado e ser number.')
      ),
    }),
  }),
  AchievementController.registerReply
);

routes.get(
  "/userReplies",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      entityID: Joi.number()
        .required()
        .error(
          new Error('O campo "entityID" deve ser informado e ser number.')
        ),
    }),
  }),
  AchievementController.userReplies
);*/

module.exports = routes;
