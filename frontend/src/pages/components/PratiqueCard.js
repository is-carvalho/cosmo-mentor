import React, { Component } from "react";
import "../../css/PratiqueCard.css";
import "../../css/global.css";
import jwt_decode from "jwt-decode";
import api from "../../services/api";
import jwt from "jsonwebtoken";

class PratiqueCard extends Component {
  constructor(props, context) {
    super(props, context);

    let dataUser = this.getUserData();
    this.state = {
      userId: "",
      tituloQuestao: "",
      idQuestao: "",
      cursos: [],
      user: dataUser,
      turmaId: "",
      match: {},
      hasClass: false,
    };
  }

  getUserData() {
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);
    // console.log(decoded)
    this.setState({
      userId: decoded.id,
    });
    return {
      id: decoded.id,
      tipo: decoded.tipo,
    };
  }
  componentDidMount() {
    api
      .get(`/searchCardQuestions`, {
        headers: {
          user: this.state.user.id,
        },
      })
      .then((response) => {
        try {
          // console.log(response);
          if (response.data[0] !== undefined) {
            this.setState({
              idQuestao: response.data[this.props.id].questaoId,
              tituloQuestao: response.data[this.props.id].titulo,
              turmaId: response.data[this.props.id].turmaId,
              hasClass: true,
            });
          }
        } catch (e) {
          console.log(e);
        }
      });
  }
  goAnswer(e, questao, titulo) {
    e.preventDefault();

    let data = jwt.sign(questao, localStorage.usertoken);
    let turmaId = jwt.sign(this.state.turmaId, localStorage.usertoken);
    // const idTurma = 'eyJhbGciOiJIUzI1NiJ9.OA.VvsRHcGgwP3FuP9pdKw0sgnN2FDrwkqujRwt7d27guM'
    // console.log(data, turmaId)
    if (this.state.hasClass) {
      this.props.history.push("/" + turmaId + "/" + data + "/responder", {
        turma: this.state.turma,
        questao: titulo,
      });
    }
  }

  render() {
    // console.log(this.state, "this.state")
    if (this.state.hasClass) {
      return (
        <div className="card-pratique">
          <div className="card-icon">
            <a
              href="#"
              onClick={(e) =>
                this.goAnswer(e, this.state.idQuestao, this.state.tituloQuestao)
              }
            >
              <i className="fab fa-python"></i>
            </a>
          </div>
          <div className="card-text">
            <h3>Pratique</h3>
            <p>{this.state.tituloQuestao}</p>
          </div>
        </div>
      );
    } else {
      return <></>;
    }
  }
}

export default PratiqueCard;
