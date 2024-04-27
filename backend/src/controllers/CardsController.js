const connection = require("../database/connection");
let resultado = [];
module.exports = {
  searchQuestions(req, res) {
    // const user = req.params.user
    const user = req.headers.user;
    connection.query(
      `SELECT distinct COUNT(0) as qtCorretas from resposta where usuario_id=? and tipo_resultado_id=1;`,
      [user],
      (err, results, fields) => {
        if (err) {
          res.json({
            status: false,
            message: err,
          });
        } else {
          resultado.push(results);
          // res.send(results)
        }
      }
    );
    connection.query(
      `SELECT COUNT(0) as totalQuestoes from questao;`,
      [user],
      (err, results, fields) => {
        if (err) {
          res.json({
            status: false,
            message: err,
          });
        } else {
          resultado.push(results);
          let porcentagem =
            resultado[0][0].qtCorretas / results[0].totalQuestoes;
          console.log();
          console.log(porcentagem.toFixed(2));
          res.send(porcentagem.toFixed(2));
        }
      }
    );
    resultado = [];
  },
  all(req, res) {
    connection.query(
      "SELECT * FROM estado ORDER BY nome",
      function (err, results, fields) {
        if (err) {
          res.json({
            status: false,
            message: err,
          });
        } else {
          res.send(results);
        }
      }
    );
  },
  searchIdClass(req, res) {
    const user = req.headers.user;
    connection.query(
      `SELECT C.id AS idCurso, C.nome as nomeCurso, C.descricao AS descricaoCurso, MTU.turma_id AS idTurma, T.nome AS nomeTurma FROM curso AS C
			INNER JOIN turma AS T ON (T.curso_id = C.id)
			INNER JOIN matricula_turma_usuario AS MTU ON (MTU.turma_id = T.id AND MTU.data_cancelamento IS NULL)
			WHERE MTU.usuario_id=?;`,
      [user],
      function (err, results, fields) {
        if (err) {
          res.json({
            status: false,
            message: err,
          });
        } else {
          res.send(results);
        }
      }
    );
  },
};
