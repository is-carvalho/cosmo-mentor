const express = require('express')
const { celebrate, Segments, Joi } = require("celebrate");

const AnswerController = require('../controllers/AnswerController');

const routes = express.Router()
const cors = require('cors')

routes.use(cors())

routes.post('/answer/:userId/:questionId/:classId', celebrate({
    [Segments.PARAMS] : Joi.object().keys({
        userId: Joi.number().required(),
        questionId: Joi.number().required(),
        classId: Joi.number().required()
    }),
    [Segments.BODY] : Joi.object().keys({
        code: Joi.string().required(),
        suggestions: Joi.string().required(),
        language: Joi.number().required(),
        startTime: Joi.number().allow(null),
        finalTime: Joi.number().allow(null),
        result: Joi.string().allow(''),
        resultType: Joi.number().required()
    })
}), AnswerController.create)


routes.post('/processAnswer', celebrate({
    [Segments.BODY] : Joi.object().keys({
        code: Joi
					.string().error(new Error('O código-fonte deve ser uma string.'))
					.required().error(new Error('O código-fonte deve ser informado.')),
        language: Joi
					.number().error(new Error('O tipo de linguagem deve ser um número.'))
					.required().error(new Error('A linguagem de programação deve ser selecionada.'))
					.min(1).error(new Error('A linguagem de programação deve ser selecionada.')),
        in: Joi.array().items(Joi.string()).allow(null),
        out: Joi.array().items(Joi.string()).allow(null),
    })
}), AnswerController.process)

routes.get('/checkAnswerUnique/:user/:question', celebrate({
	[Segments.PARAMS] : Joi.object().keys({
        user: Joi.number().required(),
        question: Joi.number().required(),
    })
}), AnswerController.checkAnswerUnique)

module.exports = routes
