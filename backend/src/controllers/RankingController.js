const connection = require('../database/connection');

module.exports = {
  all(req, res) {
    connection.query(
      'SELECT id,nome,xp FROM `usuario` WHERE tipo_usuario_id=3 AND id!=1 AND id!=5 ORDER BY `usuario`.`xp` DESC;',
      (err, results, fields) => {
        if (err) {
          res.json({
            status: false,
            message: err,
          });
        } else {
          res.json(results);
        }
      }
    );
  },

  turmasAluno(req, res) {
    const userId = req.params.idAluno;
    connection.query(
      `SELECT turma_id FROM matricula_turma_usuario WHERE usuario_id=${userId};`,
      (err, results, fields) => {
        if (err) {
          res.json({
            status: false,
            message: err,
          });
        } else {
          res.json(results);
        }
      }
    );
  },

  turmas(req, res) {
    connection.query(`SELECT id,nome FROM turma;`, (err, results, fields) => {
      if (err) {
        res.json({
          status: false,
          message: err,
        });
      } else {
        res.json(results);
      }
    });
  },

  alunosTurma(req, res) {
    const idTurma = req.params.idTurma;
    connection.query(
      // `SELECT usuario_id FROM matricula_turma_usuario WHERE turma_id=${idTurma};`,
      `SELECT DISTINCT usuario.id,usuario.nome,usuario.xp FROM matricula_turma_usuario INNER JOIN usuario ON matricula_turma_usuario.turma_id=${idTurma} AND matricula_turma_usuario.usuario_id=usuario.id AND usuario.tipo_usuario_id=3 AND usuario.id!=1 AND usuario.id!=5 ORDER BY usuario.xp DESC;`,
      (err, results, fields) => {
        if (err) {
          res.json({
            status: false,
            message: err,
          });
        } else {
          res.json(results);
        }
      }
    );
  },
};
