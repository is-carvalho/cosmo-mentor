const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');
const CacabugsManagerController = require('../controllers/CacabugsManagerController');
const routes = express.Router();
const cors = require('cors');
routes.use(cors());

routes.get(
  '/cacabugsmanager',
  celebrate({
    [Segments.HEADERS]: Joi.object({
      user: Joi.number(),
    }).unknown(),
  }),
  CacabugsManagerController.getCacabugsManager
);

routes.post(
  '/cacabugsmanager',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      cbstatus: Joi.boolean().required(),
    }),
  }),
  CacabugsManagerController.postCacabugsManager
);

module.exports = routes;
