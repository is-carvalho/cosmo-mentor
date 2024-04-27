const connection = require('../database/connection');

module.exports = {
  processImage(req, res) {
    const image = req.body.image;
    const language = req.body.language;

    res.send(retorno);
  },

  // i wanna put a emotion on table questao_emocao,
  //   this is the table
  //   CREATE TABLE `questao_emocao` (
  //   `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  //   `emotion` varchar(255) NOT NULL,
  //   `question_id` int(10) unsigned NOT NULL,
  //   `tipo_momento` int(10) unsigned NOT NULL,
  //   `user_id` int(10) NOT NULL,
  //   PRIMARY KEY (`id`),
  //   KEY `question_id` (`question_id`),
  //   CONSTRAINT `momento_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questao` (`id`),
  //   CONSTRAINT `momento_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `usuario` (`id`)
  // ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  async insertEmotion(req, res) {
    const { emotion, question_id, tipo_momento, user_id } = req.body;
    if (!emotion || !question_id || !user_id) {
      return res.status(400).json({ error: 'Dados inválidos.' });
    }

    try {
      //     const [id] = await connection('questao_emocao').insert({
      //       emotion,
      //       question_id,
      //       tipo_momento,
      //       user_id,
      //     });
      //     return res.json({ id });
      //   } catch (err) {
      //     return res
      //       .status(400)
      //       .json({ error: 'Não foi possível inserir a emoção.' });
      //   }
      // },
      connection.query(
        'INSERT INTO questao_emocao (emotion, question_id, tipo_momento, user_id) VALUES (?, ?, ?, ?)',
        [emotion, question_id, tipo_momento, user_id],
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
    } catch (err) {
      return res
        .status(400)
        .json({ error: 'Não foi possível inserir a emoção.' });
    }
  },
};
