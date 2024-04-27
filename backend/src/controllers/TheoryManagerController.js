const connection = require("../database/connection");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "src/uploads");
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + "-" + Date.now() + ".jpg");
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
      return callback(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
}).single("file");

module.exports = {
  all(req, res) {
    connection.query(
      "SELECT C.nome AS curso, C.id AS curso_id, CT.descricao AS conceito, CT.id as conceito_id, U.id AS usuario_id, U.nome AS usuario, T.id, T.created_at, T.updated_at, T.status FROM teoria AS T INNER JOIN curso AS C ON (T.curso_id = C.id) INNER JOIN conceito AS CT ON (T.conceito_id = CT.id) INNER JOIN usuario AS U ON (T.usuario_id = U.id)",
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

  fileManager(req, res) {
    upload(req, res, function (err) {
      console.log("Arquivo enviado com sucesso");

      const imagePath = "src/uploads/" + req.file.filename.replace(/\\/g, path.sep);
    
      const response = `/${imagePath}`;
    
      res.json({
        location: response,
        url: response,
      });

    });
  },
  
  allInCourse(req, res) {
    const userid = req.headers.user;
    const conceitoid = req.headers.conceito;

    let cursoid = JSON.parse(req.headers.course);

    connection.query(
      `
      SELECT T.id, C.id AS curso_id, C.nome AS curso, CT.id AS conceito_id, CT.descricao AS conceito, T.conteudo 
      FROM teoria AS T INNER JOIN curso AS C ON (T.curso_id = C.id)
      INNER JOIN conceito AS CT ON (T.conceito_id = CT.id)
      WHERE 
      C.id = ? AND 
      (T.status=0 OR (SELECT count(id) from usuario WHERE tipo_usuario_id = 1 and id = ?) = 1)
      AND ( T.conceito_id = ? OR ? = '0')`,
      [
        cursoid,
        userid,
        conceitoid,
        conceitoid,
      ],
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

  single(req, res) {
    const id = req.params.id;

    connection.query(
      `SELECT T.id, C.id AS curso_id, C.nome AS curso, CT.id AS conceito_id, CT.descricao AS conceito, T.conteudo FROM teoria AS T INNER JOIN curso AS C ON (T.curso_id = C.id) INNER JOIN conceito AS CT ON (T.conceito_id = CT.id) WHERE T.id = ${id}`,
      (err, results, fields) => {
        if (err) {
          res.json({
            status: false,
            message: err,
          });
        } else {
          const teoria = {
            id: results[0].id,
            curso_id: results[0].curso_id,
            curso: results[0].curso,
            conceito_id: results[0].conceito_id,
            conceito: results[0].conceito,
            conteudo: results[0].conteudo,
          };
          res.json(teoria); 
        }
      }
    );
  },

    
  getConteudo(req, res) {
    const id = req.params.idConceito;

    connection.query(
      `SELECT T.id, C.id AS curso_id, C.nome AS curso, CT.id AS conceito_id, CT.descricao AS conceito, T.conteudo FROM teoria AS T INNER JOIN curso AS C ON (T.curso_id = C.id) INNER JOIN conceito AS CT ON (T.conceito_id = CT.id) WHERE CT.id = ${id}`,
      (err, results, fields) => {
        if (err) {
          res.json({
            status: false,
            message: err,
          });
        } else {
          const teoria = {
            id: results[0].id,
            curso_id: results[0].curso_id,
            curso: results[0].curso,
            conceito_id: results[0].conceito_id,
            conceito: results[0].conceito,
            conteudo: results[0].conteudo,
          };
          res.json(teoria); 
        }
      }
    );
  },

  create(req, res) {
      const today = new Date();

      const data = {
        usuario: req.body.usuario,
        curso: req.body.curso,
        conceito: req.body.conceito,
        conteudo: req.body.conteudo,
        created_at: today
      };

      connection.query(
        "INSERT INTO teoria (usuario_id, curso_id, conceito_id, conteudo, created_at) VALUES (?, ?, ?, ?, ?)",
        [
          data.usuario,
          data.curso,
          data.conceito,
          data.conteudo,
          data.created_at
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
              message: "Conteúdo teórico registrado com sucesso.",
              id: results.insertId,
            });
          }
        }
      );
  },

  update(req, res) {
      const today = new Date();

      const data = {
        usuario: req.body.user,
        curso: req.body.curso,
        conceito: req.body.conceito,
        conteudo: req.body.conteudo,
        updated_at: today,
        id: req.params.id,
      };

      connection.query(
        "UPDATE teoria SET usuario_id=?, curso_id=?, conceito_id=?, conteudo=?, updated_at=? WHERE id=?",
        [
          data.usuario,
          data.curso,
          data.conceito,
          data.conteudo,
          data.updated_at,
          data.id,
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
              message: "Conteúdo teórico atualizado com sucesso.",
            });
          }
        }
      );
    },
  
    registerReadingCompletion(req, res) {
      const today = new Date();

      const data = {
        id_usuario: req.body.id_usuario,
        id_teoria: req.body.id_teoria,
        dt_conclusao: today
      };

      connection.query(
        "INSERT INTO teoria_usuario_conclusao (id_usuario, id_teoria, dt_conclusao) VALUES (?, ?, ?)",
        [
          data.id_usuario,
          data.id_teoria,
          data.dt_conclusao
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
              message: "Conteúdo teórico concluído com sucesso.",
              id: results.insertId,
            });
          }
        }
      );
    },

    getReadingCompletionDate(req, res) {
      const today = new Date();

      const id_usuario = req.params.idUsuario;
      const id_teoria = req.params.idTeoria;

      connection.query(
        `SELECT dt_conclusao FROM teoria_usuario_conclusao WHERE id_usuario = ${id_usuario} AND id_teoria = ${id_teoria}`,
        (err, results, fields) => {
          if (err) {
            res.json({
              status: false,
              message: err,
            });
          } else {

            const conclusao = {}

            if(results[0] === undefined) {
              conclusao.dt_conclusao = ''
            } else {
              conclusao.dt_conclusao = results[0].dt_conclusao
            }
            res.json(conclusao); 
          }
        }
      );
    },

    getAllReadingCompletionDate(req, res) {
      const id_usuario = req.params.idUsuario;

      connection.query(
        `SELECT id_teoria FROM teoria_usuario_conclusao WHERE id_usuario=${id_usuario}`,
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

  delete(req, res) {
    const id = req.params.id;

    connection.query(
      "UPDATE teoria SET status = 1 WHERE id = ?",
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
            message: "Conteúdo teórico excluído com sucesso.",
          });
        }
      }
    );
  }

};