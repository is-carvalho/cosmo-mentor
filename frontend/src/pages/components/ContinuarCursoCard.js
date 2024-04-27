import React, { Component } from "react";
//import iconeCard from '../../images/avatar128.png'
import "../../css/ContinuarCursoCard.css";
import "../../css/global.css";
import { Link } from "react-router-dom";
const jwt = require("jsonwebtoken");

class ContinuarCursoCard extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  goQuestions(e) {
    e.preventDefault();

    const id_usuario = this.props.id_usuario;
    const id_turma = this.props.id_turma;
    const id_curso = this.props.id_curso;
    // console.log(this.props);
    try {
      let data_curso = jwt.sign(id_curso, id_usuario.toString());
      let data_turma = jwt.sign(id_turma, id_usuario.toString());

      this.props.history.push({
        pathname: `/${data_curso}/${data_turma}/questoes`,
      });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <div className="card-continuar">
        <div className="card-text">
          <h3>
            {this.props.nome_curso} / {this.props.nome_turma}
          </h3>
          <p>Aprenda sobre {this.props.descricao_curso}</p>
        </div>
        <div className="btn-continuar-x">
          <Link to="#" onClick={(e) => this.goQuestions(e)}>Continuar Curso</Link>
        </div>
      </div>
    );
  }
}

export default ContinuarCursoCard;
