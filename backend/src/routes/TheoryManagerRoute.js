const express = require("express");
const { celebrate, Segments, Joi } = require("celebrate");

const TheoryManagerController = require("../controllers/TheoryManagerController");

const routes = express.Router();

const cors = require("cors");

routes.use(cors());

routes.get(
  "/theory_manager/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().required(),
    }).unknown(),
  }),
  TheoryManagerController.single
);

routes.get(
  "/theory_manager/:idConceito/view",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      idConceito: Joi.number().required(),
    }).unknown(),
  }),
  TheoryManagerController.getConteudo
);

routes.get(
  "/theory_manager",
  TheoryManagerController.all
);

routes.get(
  "/contents",
  celebrate({
    [Segments.HEADERS]: Joi.object()
      .keys({
        user: Joi.number().required(),
        course: Joi.alternatives(Joi.number(), Joi.string()).required(),
      })
      .unknown(),
  }),
  TheoryManagerController.allInCourse
);

routes.put(
  "/theory_manager/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().required(),
    }),
  }),
  TheoryManagerController.update
);

routes.post(
  "/theory_manager/registerReadingCompletion",
  TheoryManagerController.registerReadingCompletion
);

routes.get(
  "/theory_manager/:idUsuario/:idTeoria/getReadingCompletionDate",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      idUsuario: Joi.number().required(),
      idTeoria: Joi.number().required(),
    }).unknown(),
  }),
  TheoryManagerController.getReadingCompletionDate
);

routes.get(
  "/theory_manager/:idUsuario/getAllReadingCompletionDate",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      idUsuario: Joi.number().required(),
    }).unknown(),
  }),
  TheoryManagerController.getAllReadingCompletionDate
);

routes.post("/theory_manager", TheoryManagerController.create);

routes.post("/upload/image", TheoryManagerController.fileManager);

routes.delete(
  "/theory_manager/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().required(),
    }),
  }),
  TheoryManagerController.delete
);
module.exports = routes;