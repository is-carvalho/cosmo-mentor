const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');
const ImageController = require('../controllers/ImageController');
const routes = express.Router();
const cors = require('cors');
routes.use(cors());

routes.get('/processImage', ImageController.processImage);

routes.post(
  '/insertEmotion',
  //   celebrate({
  //     [Segments.BODY]: Joi.object().keys({
  //       emotion: Joi.string().required(),
  //       question_id: Joi.number().required(),
  //       tipo_momento: Joi.number(),
  //       user_id: Joi.number().required(),
  //     }),
  //   }),
  ImageController.insertEmotion
);

module.exports = routes;
