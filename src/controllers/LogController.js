const connection = require('../database/connection');
const fs = require('fs');

module.exports = {
  students(req, res) {
    const turma_id = req.headers.turma;

    connection.query(
      `SELECT U.id, U.nome, COALESCE(U.xp, 0) AS xp, COALESCE(T1.total,0) AS RespostaCorreta, 
			COALESCE(T3.total,0) AS ErroCompilacao, COALESCE(T2.total,0) AS ErroExecucao, 
			COALESCE(T4.total,0) AS TempoExcedido, COALESCE(T5.total,0) AS Tentativas FROM usuario AS U
			INNER JOIN matricula_turma_usuario AS MTU ON (MTU.usuario_id = U.id and MTU.turma_id = ?)
			LEFT JOIN (SELECT usuario_id, COUNT(distinct questao_id) AS total FROM resposta R1 WHERE R1.tipo_resultado_id = 1 and R1.turma_id=? GROUP BY R1.usuario_id) AS T1 on T1.usuario_id=U.id 
			LEFT JOIN (SELECT usuario_id, COUNT(distinct questao_id) AS total FROM resposta R2 WHERE R2.tipo_resultado_id = 2 and R2.turma_id=? GROUP BY R2.usuario_id) AS T2 on T2.usuario_id=U.id 
			LEFT JOIN (SELECT usuario_id, COUNT(distinct questao_id) AS total FROM resposta R3 WHERE R3.tipo_resultado_id = 3 and R3.turma_id=? GROUP BY R3.usuario_id) AS T3 on T3.usuario_id=U.id 
			LEFT JOIN (SELECT usuario_id, COUNT(distinct questao_id) AS total FROM resposta R4 WHERE R4.tipo_resultado_id = 4 and R4.turma_id=? GROUP BY R4.usuario_id) AS T4 on T4.usuario_id=U.id 
			LEFT JOIN (SELECT usuario_id, COUNT(*) AS total FROM resposta R5 WHERE R5.turma_id=? GROUP BY R5.usuario_id) AS T5 on T5.usuario_id=U.id 
			ORDER BY U.xp DESC;
			`,
      [turma_id, turma_id, turma_id, turma_id, turma_id, turma_id],
      function (err, results, fields) {
        if (err) {
          res.json({
            status: false,
            message: err,
          });
        } else {
          res.json({
            status: true,
            result: results,
          });
        }
      }
    );
  },

  questions(req, res) {
    const turma_id = req.headers.turma;

    connection.query(
      `SELECT Q.id, IF(Q.status = 0, "Ativa", "Excluída"), Q.titulo, U.userName, COALESCE(Q.xp, 0) AS xp, D.descricao AS "dificuldade", C.descricao AS "categoria", CO.descricao AS "conceito", 
			COALESCE(T1.total,0) AS RespostaCorreta, COALESCE(T3.total,0) AS ErroCompilacao, COALESCE(T2.total,0) AS ErroExecucao, 
			COALESCE(T4.total,0) AS TempoExcedido, COALESCE(T5.total,0) AS Tentativas 
			FROM questao AS Q
				INNER JOIN dificuldade AS D ON( Q.dificuldade_id = D.id)
				INNER JOIN conceito AS CO ON( Q.conceito_id = CO.id)
				INNER JOIN categoria AS C ON (Q.categoria_id = C.id)
				INNER JOIN curso AS CU ON (Q.curso_id = CU.id)
				INNER JOIN turma AS TU ON (TU.curso_id = CU.id and TU.id=?)
				INNER JOIN usuario AS U ON (Q.usuario_id = U.id)
			LEFT JOIN (SELECT questao_id, COUNT(distinct usuario_id) AS total FROM resposta R1 WHERE R1.tipo_resultado_id = 1 and R1.turma_id=? GROUP BY R1.questao_id) AS T1 on T1.questao_id=Q.id 
			LEFT JOIN (SELECT questao_id, COUNT(distinct usuario_id) AS total FROM resposta R2 WHERE R2.tipo_resultado_id = 2 and R2.turma_id=? GROUP BY R2.questao_id) AS T2 on T2.questao_id=Q.id 
			LEFT JOIN (SELECT questao_id, COUNT(distinct usuario_id) AS total FROM resposta R3 WHERE R3.tipo_resultado_id = 3 and R3.turma_id=? GROUP BY R3.questao_id) AS T3 on T3.questao_id=Q.id 
			LEFT JOIN (SELECT questao_id, COUNT(distinct usuario_id) AS total FROM resposta R4 WHERE R4.tipo_resultado_id = 4 and R4.turma_id=? GROUP BY R4.questao_id) AS T4 on T4.questao_id=Q.id
			LEFT JOIN (SELECT questao_id, COUNT(*) AS total FROM resposta R5 WHERE R5.turma_id=? GROUP BY R5.questao_id) AS T5 on T5.questao_id=Q.id 
			ORDER BY Q.id;
			`,
      [turma_id, turma_id, turma_id, turma_id, turma_id, turma_id],
      function (err, results, fields) {
        if (err) {
          res.json({
            status: false,
            message: err,
          });
        } else {
          res.json({
            status: true,
            result: results,
          });
        }
      }
    );
  },

  allClassByUser(req, res) {
    const user = req.headers.user;

    /* 'SELECT * FROM turma WHERE curso_id = ?'*/
    connection.query(
      `SELECT DISTINCT turma.id, turma.usuario_id, turma.curso_id, turma.nome, curso.nome as curso FROM turma 
			INNER JOIN curso ON turma.curso_id = curso.id
            WHERE (turma.usuario_id = ? AND turma.status=0) OR (SELECT count(id) from usuario WHERE tipo_usuario_id = 1 and id = ?) = 1`,
      [user, user],
      (err, results, fields) => {
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

  courseLog(req, res) {
    const turmaId = req.headers.turmaid;
    connection.query(
      `SELECT q.id as idQuestao, q.xp, q.curso_id as cursoId, q.dificuldade_id as dificuldadeId, q.conceito_id as conceitoId, q.titulo, q.like,
	  (SELECT COUNT(*) FROM resposta r1 WHERE tipo_resultado_id = 1 AND r1.questao_id = q.id) as respostasCorretas,
	  (SELECT COUNT(*) FROM resposta r2 WHERE tipo_resultado_id = 2 AND r2.questao_id = q.id) as respostasErroExecucao,
	  (SELECT COUNT(*) FROM resposta r3 WHERE tipo_resultado_id = 3 AND r3.questao_id = q.id) as respostasErroCompilacao,
	  (SELECT COUNT(*) FROM resposta r4 WHERE tipo_resultado_id = 4 AND r4.questao_id = q.id) as respostasTempoExcedido,
	  (SELECT COUNT(*) FROM resposta r5 WHERE r5.questao_id = q.id) as questaoMaiorTentativas
	  FROM questao q where q.curso_id = (SELECT curso_id FROM turma WHERE id = ?) and q.status = 0;
	  `,
      [turmaId],
      (err, results, fields) => {
        if (err) {
          res.json({
            status: false,
            message: err,
          });
        } else {
          console.log(results, turmaId);
          for (let i in results) {
            if (results[i].cursoId === 1) results[i].curso = 'Algoritmos 1';
            if (results[i].dificuldadeId === 1)
              results[i].dificuldade = 'Moleza';
            if (results[i].dificuldadeId === 2)
              results[i].dificuldade = 'Fácil';
            if (results[i].dificuldadeId === 3)
              results[i].dificuldade = 'Mediana';
            if (results[i].dificuldadeId === 4)
              results[i].dificuldade = 'Dificil';
            if (results[i].dificuldadeId === 5)
              results[i].dificuldade = 'Impossível';
            if (results[i].conceitoId === 1)
              results[i].dificuldade = 'Variáveis e Atribuição';
            if (results[i].conceitoId === 2)
              results[i].conceitoId = 'Comandos Condicionais';
            if (results[i].conceitoId === 3)
              results[i].conceitoId = 'Comandos de Repetição';
            if (results[i].conceitoId === 4) results[i].dificuldade = 'Vetores';
          }
          res.send(results);
        }
      }
    );
  },

  userLog(req, res) {
    const logMessage = req.body.logMessage;
    const userid = req.body.userid;

    fs.appendFile('./logs/logs.txt', logMessage, (err) => {
      if (err) console.log(err);
      console.log('O log foi salvo!\n ', logMessage);
    });
  },

  allSubmissions(req, res) {
    connection.query(
      `SELECT  r.id, r.codigo, r.questao_id, r.tipo_linguagem_id as linguagem, r.tipo_resultado_id as resultado, r.turma_id, r.usuario_id, u.nome, q.titulo, c.descricao as conceito, r.tempo_inicial, r.tempo_final
      FROM resposta r, usuario u, questao q, conceito c WHERE r.usuario_id = u.id and r.questao_id = q.id and q.conceito_id = c.id
      ORDER BY r.id DESC;`,
      function (err, results, fields) {
        if (err) {
          res.json({
            status: false,
            message: err,
          });
        } else {
          for (let i in results) {
            if (results[i].linguagem === 1) results[i].linguagem = 'C';
            if (results[i].linguagem === 2) results[i].linguagem = 'C++';
            if (results[i].linguagem === 3) results[i].linguagem = 'Java';
            if (results[i].linguagem === 4) results[i].linguagem = 'Python';
            if (results[i].linguagem === 5) results[i].linguagem = 'JavaScript';
            if (results[i].resultado === 1) results[i].resultado = 'Correto';
            if (results[i].resultado === 2)
              results[i].resultado = 'Erro de Execução';
            if (results[i].resultado === 3)
              results[i].resultado = 'Erro de Compilação';
            if (results[i].resultado === 4)
              results[i].resultado = 'Tempo Excedido';

            results[i].tempo = (
              results[i].tempo_final - results[i].tempo_inicial
            ).toFixed(2);
          }
          res.send(results);
        }
      }
    );
  },
  searchSubmissions(req, res) {
    // in this method, is necessary to receive the search parameters, and then, make the query, the parameters could be optionals,
    // so, if the parameter is not received, the query will not have this parameter
    // could be something like this:
    let { userid, courseid, conceptid, resultid } = req.headers;
    // console.log(userid, courseid, conceptid, resultid);
    if (userid === 'undefined') {
      userid = null;
    }
    if (courseid === 'undefined') {
      courseid = null;
    }
    if (conceptid === 'undefined') {
      conceptid = null;
    }
    if (resultid === 'undefined') {
      resultid = null;
    }

    if (userid && courseid && conceptid && resultid) {
      connection.query(
        `SELECT  r.id, r.codigo, r.questao_id, r.tipo_linguagem_id as linguagem, r.tipo_resultado_id as resultado, r.turma_id, r.usuario_id, u.nome, q.titulo, c.descricao as conceito, r.tempo_inicial, r.tempo_final
      FROM resposta r, usuario u, questao q, conceito c WHERE r.usuario_id = u.id and r.questao_id = q.id and q.conceito_id = c.id and r.usuario_id = ? and q.curso_id = ? and q.conceito_id = ? and r.tipo_resultado_id = ?
      ORDER BY r.id DESC;`,
        [userid, courseid, conceptid, resultid],
        function (err, results, fields) {
          if (err) {
            res.json({
              status: false,
              message: err,
            });
          } else {
            console.log(results);
            for (let i in results) {
              if (results[i].linguagem === 1) results[i].linguagem = 'C';
              if (results[i].linguagem === 2) results[i].linguagem = 'C++';
              if (results[i].linguagem === 3) results[i].linguagem = 'Java';
              if (results[i].linguagem === 4) results[i].linguagem = 'Python';
              if (results[i].linguagem === 5)
                results[i].linguagem = 'JavaScript';
              if (results[i].resultado === 1) results[i].resultado = 'Correto';
              if (results[i].resultado === 2)
                results[i].resultado = 'Erro de Execução';
              if (results[i].resultado === 3)
                results[i].resultado = 'Erro de Compilação';
              if (results[i].resultado === 4)
                results[i].resultado = 'Tempo Excedido';

              results[i].tempo = (
                results[i].tempo_final - results[i].tempo_inicial
              ).toFixed(2);
            }
            res.send(results);
          }
        }
      );
    } else if (userid && courseid && conceptid) {
      connection.query(
        `SELECT  r.id, r.codigo, r.questao_id, r.tipo_linguagem_id as linguagem, r.tipo_resultado_id as resultado, r.turma_id, r.usuario_id, u.nome, q.titulo, c.descricao as conceito, r.tempo_inicial, r.tempo_final
      FROM resposta r, usuario u, questao q, conceito c WHERE r.usuario_id = u.id and r.questao_id = q.id and q.conceito_id = c.id and r.usuario_id = ? and q.curso_id = ? and q.conceito_id = ?
      ORDER BY r.id DESC;`,
        [userid, courseid, conceptid],
        function (err, results, fields) {
          if (err) {
            res.json({
              status: false,
              message: err,
            });
          } else {
            for (let i in results) {
              if (results[i].linguagem === 1) results[i].linguagem = 'C';
              if (results[i].linguagem === 2) results[i].linguagem = 'C++';
              if (results[i].linguagem === 3) results[i].linguagem = 'Java';
              if (results[i].linguagem === 4) results[i].linguagem = 'Python';
              if (results[i].linguagem === 5)
                results[i].linguagem = 'JavaScript';
              if (results[i].resultado === 1) results[i].resultado = 'Correto';
              if (results[i].resultado === 2)
                results[i].resultado = 'Erro de Execução';
              if (results[i].resultado === 3)
                results[i].resultado = 'Erro de Compilação';
              if (results[i].resultado === 4)
                results[i].resultado = 'Tempo Excedido';

              results[i].tempo = (
                results[i].tempo_final - results[i].tempo_inicial
              ).toFixed(2);
            }
            res.send(results);
          }
        }
      );
    } else if (userid && courseid) {
      connection.query(
        `SELECT  r.id, r.codigo, r.questao_id, r.tipo_linguagem_id as linguagem, r.tipo_resultado_id as resultado, r.turma_id, r.usuario_id, u.nome, q.titulo, c.descricao as conceito, r.tempo_inicial, r.tempo_final
      FROM resposta r, usuario u, questao q, conceito c WHERE r.usuario_id = u.id and r.questao_id = q.id and q.conceito_id = c.id and r.usuario_id = ? and q.curso_id = ?
      ORDER BY r.id DESC;`,
        [userid, courseid],
        function (err, results, fields) {
          if (err) {
            res.json({
              status: false,
              message: err,
            });
          } else {
            for (let i in results) {
              if (results[i].linguagem === 1) results[i].linguagem = 'C';
              if (results[i].linguagem === 2) results[i].linguagem = 'C++';
              if (results[i].linguagem === 3) results[i].linguagem = 'Java';
              if (results[i].linguagem === 4) results[i].linguagem = 'Python';
              if (results[i].linguagem === 5)
                results[i].linguagem = 'JavaScript';
              if (results[i].resultado === 1) results[i].resultado = 'Correto';
              if (results[i].resultado === 2)
                results[i].resultado = 'Erro de Execução';
              if (results[i].resultado === 3)
                results[i].resultado = 'Erro de Compilação';
              if (results[i].resultado === 4)
                results[i].resultado = 'Tempo Excedido';

              results[i].tempo = (
                results[i].tempo_final - results[i].tempo_inicial
              ).toFixed(2);
            }
            res.send(results);
          }
        }
      );
    } else if (userid) {
      connection.query(
        `SELECT  r.id, r.codigo, r.questao_id, r.tipo_linguagem_id as linguagem, r.tipo_resultado_id as resultado, r.turma_id, r.usuario_id, u.nome, q.titulo, c.descricao as conceito, r.tempo_inicial, r.tempo_final
      FROM resposta r, usuario u, questao q, conceito c WHERE r.usuario_id = u.id and r.questao_id = q.id and q.conceito_id = c.id and r.usuario_id = ?
      ORDER BY r.id DESC;`,
        [userid],
        function (err, results, fields) {
          if (err) {
            res.json({
              status: false,
              message: err,
            });
          } else {
            for (let i in results) {
              if (results[i].linguagem === 1) results[i].linguagem = 'C';
              if (results[i].linguagem === 2) results[i].linguagem = 'C++';
              if (results[i].linguagem === 3) results[i].linguagem = 'Java';
              if (results[i].linguagem === 4) results[i].linguagem = 'Python';
              if (results[i].linguagem === 5)
                results[i].linguagem = 'JavaScript';
              if (results[i].resultado === 1) results[i].resultado = 'Correto';
              if (results[i].resultado === 2)
                results[i].resultado = 'Erro de Execução';
              if (results[i].resultado === 3)
                results[i].resultado = 'Erro de Compilação';
              if (results[i].resultado === 4)
                results[i].resultado = 'Tempo Excedido';

              results[i].tempo = (
                results[i].tempo_final - results[i].tempo_inicial
              ).toFixed(2);
            }
            console.log(results);
            res.send(results);
          }
        }
      );
    } else {
      connection.query(
        `SELECT  r.id, r.codigo, r.questao_id, r.tipo_linguagem_id as linguagem, r.tipo_resultado_id as resultado, r.turma_id, r.usuario_id, u.nome, q.titulo, c.descricao as conceito, r.tempo_inicial, r.tempo_final
      FROM resposta r, usuario u, questao q, conceito c WHERE r.usuario_id = u.id and r.questao_id = q.id and q.conceito_id = c.id
      ORDER BY r.id DESC;`,

        function (err, results, fields) {
          if (err) {
            res.json({
              status: false,
              message: err,
            });
          } else {
            for (let i in results) {
              if (results[i].linguagem === 1) results[i].linguagem = 'C';
              if (results[i].linguagem === 2) results[i].linguagem = 'C++';
              if (results[i].linguagem === 3) results[i].linguagem = 'Java';
              if (results[i].linguagem === 4) results[i].linguagem = 'Python';
              if (results[i].linguagem === 5)
                results[i].linguagem = 'JavaScript';
              if (results[i].resultado === 1) results[i].resultado = 'Correto';
              if (results[i].resultado === 2)
                results[i].resultado = 'Erro de Execução';
              if (results[i].resultado === 3)
                results[i].resultado = 'Erro de Compilação';
              if (results[i].resultado === 4)
                results[i].resultado = 'Tempo Excedido';

              results[i].tempo = (
                results[i].tempo_final - results[i].tempo_inicial
              ).toFixed(2);
            }
            res.send(results);
          }
        }
      );
    }
  },

  userSubmissions(req, res) {
    const userid = req.headers.userid;

    connection.query(
      `SELECT  r.id, r.codigo, r.questao_id, r.tipo_linguagem_id as linguagem, r.tipo_resultado_id as resultado, r.turma_id, r.usuario_id, u.nome, q.titulo, c.descricao as conceito, r.tempo_inicial, r.tempo_final
    FROM resposta r, usuario u, questao q, conceito c WHERE r.usuario_id = u.id and r.questao_id = q.id and q.conceito_id = c.id and r.usuario_id = ?
    ORDER BY r.id DESC;`,
      [userid],
      function (err, results, fields) {
        if (err) {
          res.json({
            status: false,
            message: err,
          });
        } else {
          for (let i in results) {
            if (results[i].linguagem === 1) results[i].linguagem = 'C';
            if (results[i].linguagem === 2) results[i].linguagem = 'C++';
            if (results[i].linguagem === 3) results[i].linguagem = 'Java';
            if (results[i].linguagem === 4) results[i].linguagem = 'Python';
            if (results[i].linguagem === 5) results[i].linguagem = 'JavaScript';
            if (results[i].resultado === 1) results[i].resultado = 'Correto';
            if (results[i].resultado === 2)
              results[i].resultado = 'Erro de Execução';
            if (results[i].resultado === 3)
              results[i].resultado = 'Erro de Compilação';
            if (results[i].resultado === 4)
              results[i].resultado = 'Tempo Excedido';

            results[i].tempo = (
              results[i].tempo_final - results[i].tempo_inicial
            ).toFixed(2);
          }
          console.log(results);
          res.send(results);
        }
      }
    );
  },

  /*
   * Método para pegar todas as emoções de uma questão específica, recebendo o id da questão como parâmetro e o usuario id
   */

  async emotionsOnQuestions(req, res) {
    const questao_id = req.headers.questao_id;
    const user_id = req.headers.userid;

    console.log('Questao id ' + questao_id);
    console.log('User id ' + user_id);

    connection.query(
      `SELECT * FROM questao_emocao WHERE question_id = ? and user_id = ?`,
      [questao_id, user_id],
      function (err, results, fields) {
        if (err) {
          res.json({
            status: false,
            message: err,
          });
        } else {
          console.log(results);
          res.send(results);
        }
      }
    );
  },
};
