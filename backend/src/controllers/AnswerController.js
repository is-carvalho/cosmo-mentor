const connection = require("../database/connection")
const cpp = require('../ProcessCode')

module.exports = {

    create (req, res){
        const today = new Date()
        
        const resposta = {
            "usuario_id": req.params.userId,
            "questao_id": req.params.questionId,
            "turma_id": req.params.classId,
            "codigo": req.body.code,
			"feedback_qualitativo": req.body.suggestions,
            "tempo_inicial": req.body.startTime,
            "tempo_final": req.body.finalTime,
            "tipo_linguagem_id": req.body.language,
            "tipo_resultado_id": req.body.resultType,
            "resultado": req.body.result,
            "created_at": today
        }
        
        connection.query('INSERT INTO resposta SET ?', resposta, function (err, results, fields){
            if(err){
                res.json({
                    status: false,
                    message: err
                })
            }else{
                res.json({
                    status: true,
                    message: 'Resposta registrada com sucesso.'
                })
            }
        });
    },

    process(req, res){

		const userData = {
			"codigo": req.body.code,
			"in": req.body.in,
			"out": req.body.out,
			"language": req.body.language			
		}
	
		const retorno = cpp.main({in: userData.in, out: userData.out}, userData.codigo, userData.language)
	
		res.send(retorno)
	},

    checkAnswerUnique (req,res){
		const question = req.params.question
        const user = req.params.user

		connection.query(
			`select id from resposta where tipo_resultado_id = 1 and questao_id = ? and usuario_id = ?;`, [question, user], 
			function (err, results, fields){
				if(err){
					res.json({
						status: false,
						message: err
					})
				} else {
					if(results.length > 1) {
						res.json({
							status: false,
							message: "Questão respondida mais de uma vez."
						})
					} else {
						res.json({
							status: true,
							message: "Questão respondida apenas uma vez."
						})
					}
				} 
		})
	},
}

