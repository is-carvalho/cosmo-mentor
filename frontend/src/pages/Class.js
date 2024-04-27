import React, { Component } from "react";
// import imgCurso from "../images/curso-icon.png";
import "../css/ListTurmas.css";
import api from "../services/api";
import jwt_decode from "jwt-decode";
import Navbar from "./components/Navbar";
import Sidebar2 from "./components/Sidebar";
import Spinner from "./components/Spinner";
import Alert from "./components/Alert";

const jwt = require("jsonwebtoken");

export default class Class extends Component {
  userId = this.getUserId();
  btnWrapperClicked = this.btnWrapperClicked.bind(this);

  state = {
    turmas: [],
    loading: true,
    valueFilter: "0",
    currentTurma: {
      id: -1,
      password: "",
    },
    passwordClassUser: "",
    classeWrapper: "wrapper active",
    curso: {},
    alerts: [],
  };

  showAlert(msg, status) {
    let alerts = this.state.alerts;
    alerts.push(
      <Alert msg={msg} status={status} hide={this.closeAlert.bind(this)} />
    );
    this.setState({ alerts: alerts });
  }

  closeAlert() {
    let alerts = this.state.alerts;
    alerts.shift();
    this.setState({ alerts: alerts });
  }

  componentDidMount() {
    const idCurso = jwt_decode(this.props.match.params.idCurso); //objetoCurso.id;

    api
      .get(`/course/${idCurso}`)
      .then((res) => {
        const objetoCurso = res.data;
        this.setState({ curso: objetoCurso });
      })
      .catch((err) => {
        this.showAlert("Erro ao carregar dados do curso", "error");
      });

    api
      .get("/classesUser", {
        headers: {
          course: idCurso,
          user: this.userId,
        },
      })
      .then((res) => {
        const turmas = res.data;
        this.setState({ turmas: turmas, loading: false });
      })
      .catch((err) => {
        this.showAlert("Erro ao carregar turmas", "error");
      });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  getUserId() {
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);
    return decoded.id;
  }

  setCurrentTurma(e, id, password) {
    //console.log("Indice da turma: ",id,password)
    this.setState({ currentTurma: { id, password } });
  }

  handleClick(e) {
    e.preventDefault();

    //console.log("clicou", e, this.state)

    if (this.state.currentTurma.password === this.state.passwordClassUser) {
      api
        .post("/registerInClass", {
          class: this.state.currentTurma.id,
          user: this.userId,
        })
        .then((res) => {
          this.setState({ loading: true });
          //console.log(res)

          this.setState(
            this.state.turmas.forEach((item) => {
              item.registered = this.userId;
            })
          );
          this.setState({ loading: false });

          //console.log(this.state)
          this.showAlert("Registrado com sucesso", "success");
        })
        .catch((error) => {
          this.showAlert("Erro ao se matricular nesta turma", "error");
        });

      //console.log("correto")
    } else {
      this.showAlert("Senha invalida", "error");
    }
  }

  goQuestions(e, turma) {
    e.preventDefault();

    let data = jwt.sign(turma, this.userId.toString());
    localStorage.setItem("turma", data);
    //console.log("Criptografado: ", data)

    const idCurso = this.props.match.params.idCurso;

    this.props.history.push(`/${idCurso}/${data}/questoes`);
  }

  getHTMLTurmas() {
    const turmas = this.state.turmas; //puxa as informaçoes do state nessesarias para a geração dinamica do html
    let lista = [];

    for (let i in turmas) {
      if (this.state.valueFilter === "1") {
        if (turmas[i].registered === null) {
          continue;
        }
      }

      lista.push(
        <div className="col-4" key={turmas[i].id}>
          <div className="class-image-flip">
            <div className="class-mainflip">
              <div className="class-frontside">
                <div className="card">
                  <div className="card-body text-center">
                    <div className="class-icon">
                      <a>
                        <i className="fas fa-graduation-cap"></i>
                      </a>
                    </div>
                    <h4 className="card-title">{turmas[i].nome}</h4>
                  </div>
                </div>
              </div>
              <div className="class-backside">
                <div className="card">
                  <div className="card-body text-center">
                    <div className="custom-scrollbar-css p-2">
                      <section className="class-backside-head">
                        <h5 className="card-title">{turmas[i].nome}</h5>
                      </section>
                      <section className="class-backside-body">
                        <p className="card-text">{turmas[i].descricao}</p>
                        <small className="form-text text-muted">
                          Criado por {turmas[i].nomeCriador}
                        </small>
                      </section>
                    </div>
                    <section className="class-backside-footer">
                      {turmas[i].registered === null ? (
                        <button
                          onClick={(e) =>
                            this.setCurrentTurma(
                              e,
                              turmas[i].id,
                              turmas[i].senha
                            )
                          }
                          data-toggle="modal"
                          data-target="#modalPush"
                          className="btn btn-turmas"
                        >
                          <i className="fas fa-sign-in-alt"></i> Matricule-se
                        </button>
                      ) : (
                        <button
                          onClick={(e) => this.goQuestions(e, turmas[i].id)}
                          className="btn btn-turmas"
                        >
                          <i className="fas fa-sign-in-alt"></i> Ir para a turma
                        </button>
                      )}
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return lista;
  }

  btnWrapperClicked(e) {
    if (
      e.target.className === "hamburger" ||
      e.target.className === "hamburger__inner"
    ) {
      if (this.state.classeWrapper === "wrapper active") {
        this.setState({
          classeWrapper: "wrapper",
        });
      } else {
        this.setState({
          classeWrapper: "wrapper active",
        });
      }
    }
  }

  render() {
    //aqui começa a renderizar(desenha) //
    if (this.state.loading) {
      return <Spinner />;
    }
    //console.log("curso: ", this.state.curso)
    //console.log(this.state)

    const turmas = this.getHTMLTurmas();

    const modal = (
      <div
        className="modal fade"
        id="modalPush"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-notify modal-info" role="document">
          <div className="modal-content text-center pt-4">
            <div className="modal-body text-center">
              <i className="fas fa-door-open fa-5x mb-4"></i>

              <h4>Deseja se matricular nesta turma?</h4>
              {this.state.currentTurma.password !== "" ? (
                <React.Fragment>
                  <input
                    type="password"
                    className="form-control passwordClassUser"
                    name="passwordClassUser"
                    placeholder="Digite a senha"
                    value={this.state.passwordClassUser}
                    onChange={(e) => this.handleChange(e)}
                  />
                </React.Fragment>
              ) : (
                ""
              )}

              <div className="buttons pt-4 mb-4">
                <button
                  type="button"
                  onClick={(e) => this.handleClick(e)}
                  className="btn btn-primary m-2"
                  data-dismiss="modal"
                >
                  Sim
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary waves-effect m-2"
                  data-dismiss="modal"
                >
                  Não
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    const retorno = (
      <React.Fragment>
        <section className="section-titulo-curso-esp">
          <h1>{this.state.curso.nome}</h1>
          <h4>{this.state.curso.descricao}</h4>
          <h6>Criado por {this.state.curso.nomeCriador}</h6>
        </section>
        <section>
          <div className="row">{turmas}</div>
        </section>

        {modal}
      </React.Fragment>
    );

    return (
      <React.Fragment>
        <div
          className={this.state.classeWrapper}
          onClick={this.btnWrapperClicked}
        >
          <Navbar />

          <div className="main_container">
            <Sidebar2 activeOption="cursos" />

            <div className="container-fluid">
              <div className="row">
                <div className="col">{retorno}</div>
              </div>
            </div>
          </div>
        </div>

        {this.state.alerts.length > 0 ? this.state.alerts[0] : null}
      </React.Fragment>
    );
  }
}
//foram 3 divs pos eu acho mais facil de organizar e futuramente fica mais facil de customizar com o css
