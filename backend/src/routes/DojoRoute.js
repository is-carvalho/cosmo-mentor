const express = require("express");
const { celebrate, Segments, Joi } = require("celebrate");

const routes = express.Router();
const cors = require("cors");
const DojoController = require("../controllers/DojoController");

routes.use(cors());

routes.post(
  "/createDojo",
  //   celebrate({
  //     [Segments.HEADERS]: Joi.object({
  //       questao_id: Joi.required(),
  //       piloto: Joi.required(),
  //       coPiloto: Joi.number.required(),
  //     }).unknown(),
  //   }),
  DojoController.createNewDojo
);

routes.post(
  "/coding-dojo/createQuestion",
  celebrate({
    [Segments.BODY]: Joi.object({
      questao_id: Joi.required(),
      dojoId: Joi.required(),
    }),
  }),
  DojoController.createQuestion
);

routes.get("/coding-dojo", DojoController.all);
routes.get("/dojosAvaliables", DojoController.dojosAvaliable);

routes.get(
  "/question-dojo",
  celebrate({
    [Segments.BODY]: Joi.object({
      dojoId: Joi.required(),
    }).unknown(),
  }),
  DojoController.listAllQuestionDojos
);

// routes.get("/coding-dojo/:id", DojoController.single);

routes.get(
  "/coding-dojo/:id",
  celebrate({
    [Segments.BODY]: Joi.object({
      dojoId: Joi.required(),
    }).unknown(),
  }),
  DojoController.single
);

routes.put(
  `/coding-dojo/:id`,
  celebrate({
    [Segments.HEADERS]: Joi.object({
      dojoId: Joi.number(),
    }).unknown(),
    [Segments.BODY]: Joi.object({
      codigo: Joi.string(),
    }).unknown(),
  }),
  DojoController.update
);

routes.post(
  "/endDojo/",
  celebrate({
    [Segments.BODY]: Joi.object({
      dojoId: Joi.required(),
    }),
  }),
  DojoController.endDojo
);

module.exports = routes;
