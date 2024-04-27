const express = require("express");
const { celebrate, Segments, Joi } = require("celebrate");
const NotificationController = require("../controllers/NotificationController");
const routes = express.Router();
const cors = require("cors");
routes.use(cors());

routes.get(
  "/notifications",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      idUser:
        Joi.number() /*.required().error(new Error('O campo "idUser" deve ser informado.'))*/,
      entityID:
        Joi.number() /*.required().error(new Error('O campo "entityID" deve ser informado.'))*/,
      type: Joi.string() /*.required().error(new Error('O campo "type" deve ser informado.'))*/,
    }).unknown(),
  }),
  NotificationController.all
);

routes.get(
  "/userNotifications",
  celebrate({
    [Segments.HEADERS]: Joi.object()
      .keys({
        userId:
          Joi.number() /*.required()/*.error(new Error('O campo "userId" deve ser informado e precisa ser um numero.'))*/,
      })
      .unknown(),
  }),
  NotificationController.userNotifications
);

routes.post(
  "/registerNotification",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      idUser:
        Joi.number() /*.required().error(new Error('O campo "idUser" deve ser informado.'))*/,
      entityID:
        Joi.number() /*.required().error(new Error('O campo "entityID" deve ser informado.'))*/,
      type: Joi.string() /*.required().error(new Error('O campo "type" deve ser informado.'))*/,
    }).unknown(),
  }),
  NotificationController.insertRecord
);

routes.put(
  "/updateNotification",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      idUser:
        Joi.number() /*.required().error(new Error('O campo "idUser" deve ser informado.'))*/,
      entityID:
        Joi.number() /*.required().error(new Error('O campo "entityID" deve ser informado.'))*/,
      type: Joi.string() /*.required().error(new Error('O campo "type" deve ser informado.'))*/,
    }).unknown(),
  }),
  NotificationController.updateRecord
);

routes.put(
  "/readNotification",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      notificationID: Joi.number(), //.required().error(new Error('O campo "notificationID" deve ser informado.'))
    }).unknown(),
  }),
  NotificationController.setRead
);

module.exports = routes;
