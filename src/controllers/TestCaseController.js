const connection = require('../database/connection')

module.exports = {	
	allFromQuestion(req, res){
		const questao_id = req.headers.question
		const visible = req.headers.visible
		const auxVisible = (visible === undefined ? ';' : (visible ? ' AND CT.visivel = 1' : ' AND CT.visivel = 0'))
		
		connection.query(
			`SELECT * FROM caso_de_teste AS CT WHERE CT.questao_id = ?${auxVisible}`, [questao_id],
			function (err, results, fields){
				if(err){
					res.json({
						status: false,
						message: err
					})
				} else {
					
					let entradas = [];
					let saidas = [];
					let ids = [];
					let visivel = [];

					for (let i = 0; i < results.length; i++) {
						let result = results[i];
						entradas.push(result.entrada);
						saidas.push(result.saida);
						ids.push(result.id);
						visivel.push(result.visivel);					
					}			

					const casosteste = {
						ids: ids,
						entradas: entradas,
						saidas: saidas,
						visivel: visivel
					}

					res.send(casosteste)
				}
			})
	},

	create(req, res){
		//console.log(req.body)

		const testCaseData = req.body.map((ct) => {
			return ([
				ct.questao,
				ct.entrada,
				ct.saida,
				ct.visivel
			]);
		});

		console.log(testCaseData);
		
		connection.query('INSERT INTO caso_de_teste (questao_id, entrada, saida, visivel) VALUES ?', [testCaseData], 
		function (err, results, fields){
			if(err){
				res.json({
					status: false,
					message: err
				})
			}else{
				res.json({
					status: true,
					message: 'Caso de Teste registrado com sucesso'
				})
			}
		});

	},

	update (req, res){
		const today = new Date();
		const testCaseData = {
			"entrada": req.body.entrada,
			"saida": req.body.saida,
			"visivel": req.body.visivel,
			"id": req.params.id,
		}
		
		connection.query('UPDATE caso_de_teste SET entrada=?, saida=?, visivel=? WHERE id=?', 
		[testCaseData.entrada, testCaseData.saida, testCaseData.visivel, testCaseData.id], 
		function (err, results, fields){
			if(err){
				res.json({
					status: false,
					message: err
				})
			}else{
				res.json({
					status: true,
					message: 'Caso de teste atualizado com sucesso',
				})
			}
		});
	}
}
