const connection = require('../database/connection');

module.exports = {
  showTutorial(req, res) {
    const userId = req.params.idUsuario;
    connection.query(
      `SELECT show_tutorial FROM usuario WHERE id=${userId};`,
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

  setTutorialStatus(req,res){
    const userId = req.params.idUsuario;
    const status = req.params.status;
    connection.query(
      `UPDATE usuario SET show_tutorial = ${status} WHERE id = ${userId};`,
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
  }
}