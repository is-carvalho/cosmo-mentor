const connection = require('../database/connection')

module.exports = {	
	all(req, res){
		connection.query(
			`SELECT id, nome, compilador, versao, CONCAT(nome," (",compilador," ", versao,")") AS descricao FROM tipo_linguagem`, 
			(err, results, fields) => {
				if(err){
					res.json({
						status: false,
						message: err
					});
				} else {	
					res.send(results);
				}
			}
		)
    }
}