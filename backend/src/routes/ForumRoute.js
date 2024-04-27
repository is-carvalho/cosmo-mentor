const express = require("express");
const { celebrate, Segments, Joi } = require("celebrate");
const ForumController = require("../controllers/ForumController");
const routes = express.Router();
const cors = require("cors");
routes.use(cors());

routes.get("/forum", ForumController.all);

routes.get("/duvidas/:idQuestion/:idTurma", ForumController.getDuvidasQuestao);

routes.get(
  "/forum/reply",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      postId: Joi.number(),
      userId: Joi.number(),
    }).options({ allowUnknown: true }),
  }),
  ForumController.allReply
);

routes.get("/getForum/:idTurma", ForumController.getForum);

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
  ForumController.registerPost
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
  ForumController.registerReply
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
  ForumController.userReplies
);

module.exports = routes;
