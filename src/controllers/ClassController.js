const connection = require('../database/connection')

module.exports = {	

    classesUser(req, res){
        const cursoid = req.headers.course
        const user = req.headers.user

        /* 'SELECT * FROM turma WHERE curso_id = ?'*/
        connection.query(
            'SELECT turma.*, usuario.userName as userNameCriador, usuario.nome as nomeCriador, matricula.turma_id as registered FROM turma '+ 
            'INNER JOIN usuario ON turma.usuario_id = usuario.id '+
            'LEFT JOIN matricula_turma_usuario as matricula ON turma.id = matricula.turma_id and matricula.usuario_id=? WHERE turma.curso_id=?', 
            [user,cursoid],(err,results,fields)=>{
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

    classesCreatedByUser(req, res){
        const user = req.headers.user
        
        /* 'SELECT * FROM turma WHERE curso_id = ?'*/
        connection.query(
            'SELECT DISTINCT turma.usuario_id, turma.curso_id FROM turma '+
            'WHERE (turma.usuario_id = ? AND turma.status=0) OR (SELECT count(id) from usuario WHERE tipo_usuario_id = 1 and id = ?) = 1',
            [user, user],(err,results,fields)=>{
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
            'SELECT turma.*,usuario.nome as nomeCriador, usuario.userName as userNameCriador, usuario.sexo as sexoCriador FROM turma ' +
            'INNER JOIN usuario ON turma.usuario_id = usuario.id WHERE turma.id=?',[id],
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
    },

    register(req, res){
        const today = new Date()
        const data = {
            "turma_id": req.body.class,
            "usuario_id": req.body.user,
            "data_matricula": today
        }

        connection.query('INSERT INTO matricula_turma_usuario SET ?', data, function (err, results, fields){
            if(err){
                res.json({
                    status: false,
                    message: err
                })
            }else{
                res.json({
                    status: data.usuario_id + ' registrado na turma' + data.turma_id
                })
            }
        });
    }
}
