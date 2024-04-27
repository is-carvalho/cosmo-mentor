const connection = require("../database/connection");

module.exports = {
  all(req, res) {
    connection.query(
      `SELECT id_conquista, nome, descricao, stats_necessarios, activation, activation_values FROM conquista;`,
      [],
      function (err, results, fields) {
        if (err) {
          console.log(err);
          res.json({
            status: false,
            message: err,
          });
        } else {
          try {
            res.json({
              status: true,
              message: " Select efetuado com sucesso.",
              data: results,
            });
          } catch (error) {
            console.log(error);
          }
        }
      }
    );
  },

  getStatName(req, res) {
    console.log(req.params)
    const id_stat = req.params.id_stat;

    connection.query(
      `SELECT descricao as nome_stat FROM stat WHERE id_stat = ?;`,
      [id_stat],
      function (err, results, fields) {
        if (err) {
          console.log(err);
          res.json({
            status: false,
            message: err,
          });
        } else {
          try {
            res.json({
              status: true,
              message: " Select efetuado com sucesso.",
              data: results,
            });
          } catch (error) {
            console.log(error);
          }
        }
      }
    )
  },

  /*getDuvidasQuestao(req, res) {
    parametros = {
      questionId: req.params.idQuestion,
      turmaId: req.params.idTurma,
    };

    connection.query(
      "SELECT p.idPost, p.idForum, p.titulo, p.descricao, p.idUsuario, u.nome as nomeAutor FROM turma as t, post as p, forum as f, questao as q, usuario as u WHERE p.idForum = f.idForum AND p.idQuestao = q.id AND p.idUsuario = u.id AND q.id = ? AND t.id = ?;",
      [parametros.questionId, parametros.turmaId],
      (err, results, fields) => {
        if (err) {
          console.log(err);
          res.json({
            status: false,
            message: err,
          });
        } else {
          try {
            // res.send(results)
            res.json({
              status: true,
              message: " Select efetuado com sucesso.",
              data: results,
            });
          } catch (error) {
            console.log(error);
          }
        }
      }
    );
  },*/

  getStatsUsuario(req, res) {
    connection.query(
      "SELECT * FROM stats_usuario WHERE id_usuario = ?;",
      [req.params.id_user],
      (err, results, fields) => {
        if (err) {
          console.log(err);
          res.json({
            status: false,
            message: err,
          });
        } else {
          try {
            // res.send(results)
            // console.log(results);
            res.json({
              status: true,
              message: " Select efetuado com sucesso.",
              data: results,
            });
          } catch (error) {
            console.log(error);
          }
        }
      }
    );
  },

  updateStat(req, res) {
    const put = {
      userId: req.params.id_user,
      nomeStat: req.body.nomeStat,
      valorStat: req.body.valorStat,
    };
    // console.log(post, "req body post");
    connection.query(
      "UPDATE stats_usuario SET ?? = ? WHERE id_usuario = ?;",
      [
        put.nomeStat,
        put.valorStat,
        put.userId,
      ],
      function (err, results, fields) {
        if (err) {
          console.log(err);
          res.json({
            status: false,
            message: err,
          });
        } else {
          try {
            // res.send(results)
            res.json({
              status: true,
              message: " Update efetuado com sucesso.",
              data: results,
            });
          } catch (error) {
            console.log(error);
          }
        }
      }
    );
  },

  unlockAchievement(req, res) {
    const achievementInfo = {
      userName: req.body.userName,
      userId: req.body.userId,
      achievementName: req.body.achievementName,
      achievementId: req.body.achievementId,
    };

    connection.query(
      "INSERT INTO conquista_usuario VALUES (?, ?, ?, ?, now());",
      [achievementInfo.userId, achievementInfo.achievementId, achievementInfo.userName, achievementInfo.achievementName],
      function (err, results, fields) {
        if (err) {
          console.log(err);
          res.json({
            status: false,
            message: err,
          });
        } else {
          try {
            // res.send(results)
            res.json({
              status: true,
              message: " Post efetuado com sucesso.",
              data: results,
            });
          } catch (error) {
            console.log(error);
          }
        }
      }
    );
  },

  /*allReply(req, res) {
    const reply = {
      postId: req.headers.postid,
      userId: req.headers.userid,
    };
    if (reply.postId == 0) reply.postId = 1;

    connection.query(
      `SELECT DISTINCT r.idReply, r.idPost,
      r.idUsuario, r.comentario, 
      (SELECT nome FROM usuario u where u.id=r.idUsuario) as nomeAutor,
      (SELECT tipo_usuario_id FROM usuario where id=r.idUsuario) as tipoUsuario
      FROM reply r 
      WHERE r.idPost=?;`,
      [reply.postId],
      function (err, results, fields) {
        if (err) {
          console.log(err);
          res.json({
            status: false,
            message: err,
          });
        } else {
          try {
            res.send(results);
          } catch (error) {
            console.log(error);
          }
        }
      }
    );
  },

  userReplies(req, res) {
    const entityID = req.headers.entityid;
    // console.log("ForumController, 208", entityID)
    connection.query(
      "SELECT DISTINCT n.notificationID, u.nome, p.titulo AS tituloPost FROM notification AS n, usuario AS u, reply AS r, post AS p WHERE r.idPost = ? AND u.id = r.idUsuario AND p.idPost = ? AND n.entityID = ?;",
      [entityID, entityID, entityID],
      (err, results, fields) => {
        if (err) {
          console.log(err);
          res.json({
            status: false,
            message: err,
          });
        } else {
          try {
            res.json({
              status: true,
              message: "Select efetuado com sucesso.",
              data: results,
            });
            // res.send(results);
          } catch (error) {
            console.log(error);
          }
        }
      }
    );
  },*/
};
