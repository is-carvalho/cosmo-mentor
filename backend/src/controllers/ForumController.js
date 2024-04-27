const connection = require("../database/connection");

module.exports = {
  all(req, res) {
    const userId = req.headers.userid;
    connection.query(
      `SELECT  DISTINCT  p.idPost , p.idForum, p.titulo, p.descricao, p.idUsuario, p.idQuestao,
       (select nome from usuario u where u.id=p.idUsuario ) as nomeAutor
        FROM usuario u 
        INNER JOIN matricula_turma_usuario as mtu on u.id = ?
        INNER JOIN turma as t on t.id = mtu.turma_id=t.id 
        INNER JOIN forum as f on f.idTurma=t.id 
        INNER JOIN post as p
        ORDER BY idPost DESC ;`,
      [userId],
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

  getDuvidasQuestao(req, res) {
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
  },

  getForum(req, res) {
    connection.query(
      "SELECT f.idForum FROM turma as t, forum as f WHERE t.id = ?;",
      [req.params.idTurma],
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

  registerPost(req, res) {
    const post = {
      userId: req.body.userId,
      questaoId: req.body.questionId,
      forumId: req.body.forumId,
      titulo: req.body.titulo,
      descricao: req.body.descricao,
    };
    // console.log(post, "req body post");
    connection.query(
      "INSERT INTO `post` ( idUsuario, idForum, idQuestao, titulo, descricao, visualizacoes) values(?,?,?,?,?,?)",
      [
        post.userId,
        post.forumId,
        post.questaoId,
        post.titulo,
        post.descricao,
        0,
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
              message: " Insert efetuado com sucesso.",
              data: results,
            });
          } catch (error) {
            console.log(error);
          }
        }
      }
    );
  },

  allReply(req, res) {
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

  registerReply(req, res) {
    const reply = {
      descricao: req.body.descricao,
      userId: req.body.userId,
      postId: req.body.postId,
    };

    connection.query(
      "INSERT INTO reply( idPost, idUsuario, comentario ) VALUES (?,?,?)",
      [reply.postId, reply.userId, reply.descricao],
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
  },
};
