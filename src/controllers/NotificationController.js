const connection = require("../database/connection");

module.exports = {
  all(req, res) {
    const idUser = req.headers.iduser;
    const entityID = req.headers.entityid;
    const type = req.headers.type;

    /*console.log("HEADERS", req.headers)
        console.log(idUser, entityID, type)*/

    connection.query(
      "SELECT notificationID FROM notification WHERE idUser = ? AND entityID = ? AND type = ?;",
      [idUser, entityID, type],
      (err, results, fields) => {
        if (err) {
          console.log(err);
          res.json({
            status: false,
            message: err,
          });
        } else {
          try {
            // console.log(results);
            res.json({
              status: true,
              message: "Select efetuado com sucesso.",
              data: results,
            });
          } catch (error) {
            console.log(error);
          }
        }
      }
    );
  },

  userNotifications(req, res) {
    const userId = req.headers.userid;

    connection.query(
      /*"SELECT * FROM notification WHERE idUser = ? ORDER BY time DESC LIMIT 10;"*/
      "SELECT u.nome, u.id AS idUsuario, n.entityID, n.type, t.id as idTurma, q.id as idQuestao, p.idForum, p.titulo, p.descricao, c.id AS idCurso FROM usuario AS u, post AS p, notification AS n, turma AS t, questao AS q, forum AS f, curso AS c WHERE n.entityID = p.idpost AND u.id = p.idUsuario AND p.idForum = f.idForum AND f.idTurma = t.id AND q.id = p.idQuestao AND c.id = q.curso_id AND u.id = ? AND n.isread = false;",
      [userId],
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
              message: "Select efetuado com sucesso.",
              data: results,
            });
          } catch (error) {
            console.log(error);
          }
        }
      }
    );
  },

  updateRecord(req, res) {
    const idUser = req.body.headers.idUser;
    const entityID = req.body.headers.entityID;
    const type = req.body.headers.type;

    connection.query(
      "UPDATE notification SET isread = 0, time = NOW() WHERE idUser = ? AND entityID = ? AND type = ?;",
      [idUser, entityID, type],
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
              message: "Update efetuado com sucesso.",
            });
          } catch (error) {
            console.log(error);
          }
        }
      }
    );
  },

  setRead(req, res) {
    const notificationID = req.body.headers.notificationID;
    // console.log(req.body.headers)
    connection.query(
      "UPDATE notification SET isread = true WHERE notificationID = ?;",
      [notificationID],
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
              message: "Update efetuado com sucesso.",
            });
          } catch (error) {
            console.log(error);
          }
        }
      }
    );
  },

  insertRecord(req, res) {
    const idUser = req.body.headers.idUser;
    const entityID = req.body.headers.entityID;
    const type = req.body.headers.type;

    connection.query(
      "INSERT INTO notification ( type, idUser, entityID ) VALUES ( ?, ?, ? );",
      [type, idUser, entityID],
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
              message: "Insert efetuado com sucesso.",
            });
          } catch (error) {
            console.log(error);
          }
        }
      }
    );
  },
};
