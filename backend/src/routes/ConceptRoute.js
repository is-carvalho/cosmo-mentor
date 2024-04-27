const express = require('express')
const { celebrate, Segments, Joi } = require("celebrate");
const ConceptController = require('../controllers/ConceptController');
const routes = express.Router()
const cors = require('cors');
routes.use(cors())

routes.get('/concepts', ConceptController.all);
routes.post('/conceptCreate', ConceptController.conceptCreate);

routes.post('/conceptCreate', celebrate({
    [Segments.BODY]: Joi.object().keys({
        curso_id: 1,
        descricao: Joi.string().required().error(new Error('O campo "conceito" deve ser informado.'))
    })
}), ConceptController.conceptCreate);

routes.put('/updateFlagActive', celebrate({
    [Segments.BODY]: Joi.object().keys({
        id_conceito: Joi.number()/*.required().error(new Error('O campo "id_conceito" deve ser informado e precisa ser um número.'))*/,
    }).unknown()
}), ConceptController.updateFlagActive);
/*
routes.get('/:id', (req, res) => {
    const conceitoid = req.params.id
    connection.query('SELECT * FROM questao WHERE conceito_id = ?', [conceitoid], (err, results, fields) => {
        if (err) {
            res.json({
                status: false,
                message: err
            })
        } else {
            res.send(results)
        }
    })
})
*/


module.exports = routes
