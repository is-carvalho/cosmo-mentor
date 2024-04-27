const connection = require('../database/connection');

module.exports = {
  getCacabugsManager(req, res) {
    /* 'SELECT * FROM turma WHERE curso_id = ?'*/
    connection.query(
      `SELECT ativado FROM cacabugs_switch`,
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
  postCacabugsManager(req, res) {
    const cbstatus = req.body.cbstatus;
    /* 'SELECT * FROM turma WHERE curso_id = ?'*/
    connection.query(
      `UPDATE cacabugs_switch SET ativado = ${cbstatus}`,
      cbstatus,
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
};
