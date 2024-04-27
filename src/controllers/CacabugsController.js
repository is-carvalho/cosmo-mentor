const connection = require('../database/connection');

module.exports = {
  all(req, res) {
    connection.query(
      'SELECT * FROM cacabugs_question',
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
  single(req, res) {
    const idQuestao = req.params.idQuestao;

    connection.query(
      `SELECT * FROM cacabugs_question WHERE id = ${idQuestao}`,
      (err, results, fields) => {
        if (err) {
          res.json({
            status: false,
            message: err,
          });
        } else {
          res.json(results[0]);
        }
      }
    );
  },

  submissoesPorUsuario(req, res) {
    const userId = req.params.userId;
    connection.query(
      `SELECT submissoes_cacabugs.id as id_submissao, usuario_id, questao_id, resposta, tipo_resultado_id, nome as nome_linguagem, compilador, submitted_at
      FROM submissoes_cacabugs, tipo_linguagem
      WHERE submissoes_cacabugs.tipo_linguagem_id = tipo_linguagem.id AND usuario_id = ${userId};`,
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

  create(req, res) {
    const dataAtual = new Date();
    const dataTempoInicial = req.body.tempoInicial;
    const dataTempoFinal = req.body.tempoFinal;
    var tempoTotal = Math.floor(
      Math.abs(dataTempoFinal - dataTempoInicial) / 1000
    );
    const tempoTotalData = () => {
      const segundos = tempoTotal >= 60 ? tempoTotal % 60 : tempoTotal;
      const minutos =
        tempoTotal >= 3600
          ? Math.floor((tempoTotal % 3600) / 60)
          : Math.floor(tempoTotal / 60);
      const horas = tempoTotal >= 3600 ? Math.floor(tempoTotal / 3600) : 0;
      return horas + ':' + minutos + ':' + segundos;
    };

    const dadosQuestao = {
      usuario_id: req.params.userId,
      questao_id: req.params.questionId,
      resposta: req.body.result,
      tipo_resultado_id: req.body.resultType,
      tipo_linguagem_id: req.body.language,
      submitted_at: dataAtual,
      tempo_resposta: tempoTotalData(),
    };

    connection.query(
      'INSERT INTO submissoes_cacabugs SET ?',
      dadosQuestao,
      function (err, results, fields) {
        if (err) {
          res.json({
            status: false,
            message: err,
          });
        } else {
          res.json({
            status: true,
            message: 'Resposta registrada com sucesso.',
          });
        }
      }
    );
  },
};
