const connection = require('../database/connection')

module.exports = {	
	all(req, res){
		connection.query(
            'SELECT curso.*,usuario.nome as nomeCriador, usuario.userName as userNameCriador FROM curso INNER JOIN usuario ON curso.usuario_id=usuario.id', 
            (err,results,fields)=>{
            if(err){
                res.json({
                    status: false,
                    message: err
                })
            }else{
                res.send(results)
            }
        })
    },

    single(req, res){
		const id = req.params.id
        connection.query(
            'SELECT curso.*,usuario.nome as nomeCriador, usuario.userName as userNameCriador FROM curso '+ 
            'INNER JOIN usuario ON curso.usuario_id=usuario.id '+
            'WHERE curso.id=?',[id],
            (err,results,fields)=>{
            if(err){
                res.json({
                    status: false,
                    message: err
                })
            }else{
                res.send(results[0])
            }
        })
	}
}