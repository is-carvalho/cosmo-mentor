const connection = require('../database/connection')

module.exports = {
	all(req, res) {
		connection.query(
			'SELECT * FROM conceito',/*"select id, curso_id, descricao, flagActive, date_format(disponivel_em, '%d-%m-%Y %H:%i:%s') as disponivel_em from conceito;",*/
			function (err, results, fields) {
				if (err) {
					res.json({
						status: false,
						message: err
					})
				} else {
					res.send(results)
				}
			}
		);
	},

	conceptCreate(req, res) {
		console.log(req)
		const conceptData = {
			"curso_id": 1,
			"conceito": req.body.descricao,
			// "curso_id": req.body.curso_id,
			// "descricao": req.body.descricao,
		}
		console.log(conceptData);
		connection.query('INSERT INTO conceito SET curso_id=?, descricao=?', [conceptData.curso_id, conceptData.conceito], function (err, results, fields) {
			if (err) {
				res.json({
					status: false,
					message: err
				})
			} else {
				res.json({
					status: true,
					message: conceptData
				})
			}
		});
	},

	updateFlagActive(req, res) {
		console.log(req)
		const conceptData = {
		  id_conceito: req.body.id_conceito,
		};
	  
		connection.query(
		  "UPDATE conceito SET flagActive=1 WHERE id=?",
		  [
			conceptData.id_conceito
		  ],
		  function (err, results, fields) {
			if (err) {
			  res.json({
				status: false,
				message: err,
			  });
			} else {
			  res.json({
				status: true,
				message: "Conceito atualizado com sucesso",
			  });
			}
		  }
		);
		
	}
}
/*
conceitos.get('/:id',(req,res)=>{
	const conceitoid = req.params.id
	connection.query('SELECT * FROM questao WHERE conceito_id = ?',[conceitoid],(err,results,fields)=>{
		if(err){
			res.json({
				status: false,
				message: err
			})
		}else{
			res.send(results)
		}
	})
})
*/
