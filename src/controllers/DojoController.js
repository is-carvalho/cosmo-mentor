const connection = require("../database/connection");

module.exports = {
  all(req, res) {
    connection.query("SELECT * from coding_dojo", (err, results, fields) => {
      if (err) {
        res.json({ status: false, message: err });
      } else {
        res.json({
          status: true,
          message: "Select efetuado com sucesso.",
          data: results,
        });
      }
    });
  },
  createNewDojo(req, res) {
    const questao_id = req.body.questao_id;
    const piloto = req.body.piloto;
    const coPiloto = req.body.coPiloto;
    const data = req.body.data;
    const flagAtivo = 1;

    connection.query(
      `INSERT INTO coding_dojo
    (questao_id, piloto, coPiloto, data, flagAtivo, codigo) 
    VALUES (?,?,?,SYSDATE(),?, ' ')`,
      [questao_id, piloto, coPiloto, flagAtivo],
      (err, results, fields) => {
        if (err) {
          res.json({ status: false, message: err });
        } else {
          res.json({
            status: true,
            message: "Insert efetuado com sucesso.",
            data: results,
          });
        }
      }
    );
  },

  endDojo(req, res) {
    const id = req.body.id;
    const piloto = req.body.piloto;
    const coPiloto = req.body.coPiloto;
    const flagAtivo = False;

    connection.query(
      `UPDATE coding_dojo SET flagAtivo = ? WHERE id = ?`,
      [flagAtivo, id],
      (err, results, fields) => {
        if (err) {
          res.json({ status: false, message: err });
        } else {
          res.json({
            status: true,
            message: "Update efetuado com sucesso.",
            data: results,
          });
        }
      }
    );

    connection.query(
      `INSERT INTO dojo_realizados (id_dojo, piloto, coPiloto)
      VALUES (?,?,?)`,
      [id, piloto, coPiloto],
      (err, results, fields) => {
        if (err) {
          res.json({ status: false, message: err });
        } else {
          res.json({
            status: true,
            message: "Insert efetuado com sucesso.",
            data: results,
          });
        }
      }
    );
  },

  single(req, res) {
    const id = req.params.id;
    connection.query(
      "SELECT * from coding_dojo WHERE id = ?",
      [id],
      (err, results, fields) => {
        if (err) {
          res.json({ status: false, message: err });
        } else {
          res.json({
            status: true,
            message: "Select efetuado com sucesso.",
            data: results,
          });
        }
      }
    );
  },
  update(req, res) {
    const codigo = req.body.codigo;
    const dojoId = req.params.id;
    connection.query(
      `UPDATE coding_dojo SET codigo = ? WHERE id = ?`,
      [codigo, dojoId],
      (err, results, fields) => {
        if (err) {
          res.json({ status: false, message: err });
        } else {
          res.json({
            status: true,
            message: "Update efetuado com sucesso.",
            data: results,
          });
        }
      }
    );
  },
  createQuestion(req, res) {
    const questaoId = req.body.questao_id;
    const dojoId = req.body.dojoId;
    console.log(questaoId, dojoId);
    connection.query(
      `INSERT INTO questao_dojo (questao_id, dojo_id) VALUES (?,?)`,
      [questaoId, dojoId],
      (err, results, fields) => {
        if (err) {
          res.json({ status: false, message: err });
        } else {
          console.log(results);
          res.json({
            status: true,
            message: "Insert efetuado com sucesso.",
            data: results,
          });
        }
      }
    );
  },
  listAllQuestionDojos(req, res) {
    const dojoId = req.headers.dojoid;
    // console.log(dojoId, "eaidopqwe");
    connection.query(
      "SELECT qd.*, q.* from questao_dojo qd, questao q where qd.dojo_id=? and qd.questao_id=q.id",
      [dojoId],
      (err, results, fields) => {
        if (err) {
          res.json({ status: false, message: err });
        } else {
          console.log(results[0], "results");
          res.json({
            status: true,
            message: "Select efetuado com sucesso.",
            data: results,
          });
        }
      }
    );
  },
  // list flagactive = 1
  dojosAvaliable(req, res) {
    connection.query(
      "SELECT * from coding_dojo where flagAtivo=1",
      (err, results, fields) => {
        if (err) {
          res.json({ status: false, message: err });
        } else {
          res.send(results);
        }
      }
    );
  },

  endDojo(req, res) {
    const id = req.body.dojoId;
    const piloto = req.body.piloto;
    const coPiloto = req.body.coPiloto;
    const flagAtivo = 0;

    console.log(req.body);
    connection.query(
      `UPDATE coding_dojo SET flagAtivo = ? WHERE id = ?`,
      [flagAtivo, id],
      (err, results, fields) => {
        if (err) {
          res.json({ status: false, message: err });
        } else {
          console.log(results);
        }
      }
    );

    connection.query(
      `INSERT INTO dojo_realizados (coding_dojo_id)
    VALUES (?)`,
      [id],
      (err, results, fields) => {
        if (err) {
          res.json({ status: false, message: err });
        } else {
          res.send(results);
        }
      }
    );
  },
};
