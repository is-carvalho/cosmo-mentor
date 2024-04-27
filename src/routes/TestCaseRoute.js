const express = require('express')
const { celebrate, Segments, Joi } = require("celebrate");
const TestCaseController = require('../controllers/TestCaseController');
const routes = express.Router()
const cors = require('cors')
routes.use(cors())

routes.get('/testCasesFromQuestion', celebrate({
    [Segments.HEADERS] : Joi.object({
      question: Joi.number().required(),
      visible: Joi.bool()
    }).unknown()
}), TestCaseController.allFromQuestion)

routes.post('/testCase', celebrate({
        [Segments.BODY] : Joi.array().items(Joi.object().keys({ 
                questao: Joi
                        .number().error(new Error('O id da questão é do tipo inteiro.'))
                        .required().error(new Error('O id da questão deve ser informado.')),
                entrada: Joi
                        .string().error(new Error('O campo "entrada" é do tipo textual.'))
                        .required().error(new Error('O campo "entrada" deve ser informado.')),
                saida: Joi
                        .string().error(new Error('O campo "saída" é do tipo textual.'))
                        .required().error(new Error('O campo "saída" deve ser informado.')),
                visivel: Joi
                        .number().error(new Error('O campo "visivel" é do tipo inteiro.'))
                        .required().error(new Error('O campo "visivel" deve ser informado.')),
        }).unknown())
}) , TestCaseController.create);

routes.put('/testCase/:id', celebrate({
        [Segments.PARAMS] : Joi.object().keys({
                id: Joi.number().required()
        }),
        [Segments.BODY] : Joi.object().keys({
                entrada: Joi
                        .string().error(new Error('O campo "entrada" é do tipo textual.'))
                        .required().error(new Error('O campo "entrada" deve ser informado.')),
                saida: Joi
                        .string().error(new Error('O campo "saída" é do tipo textual.'))
                        .required().error(new Error('O campo "saída" deve ser informado.')),
                visivel: Joi
                        .number().error(new Error('O campo "visivel" é do tipo inteiro.'))
                        .required().error(new Error('O campo "visivel" deve ser informado.')),
        }).unknown()
}), TestCaseController.update)

module.exports = routes