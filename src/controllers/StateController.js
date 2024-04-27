const connection = require('../database/connection')

module.exports = {	
	all(req, res){
		connection.query(
			'SELECT * FROM estado ORDER BY nome', 
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
