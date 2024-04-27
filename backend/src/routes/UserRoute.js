const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');

const UserController = require('../controllers/UserController');

const routes = express.Router();

const cors = require('cors');

routes.use(cors());

/*
post na rota register
retorna false caso erro na query ou um status com o email do usuario cadastrado
*/
routes.post(
  '/user',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      nome: Joi.string()
        .error(new Error('O campo "nome completo" é do tipo textual.'))
        .required()
        .error(new Error('O campo "nome completo" deve ser informado.')),
      userName: Joi.string()
        .error(new Error('O campo "nome de usuário" é do tipo textual.'))
        .required()
        .error(new Error('O campo "nome de usuário" deve ser informado.')),
      sexo: Joi.string()
        .error(new Error('O campo "sexo" é do tipo textual.'))
        .required()
        .error(new Error('O campo "sexo" deve ser informado.'))
        .length(1)
        .error(
          new Error('O campo "sexo" deve ter possuir apenas um caractere.')
        ),
      email: Joi.string()
        .error(new Error('O campo "email" é do tipo textual.'))
        .required()
        .error(
          new Error('O campo "email" deve ser informado obrigatoriamente.')
        )
        .email()
        .error(new Error('O campo "email" deve possuir um formato válido.')),
      senha: Joi.string()
        .error(new Error('O campo "senha" é do tipo textual.'))
        .required()
        .error(new Error('O campo "senha" deve ser informado.')),
      municipio: Joi.number()
        .error(new Error('O campo "município" é do tipo numérico.'))
        .required()
        .error(new Error('O campo "município" deve ser informado.')),
      nascimento: Joi.date()
        .error(new Error('O campo "data de nascimento" é do data.'))
        .required()
        .error(new Error('O campo "data de nascimento" deve ser informado.')),
    }),
  }),
  UserController.create
);

routes.post(
  '/login',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      userName: Joi.string()
        .required()
        .error(new Error('O campo "Nome de Usuário" deve ser informado.')),
      senha: Joi.string()
        .required()
        .error(new Error('O campo "Senha" deve ser informado.')),
      nome: Joi.string()
        .required()
        .error(new Error('O campo "Nome" deve ser informado.')),
    }),
  }),
  UserController.login
);

routes.get(
  '/user/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().required(),
    }),
  }),
  UserController.single
);

routes.put(
  '/user/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().required(),
    }),
  }),
  UserController.update
);

routes.post(
  '/checkUserName',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      userName: Joi.string().required(),
    }),
  }),
  UserController.checkUserName
);

routes.post(
  '/checkEmail',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().required().email(),
    }),
  }),
  UserController.checkEmail
);

/*
routes.get('/knowledge/:id', celebrate({
	[Segments.PARAMS] : Joi.object().keys({
        id: Joi.number().required()
    })
}), UserController.knowledge)
*/

routes.put(
  '/userAfterCorrectAnswer/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().required(),
    }),
    [Segments.BODY]: Joi.object().keys({
      value: Joi.number().required(),
    }),
  }),
  UserController.updateAfterCorrectAnswer
);

routes.put(
  '/title',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      titleId: Joi.number()/*.required()*/,
      user: Joi.number()/*.required()*/,
    }),
  }),
  UserController.updateTitle
);

routes.get(
  '/userGroup/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number()
        .required()
        .error(new Error('O campo "Nome de Usuário" deve ser informado.')),
    }),
  }),
  UserController.userGroup
);

routes.get('/listAllUsers', UserController.listAllUsers);

module.exports = routes;
