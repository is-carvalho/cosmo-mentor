const connection = require('../database/connection');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'src/uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + '.jpg');
  },
});
const maxSize = 1 * 1000 * 1000;
const upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: function (req, file, callback) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);

    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      callback(null, true);
    } else {
      callback(null, false);
      return callback(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  },
}).single('quest');

module.exports = {
  allInCourse(req, res) {
    const userid = req.headers.user;
    const conceitoid = req.headers.conceito;
    const categoriaid = req.headers.categoria;
    const dificuldadeid = req.headers.dificuldade;
    const situacaoid = req.headers.situacao;
    const userGroup = req.headers.group;
    let cursoid = JSON.parse(req.headers.course);

    //Buscar questões de mais de um curso
    if (typeof cursoid === 'object') {
      let sqlAux = '';
      for (let i = 0; i < cursoid.length; i++) {
        if (i == cursoid.length - 1) sqlAux = sqlAux + cursoid[i];
        else sqlAux = sqlAux + cursoid[i] + ' or Q.curso_id = ';
      }
      cursoid = sqlAux;
    }

    connection.query(
      `
		SELECT  O.* FROM (
			SELECT Q.*, D.descricao AS "dificuldade", C.descricao AS "categoria", CO.descricao AS "conceito", CU.nome AS "curso", U.userName, COALESCE(T1.total,0) AS "num_acertos", (COALESCE(T2.total,0) + COALESCE(T3.total,0) + COALESCE(T4.total,0)) AS "num_erros", IF(COALESCE(T1.total,0) > 0, 2, IF(COALESCE(T2.total,0) + COALESCE(T3.total,0) + COALESCE(T4.total,0) > 0, 3, IF(COALESCE(T1.total,0) + COALESCE(T2.total,0) + COALESCE(T3.total,0) + COALESCE(T4.total,0) = 0, 1, -1))) AS "situacao_id"
					FROM questao AS Q
						INNER JOIN dificuldade AS D ON( Q.dificuldade_id = D.id)
						INNER JOIN conceito AS CO ON( Q.conceito_id = CO.id)
						INNER JOIN categoria AS C ON (Q.categoria_id = C.id)
						INNER JOIN curso AS CU ON (Q.curso_id = CU.id)
						INNER JOIN usuario AS U ON (Q.usuario_id = U.id)
						LEFT JOIN (SELECT R1.usuario_id, R1.questao_id, R1.turma_id, COUNT(*) AS total FROM resposta R1 WHERE R1.tipo_resultado_id = 1 GROUP BY R1.usuario_id, R1.questao_id, R1.turma_id) AS T1 ON (T1.usuario_id = ? AND T1.questao_id = Q.id)
						LEFT JOIN (SELECT R2.usuario_id, R2.questao_id, R2.turma_id, COUNT(*) AS total FROM resposta R2 WHERE R2.tipo_resultado_id = 2 GROUP BY R2.usuario_id, R2.questao_id, R2.turma_id) AS T2 ON (T2.usuario_id = ? AND T2.questao_id = Q.id)
						LEFT JOIN (SELECT R3.usuario_id, R3.questao_id, R3.turma_id, COUNT(*) AS total FROM resposta R3 WHERE R3.tipo_resultado_id = 3 GROUP BY R3.usuario_id, R3.questao_id, R3.turma_id) AS T3 ON (T3.usuario_id = ? AND T3.questao_id = Q.id)
						LEFT JOIN (SELECT R4.usuario_id, R4.questao_id, R4.turma_id, COUNT(*) AS total FROM resposta R4 WHERE R4.tipo_resultado_id = 4 GROUP BY R4.usuario_id, R4.questao_id, R4.turma_id) AS T4 ON (T4.usuario_id = ? AND T4.questao_id = Q.id)
						WHERE 
						Q.curso_id = ? AND 
						(Q.status=0 OR (SELECT count(id) from usuario WHERE tipo_usuario_id = 1 and id = ?) = 1)
						AND ( Q.conceito_id = ? OR ? = '0')
						AND ( Q.categoria_id = ? OR ? = '0')
						AND ( Q.dificuldade_id = ? OR ? = '0')
            ORDER BY ID
		) AS O
    WHERE O.situacao_id = ? OR ? = '0' ORDER BY SEQUENCIA;
		`,
      [
        userid,
        userid,
        userid,
        userid,
        cursoid,
        userid,
        conceitoid,
        conceitoid,
        categoriaid,
        categoriaid,
        dificuldadeid,
        dificuldadeid,
        situacaoid,
        situacaoid,
      ],
      (err, results, fields) => {
        if (err) {
          res.json({
            status: false,
            message: err,
          });
        } else {
          // console.log(results);
          res.send(results);
        }
      }
    );
  },

  single(req, res) {
    let questao_id = req.params.id;

    // console.log(req.params, "questaoid");
    try {
      connection.query(
        `SELECT Q.id, Q.curso_id, Q.dificuldade_id, Q.categoria_id, Q.conceito_id, Q.titulo, Q.enunciado, Q.solucao_referencia,
			Q.resumo, Q.descricao_entrada, Q.descricao_saida, Q.observacao, Q.moedas, Q.custo, Q.xp, Q.imagem, 
			Q.limite_tempo, Q.created_at, D.descricao AS "dificuldade", C.descricao AS "categoria", U.userName FROM questao AS Q
			INNER JOIN dificuldade AS D ON( Q.dificuldade_id = D.id)
			INNER JOIN categoria AS C ON (Q.categoria_id = C.id)
			INNER JOIN usuario AS U ON (Q.usuario_id = U.id)
			WHERE Q.id = ?`,
        [questao_id],
        function (err, results, fields) {
          if (err) {
            res.json({
              status: false,
              message: err,
            });
          } else {
            try {
              let data = new Date(results[0].created_at);

              const dia =
                data.getDate() < 10
                  ? '0' + data.getDate().toString()
                  : data.getDate().toString();
              const mes =
                data.getMonth() + 1 < 10
                  ? '0' + (data.getMonth() + 1).toString()
                  : (data.getMonth() + 1).toString();
              const ano = data.getFullYear();
              const dataFormat = dia + '/' + mes + '/' + ano;

              const questao = {
                curso_id: results[0].curso_id,
                dificuldade_id: results[0].dificuldade_id,
                categoria_id: results[0].categoria_id,
                conceito_id: results[0].conceito_id,
                titulo: results[0].titulo,
                enunciado: results[0].enunciado,
                solucao_referencia: results[0].solucao_referencia,
                descricao_entrada: results[0].descricao_entrada,
                descricao_saida: results[0].descricao_saida,
                observacao: results[0].observacao,
                autor: results[0].userName,
                categoria: results[0].categoria,
                moedas: results[0].moedas,
                custo: results[0].custo,
                xp: results[0].xp,
                dificuldade: results[0].dificuldade,
                limite_tempo: results[0].limite_tempo,
                resumo: results[0].resumo,
                imagem: results[0].imagem,
                data_criacao: dataFormat,
              };

              res.send(questao);
            } catch (e) {
              console.log(e);
              res.json({
                status: false,
                message: e,
              });
            }
          }
        }
      );
    } catch (err) {
      res.json({
        status: false,
        message: err,
      });
    }
  },

  totalXp(req, res) {
    let curso_id = req.headers.cursoid;

    // console.log(req.params, "questaoid");
    try {
      connection.query(
        `SELECT sum(pts) AS xp_total FROM (SELECT sum(xp) AS pts FROM questao WHERE curso_id = ? AND status = 0 GROUP BY conceito_id) AS pts`,
        [curso_id],
        function (err, results, fields) {
          if (err) {
            res.json({
              status: false,
              message: err,
            });
          } else {
            try {
              const xpTotal = results[0].xp_total;
              res.json({
                xpTotal: xpTotal
              })

            } catch (e) {
              console.log(e);
              res.json({
                status: false,
                message: e,
              });
            }
          }
        }
      );
    } catch (err) {
      res.json({
        status: false,
        message: err,
      });
    }
  },

  create(req, res) {
    upload(req, res, function (err) {
      const today = new Date();
      let foto = '';

      if (req.file) {
        foto = process.env.PHOTO_PATH_DEV ? process.env.PHOTO_PATH_DEV + req.file.path : '\\api\\' + req.file.path;
      } else {
        foto = req.body.foto;
      }
      //console.log(req)
      //console.log(foto)
      const questData = {
        user: req.body.user,
        curso: req.body.curso,
        dificuldade: req.body.dificuldade,
        categoria: req.body.categoria,
        conceito: req.body.conceito,
        titulo: req.body.titulo,
        enunciado: req.body.enunciado,
        descEntrada: req.body.descEntrada,
        descSaida: req.body.descSaida,
        resumo: req.body.resumo,
        observacao: req.body.observacao,
        imagem: foto,
        global: 1,
        created_at: today,
        moedas: 100,
        custo: 0,
        xp: req.body.xp,
        limite_tempo: 1000,
      };

      connection.query(
        'INSERT INTO questao SET usuario_id=?, curso_id=?, dificuldade_id=?, categoria_id=?,conceito_id=?,titulo=?,enunciado=?,descricao_entrada=?,descricao_saida=?,resumo=?, observacao=?, imagem=?, global=?,created_at=?,moedas=?,custo=?,xp=?,limite_tempo=?',
        [
          questData.user,
          questData.curso,
          questData.dificuldade,
          questData.categoria,
          questData.conceito,
          questData.titulo,
          questData.enunciado,
          questData.descEntrada,
          questData.descSaida,
          questData.resumo,
          questData.observacao,
          questData.imagem,
          questData.global,
          questData.created_at,
          questData.moedas,
          questData.custo,
          questData.xp,
          questData.limite_tempo,
        ],
        function (err, results, fields) {
          if (err) {
            res.json({
              status: false,
              message: err,
            });
          } else {
            res.json({
              status: true,
              message: 'Questão registrada com sucesso',
              id: results.insertId,
            });
          }
        }
      );
    });
  },

  update(req, res) {
    upload(req, res, function (err) {
      const today = new Date();
      /*
			let foto = "";
			
			if(req.file) {
				foto = "\\"+req.file.path;
			} else {
				foto = null;
			}
			console.log(req)
			console.log(foto)*/
      const questData = {
        curso: req.body.curso,
        dificuldade: req.body.dificuldade,
        categoria: req.body.categoria,
        conceito: req.body.conceito,
        titulo: req.body.titulo,
        enunciado: req.body.enunciado,
        descEntrada: req.body.descEntrada,
        descSaida: req.body.descSaida,
        resumo: req.body.resumo,
        xp: req.body.xp,
        observacao: req.body.observacao,
        updated_at: today,
        id: req.params.id,
      };

      connection.query(
        'UPDATE questao SET curso_id=?, dificuldade_id=?, categoria_id=?,conceito_id=?,titulo=?,enunciado=?,descricao_entrada=?,descricao_saida=?, xp=?, resumo=?, observacao=?, updated_at=? WHERE id=?',
        [
          questData.curso,
          questData.dificuldade,
          questData.categoria,
          questData.conceito,
          questData.titulo,
          questData.enunciado,
          questData.descEntrada,
          questData.descSaida,
          questData.xp,
          questData.resumo,
          questData.observacao,
          questData.updated_at,
          questData.id,
        ],
        function (err, results, fields) {
          if (err) {
            res.json({
              status: false,
              message: err,
            });
          } else {
            res.json({
              status: true,
              message: 'Questão atualizada com sucesso',
            });
          }
        }
      );
    });
  },

  delete(req, res) {
    const id = req.params.id;

    connection.query(
      'UPDATE questao SET status = 1 WHERE id = ?',
      [id],
      function (err, results, fields) {
        if (err) {
          res.json({
            status: false,
            message: err,
          });
        } else {
          res.json({
            status: true,
            message: 'Questão deletada com sucesso',
          });
        }
      }
    );
  },

  searchCardQuestions(req, res) {
    const userId = req.headers.user;
    // console.log(userId)
    connection.query(
      `SELECT DISTINCT Q.id AS questaoId, Q.xp, Q.titulo, T.id AS turmaId FROM matricula_turma_usuario MTU 
							INNER JOIN turma AS T ON (T.id = MTU.turma_id)
							INNER JOIN curso AS C ON (C.id = T.curso_id)
							INNER JOIN questao AS Q ON (Q.curso_id = C.id AND Q.status = 0)
							WHERE 
							MTU.usuario_id=? AND
							NOT EXISTS (SELECT * FROM resposta AS R WHERE R.questao_id = Q.id)
              AND Q.curso_id=1
							ORDER BY Q.xp DESC
							LIMIT 2`,
      [userId],
      function (err, results, fields) {
        if (err) {
          res.json({
            status: false,
            message: err,
          });
        } else {
          // console.log(results);
          res.send(results);
        }
      }
    );
  },

  allQuestions(req, res) {
    const userId = req.headers.userid;
    connection.query(
      'SELECT DISTINCT q.id, q.titulo FROM questao q INNER JOIN matricula_turma_usuario mtu, turma t WHERE q.curso_id=t.curso_id and mtu.usuario_id=?;',
      [userId],
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

  likeQuestion(req, res) {
    const questaoId = req.body.questaoId;
    // console.log("QuestaoId", questaoId);
    connection.query(
      'UPDATE questao SET `like`=(select (max(`like`)+1) where id=?) WHERE id=?;',
      [questaoId, questaoId],
      (err, results, fields) => {
        if (err) {
          console.log(err);
          res.json({
            status: false,
            message: err,
          });
        } else {
          // console.log(results);
          res.json({
            status: true,
            message: results,
          });
        }
      }
    );
  },

  listAllQuestions(req, res) {
    connection.query(
      'SELECT * FROM questao where status = 0;',
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

  updateOrder(req, res) {
    const questionId = req.body.headers.questionId;
    const newOrder = req.body.headers.newOrder;

    connection.query(
      'UPDATE questao SET sequencia = ? WHERE id = ?;',
      [newOrder, questionId],
      (err, results, fields) => {
        if (err) {
          console.log(err);
          res.json({
            status: false,
            message: err,
          });
        } else {
          res.send(results);
          // console.log(results);
        }
      }
    );
  },

  listAllQuestionsByCourse(req, res) {
    const userid = req.headers.user;
    const conceitoid = req.headers.conceito;
    const categoriaid = req.headers.categoria;
    const dificuldadeid = req.headers.dificuldade;
    const situacaoid = req.headers.situacao;
    const userGroup = req.headers.group;
    let cursoid = JSON.parse(req.headers.course);
    //Buscar questões de mais de um curso
    if (typeof cursoid === 'object') {
      let sqlAux = '';
      for (let i = 0; i < cursoid.length; i++) {
        if (i == cursoid.length - 1) sqlAux = sqlAux + cursoid[i];
        else sqlAux = sqlAux + cursoid[i] + ' or Q.curso_id = ';
      }
      cursoid = sqlAux;
    }

    connection.query(
      `
      SELECT * O.* FROM (
        SELECT Q.*, D.descricao AS "dificuldade", C.descricao AS "categoria", CO.descricao AS "conceito", CU.nome AS "curso", U.userName, 
        COALESCE(T1.total,0) AS "num_acertos", (COALESCE(T2.total,0) + COALESCE(T3.total,0) + COALESCE(T4.total,0)) AS "num_erros",
        IF(COALESCE(T1.total,0) > 0, 2, IF(COALESCE(T2.total,0) + COALESCE(T3.total,0) + COALESCE(T4.total,0) > 0, 3, IF(COALESCE(T1.total,0) + COALESCE(T2.total,0) + COALESCE(T3.total,0) + COALESCE(T4.total,0) = 0, 1, -1))) AS "situacao_id"
          FROM questao AS Q
            INNER JOIN dificuldade AS D ON( Q.dificuldade_id = D.id)
            INNER JOIN conceito AS CO ON( Q.conceito_id = CO.id)
            INNER JOIN categoria AS C ON (Q.categoria_id = C.id)

            INNER JOIN curso AS CU ON (Q.curso_id = CU.id)
            INNER JOIN usuario AS U ON (Q.usuario_id = U.id)
            LEFT JOIN (SELECT R1.usuario_id, R1.questao_id, R1.turma_id, COUNT(*) AS total FROM resposta R1 WHERE R1.tipo_resultado_id = 1 GROUP BY R1.usuario_id, R1.questao_id, R1.turma_id) AS T1 ON (T1.usuario_id = ? AND T1.questao_id = Q.id)
            LEFT JOIN (SELECT R2.usuario_id, R2.questao_id, R2.turma_id, COUNT(*) AS total FROM resposta R2 WHERE R2.tipo_resultado_id = 2 GROUP BY R2.usuario_id, R2.questao_id, R2.turma_id) AS T2 ON (T2.usuario_id = ? AND T2.questao_id = Q.id)
            LEFT JOIN (SELECT R3.usuario_id, R3.questao_id, R3.turma_id, COUNT(*) AS total FROM resposta R3 WHERE R3.tipo_resultado_id = 3 GROUP BY R3.usuario_id, R3.questao_id, R3.turma_id) AS T3 ON (T3.usuario_id = ? AND T3.questao_id = Q.id)
            LEFT JOIN (SELECT R4.usuario_id, R4.questao_id, R4.turma_id, COUNT(*) AS total FROM resposta R4 WHERE R4.tipo_resultado_id = 4 GROUP BY R4.usuario_id, R4.questao_id, R4.turma_id) AS T4 ON (T4.usuario_id = ? AND T4.questao_id = Q.id)
            WHERE
              Q.curso_id = ${cursoid} AND
              Q.conceito_id = ${conceitoid} AND
              Q.categoria_id = ${categoriaid} AND
              Q.dificuldade_id = ${dificuldadeid} AND
              IF(COALESCE(T1.total,0) > 0, 2, IF(COALESCE(T2.total,0) + COALESCE(T3.total,0) + COALESCE(T4.total,0) > 0, 3, IF(COALESCE(T1.total,0) + COALESCE(T2.total,0) + COALESCE(T3.total,0) + COALESCE(T4.total,0) = 0, 1, -1))) = ${situacaoid}
      ) AS O
      WHERE O.status = 0
      ORDER BY O.sequencia ASC;
    `,
      [],
      () => {
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

  allInCourse3(req, res) {
    const userid = req.headers.user;
    const conceitoid = req.headers.conceito;
    const categoriaid = req.headers.categoria;
    const dificuldadeid = req.headers.dificuldade;
    const situacaoid = req.headers.situacao;
    const userGroup = req.headers.group;
    let cursoid = JSON.parse(req.headers.course);

    //Buscar questões de mais de um curso
    if (typeof cursoid === 'object') {
      let sqlAux = '';
      for (let i = 0; i < cursoid.length; i++) {
        if (i == cursoid.length - 1) sqlAux = sqlAux + cursoid[i];
        else sqlAux = sqlAux + cursoid[i] + ' or Q.curso_id = ';
      }
      cursoid = sqlAux;
    }

    connection.query(
      `
		SELECT  O.* FROM (
			SELECT Q.*, D.descricao AS "dificuldade", C.descricao AS "categoria", CO.descricao AS "conceito", CU.nome AS "curso", U.userName, COALESCE(T1.total,0) AS "num_acertos", (COALESCE(T2.total,0) + COALESCE(T3.total,0) + COALESCE(T4.total,0)) AS "num_erros", IF(COALESCE(T1.total,0) > 0, 2, IF(COALESCE(T2.total,0) + COALESCE(T3.total,0) + COALESCE(T4.total,0) > 0, 3, IF(COALESCE(T1.total,0) + COALESCE(T2.total,0) + COALESCE(T3.total,0) + COALESCE(T4.total,0) = 0, 1, -1))) AS "situacao_id"
					FROM questao AS Q
						INNER JOIN dificuldade AS D ON( Q.dificuldade_id = D.id)
						INNER JOIN conceito AS CO ON( Q.conceito_id = CO.id)
						INNER JOIN categoria AS C ON (Q.categoria_id = C.id)
						INNER JOIN curso AS CU ON (Q.curso_id = CU.id)
						INNER JOIN usuario AS U ON (Q.usuario_id = U.id)
						LEFT JOIN (SELECT R1.usuario_id, R1.questao_id, R1.turma_id, COUNT(*) AS total FROM resposta R1 WHERE R1.tipo_resultado_id = 1 GROUP BY R1.usuario_id, R1.questao_id, R1.turma_id) AS T1 ON (T1.usuario_id = ? AND T1.questao_id = Q.id)
						LEFT JOIN (SELECT R2.usuario_id, R2.questao_id, R2.turma_id, COUNT(*) AS total FROM resposta R2 WHERE R2.tipo_resultado_id = 2 GROUP BY R2.usuario_id, R2.questao_id, R2.turma_id) AS T2 ON (T2.usuario_id = ? AND T2.questao_id = Q.id)
						LEFT JOIN (SELECT R3.usuario_id, R3.questao_id, R3.turma_id, COUNT(*) AS total FROM resposta R3 WHERE R3.tipo_resultado_id = 3 GROUP BY R3.usuario_id, R3.questao_id, R3.turma_id) AS T3 ON (T3.usuario_id = ? AND T3.questao_id = Q.id)
						LEFT JOIN (SELECT R4.usuario_id, R4.questao_id, R4.turma_id, COUNT(*) AS total FROM resposta R4 WHERE R4.tipo_resultado_id = 4 GROUP BY R4.usuario_id, R4.questao_id, R4.turma_id) AS T4 ON (T4.usuario_id = ? AND T4.questao_id = Q.id)
						WHERE 
						Q.curso_id = 3 AND 
						(Q.status=0 OR (SELECT count(id) from usuario WHERE tipo_usuario_id = 1 and id = ?) = 1)
						AND ( Q.conceito_id = ? OR ? = '0')
						AND ( Q.categoria_id = ? OR ? = '0')
						AND ( Q.dificuldade_id = ? OR ? = '0')
            ORDER BY ID
		) AS O
    WHERE O.situacao_id = ? OR ? = '0' ORDER BY ID;
		`,
      [
        userid,
        userid,
        userid,
        userid,
        cursoid,
        userid,
        conceitoid,
        conceitoid,
        categoriaid,
        categoriaid,
        dificuldadeid,
        dificuldadeid,
        situacaoid,
        situacaoid,
      ],
      (err, results, fields) => {
        if (err) {
          res.json({
            status: false,
            message: err,
          });
        } else {
          // console.log(results);
          res.send(results);
        }
      }
    );
  },
  
  selectQuestaoEstiloCacabugs(req,res){
    const questionId=req.params.questionId;
    connection.query(
      // 'SELECT q.id, q.curso_id, q.dificuldade_id, q.categoria_id, q.conceito_id, q.titulo, q.enunciado, q.moedas, q.custo, q.xp, q.limite_tempo, q.resumo, qec.codigocerto, qec.codigoerrado, qec.codigopython, qec.codigoc, qec.codigolua, qec.entradas FROM questao q INNER JOIN questoes_estilo_cacabugs qec ON q.id = qec.questao_id;',
      "SELECT id,codigocerto,codigoerrado,codigopython,codigoc,codigolua,entradas from questoes_estilo_cacabugs WHERE questao_id=?;",[questionId],
      (err, results) => {
        if (err) {
          console.log(err);
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

  submitQuestaoEstiloCacabugs(req, res) {
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
      usuario_id: req.body.userId,
      questao_id: req.body.questionId,
      resposta: req.body.result,
      tipo_resultado_id: req.body.resultType,
      tipo_linguagem_id: req.body.language,
      submitted_at: dataAtual,
      tempo_resposta: tempoTotalData(),
    };

    connection.query(
      'INSERT INTO respostas_estilo_cacabugs SET ?',
      dadosQuestao,
      function (err, results, fields) {
        if (err) {
          console.log(err);
          res.json({
            status: false,
            message: err,
          });
        } else {
          console.log(res);
          res.json({
            status: true,
            message: 'Resposta registrada com sucesso.',
          });
        }
      }
    );
  },

  situacaoQuestoesEstiloCacabugs(req,res){
    const userId=req.params.userId;
    connection.query(
    'select distinct questao_id,tipo_resultado_id from respostas_estilo_cacabugs where usuario_id=?',userId,
    (err, results) => {
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
};
