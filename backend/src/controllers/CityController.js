const connection = require('../database/connection')

module.exports = {	
	all(req, res){
		const estado = req.headers.state
		connection.query(
			'SELECT * FROM municipio WHERE estado_id = ? ORDER BY nome',[estado], 
			function (err, results, fields){
				if(err){
					res.json({
						status: false,
						message: err
					})
				} else {
					res.send(results)
				}
			}
		);
	}
}
