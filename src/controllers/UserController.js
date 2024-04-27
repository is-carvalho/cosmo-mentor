const { authSecret } = require('../env_file');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const multer = require('multer');
const path = require('path');

const connection = require('../database/connection');

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
}).single('avatar');

const encryptedPassword = (senha) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(senha, salt);
};

module.exports = {
  /*
	post na rota register
	retorna false caso erro na query ou um status com o email do usuario cadastrado
	*/
  create(req, res) {
    const today = new Date();
    const titulo = 1;
    const userData = {
      email: req.body.email,
      senha: encryptedPassword(req.body.senha),
      nome: req.body.nome,
      userName: req.body.userName,
      sexo: req.body.sexo,
      nascimento: req.body.nascimento,
      municipio: req.body.municipio,
      titulo_id: titulo,
      created_at: today,
      tipo_usuario_id: 3,
    };

    //console.log(userData);

    connection.query(
      'INSERT INTO usuario SET nome=?, senha=?, email=?, userName=?,sexo=?,nascimento=?,municipio_id=?,titulo_id=?,created_at=?,tipo_usuario_id=?',
      [
        userData.nome,
        userData.senha,
        userData.email,
        userData.userName,
        userData.sexo,
        userData.nascimento,
        userData.municipio,
        userData.titulo_id,
        userData.created_at,
        userData.tipo_usuario_id,
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
            message: userData.userName + ' registrado',
          });
        }
      }
    );
  },

  login(req, res) {
    const userName = req.body.userName;
    const email = req.body.email;
    const senha = req.body.senha;

    connection.query(
      "SELECT id, senha, userName, nome, tipo_usuario_id, estrelas, foto, grupo, xp FROM usuario WHERE userName = ?",
      [userName],
      function (err, results, field) {
        if (err) {
          res.json({
            status: false,
            message: 'Erro ao acessar o banco de dados!',
          });
        } else {
          if (results.length > 0) {
            // const isMatch = bcrypt.compareSync(senha, results[0].senha)
            var isMatch = false;
            if (senha == req.body.senha) isMatch = true;

            //console.log(results[0].senha)
            //console.log(isMatch)

            if (isMatch) {
              const now = Math.floor(Date.now() / 1000); //valor em segundos da data atual
              const payload = {
                id: results[0].id,
                senha: results[0].senha,
                userName: results[0].userName,
                nome: results[0].nome,
                tipo: results[0].tipo_usuario_id,
                estrelas: results[0].estrelas,
                xp: results[0].xp,
                foto: results[0].foto,
                iat: now, //data de geracao do token
                exp: now + 60 * 60 * 1, //expira em 1h
              };

              //console.log(payload);

              let token = jwt.sign(payload, authSecret);

              //console.log(token);
              res.json({
                status: true,
                data: token,
              });
              //res.send(token)
            } else {
              res.json({
                status: false,
                message: 'Nome de Usuário ou Senha está incorreto.',
              });
              console.log('erro ta aqui, 1');
              // res.status(400).json({
              // 	error: 'Erro: Senha inválido'
              // })
            }
          } else {
            // res.status(400).json({
            // 	error: 'Erro: Nome de usuário inválido!'
            // })
            res.json({
              status: false,
              message: 'Nome de Usuário ou Senha está incorreto.',
            });
          }
        }
      }
    );
  },

  single(req, res) {
    const id = req.params.id;

    connection.query(
      `SELECT usuario.*, titulo.descricao as "titulo", municipio.estado_id AS "estado_id" FROM usuario
			INNER JOIN titulo ON usuario.titulo_id = titulo.id 
			INNER JOIN municipio ON usuario.municipio_id = municipio.id 
			WHERE usuario.id = ?`,
      [id],
      function (err, results, fields) {
        if (err) {
          res.json({
            status: false,
            message: err,
          });
        } else {
          let data = new Date(results[0].nascimento);
          const dia = data.getDate();
          const mes =
            data.getMonth() + 1 < 10
              ? '0' + (data.getMonth() + 1).toString()
              : (data.getMonth() + 1).toString();
          const ano = data.getFullYear();
          const dataFormat = ano + '-' + mes + '-' + dia;

          const usuario = {
            id: results[0].id,
            tipo: results[0].tipo_usuario_id,
            municipio: results[0].municipio_id,
            userName: results[0].userName,
            sexo: results[0].sexo,
            email: results[0].email,
            nome: results[0].nome,
            nascimento: dataFormat,
            estado: results[0].estado_id,
            xp: results[0].xp,
            saldo_moedas: results[0].saldo_moedas,
            moedas_acumuladas: results[0].moedas_acumuladas,
            moedas_utilizadas: results[0].moedas_utilizadas,
            questoes_respondidas: results[0].questoes_respondidas,
            titulo: results[0].titulo,
            titulo_id: results[0].titulo_id,
            foto: results[0].foto,
          };

          res.send(usuario);
        }
      }
    );
  },

  update(req, res) {
    upload(req, res, function (err) {
      const today = new Date();
      const id = req.params.id;
      let foto = '';

      if (req.file) {
        foto = process.env.PHOTO_PATH_DEV ? process.env.PHOTO_PATH_DEV + req.file.path : '\\api\\' + req.file.path;
      } else {
        foto = req.body.foto;
      }
      //console.log(req)
      //console.log(foto)
      const userData = {
        nome: req.body.nome,
        nascimento: req.body.nascimento,
        municipio: req.body.municipio,
        foto: foto,
        sexo: req.body.sexo,
        updated_at: today,
      };

      if (err instanceof multer.MulterError) {
        return res.send(err);
      } else if (err) {
        return res.send(err);
      }

      connection.query(
        'UPDATE usuario SET nome=?, municipio_id=?, nascimento=?, sexo=?, foto=?, updated_at=? WHERE id=?',
        [
          userData.nome,
          userData.municipio,
          userData.nascimento,
          userData.sexo,
          userData.foto,
          userData.updated_at,
          id,
        ],
        function (err, results, fields) {
          if (err) {
            res.json({
              status: false,
              message: err,
            });
          } else {
            res.json({
              status: 'Usuário ' + id + ' atualizado com sucesso!',
            });
          }
        }
      );
    });
  },

  checkEmail(req, res) {
    const email = req.body.email;

    connection.query(
      `SELECT * FROM usuario WHERE usuario.email = ?`,
      [email],
      function (err, results, fields) {
        if (!err) {
          if (results.length > 0) {
            res.json({
              status: false,
              message: 'O email informado já está em uso.',
            });
          } else {
            res.json({
              status: true,
              message: 'O email informado está disponível.',
            });
          }
        }
      }
    );
  },

  checkUserName(req, res) {
    const userName = req.body.userName;

    connection.query(
      `SELECT * FROM usuario WHERE usuario.userName = ?`,
      [userName],
      function (err, results, fields) {
        if (!err) {
          if (results.length > 0) {
            res.json({
              status: false,
              message: 'O nome de usuário informado já está em uso.',
            });
          } else {
            res.json({
              status: true,
              message: 'O nome de usuário informado está disponível.',
            });
          }
        }
      }
    );
  },
  /*
	knowledge (req,res){
		const id = req.params.id
		
		connection.query(`SELECT DISTINCT R.questao_id, Q.xp from resposta as R INNER JOIN questao AS Q ON Q.id = R.questao_id 
		WHERE R.usuario_id = ? and R.tipo_resultado_id = 1`, 
		[id], function (err, results, fields){
			if(err){
				res.json({
					status: false,
					message: err
				})
			}else{
				let valor = 0;
				results.forEach(element => {
					valor = valor + element.xp;
				});
				res.json({
					status: true,
					value: valor
				})
			}
		});
	},
	*/
  updateAfterCorrectAnswer(req, res) {
    const user = req.params.id;
    const value = req.body.value;

    connection.query(
      `UPDATE usuario SET xp = xp + ?, 
							questoes_respondidas = questoes_respondidas + 1  
						WHERE id = ?`,
      [value, user],
      function (err, results, fields) {
        if (err) {
          res.json({
            status: false,
            message: err,
          });
        } else {
          res.json({
            status: true,
          });
        }
      }
    );
  },

  updateTitle(req, res) {
    const user = req.body.user;
    const titleId = req.body.titleId;

    /*console.log('usercontroller xp -->', xp)
    console.log('usercontroller idUser -->', user)*/

    connection.query(
      `UPDATE usuario SET titulo_id=? WHERE id = ?`,
      [titleId, user],
      function (err, results, fields) {
        if (err) {
          res.json({
            status: false,
            message: err,
          });
        } else {
          connection.query(
            `SELECT descricao FROM titulo WHERE id = ?`,
            [titleId],
            function (err, results, fields) {
              if (err) {
                res.json({
                  status: false,
                  message: err,
                });
              } else {
                res.json({
                  status: true,
                  result: results[0].descricao,
                });
              }
            }
          );
        }
      }
    );
    
  },

  userGroup(req, res) {
    const userId = req.params.id;
    console.log(userId);
    connection.query(
      `SELECT id,nome,grupo from usuario u where u.id = ?;`,
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

  updateUserGroup(req, res) {
    const userId = req.body.userId;
    const groupId = req.body.groupId;
    let cont = 0;
    response = [];
    function getRandomIntInclusive(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const allUsers = [
      206, 293, 265, 272, 259, 275, 285, 256, 289, 262, 288, 274, 283, 266, 291,
      269, 260, 282, 279, 267, 294, 276, 268, 297, 273, 263, 284, 292, 264, 281,
      270, 257, 287, 271, 162, 277, 296, 261, 179, 286, 186, 137, 258, 255, 254,
      278, 299, 299, 290, 295, 304, 280,
    ];
    // const allUsers = [5, 6, 1, 2, 3, 4, 7];
    try {
      allUsers.forEach((element) => {
        let value = getRandomIntInclusive(0, allUsers.length - 1);
        if (cont < 24) {
          // response.push({ id: allUsers[value], grupo: "A" });
          console.log('grupo A ', { id: allUsers[value], grupo: 'A' });
          connection.query(`UPDATE usuario SET grupo = ? WHERE id = ?`, [
            'A',
            allUsers[value],
          ]);
        } else {
          console.log('grupo B ', { id: allUsers[value], grupo: 'B' });
          response.push({ id: allUsers[value], grupo: 'B' });
          connection.query(`UPDATE usuario SET grupo = ? WHERE id = ?`, [
            'B',
            allUsers[value],
          ]);
        }
        cont++;
      });
      console.log('Acabou assim o array', response);
    } catch (err) {
      console.log(err);
    }
  },

  listAllUsers(req, res) {
    connection.query(`SELECT * FROM usuario`, function (err, results, fields) {
      if (err) {
        res.json({
          status: false,
          message: err,
        });
      } else {
        res.send(results);
      }
    });
  },
};
