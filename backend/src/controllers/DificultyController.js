const connection = require('../database/connection')

module.exports = {
	all(req, res) {
		connection.query(
			'SELECT * FROM dificuldade',
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
