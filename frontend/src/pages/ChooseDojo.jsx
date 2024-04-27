import React, { useEffect, useState } from "react";
import api from "../services/api";
import Header from "./components/Header";
import { useLocation, useHistory, Link } from "react-router-dom";
import jwt_decode from "jwt-decode";
import jwt from "jsonwebtoken";
// criar card com nome do dojo, data, piloto e co-piloto
// usuario pode clicar no card e ir para a pagina do dojo

function getUserId() {
  const token = localStorage.usertoken;
  const decoded = jwt_decode(token);
  return decoded;
}

function goQuestion(e, id, titulo) {
  e.preventDefault();
  let data = jwt.sign(id, localStorage.usertoken);
  this.props.history.push(`${data}/visualizar`, {
    turma: null,
    questao: titulo,
  });
}

export default function ChooseDojo() {
  const [userId, setUserId] = useState(getUserId());
  const [allDojos, setAllDojos] = useState([]);
  const [dojo, setDojo] = useState({});
  const [piloto, setPiloto] = useState("");
  const [coPiloto, setCoPiloto] = useState("");
  const [questao, setQuestao] = useState("");
  const [allQuestions, setAllQuestions] = useState([]);
  const [alert, setAlert] = useState("");
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [flagAtivo, setFlagAtivo] = useState(true);
  const locationState = useLocation();
  const history = useHistory();
  const [state] = useState(locationState.state || {}); // <-- cache state locally
  const [idTurma, setIdTurma] = useState(localStorage.turma);
  const [pathname, setPathname] = useState("");

  useEffect(() => {
    // usado para carregar todos os dados na criação do componente.
    if (allDojos.length < 1) {
      api
        .get("/coding-dojo")
        .then((response) => {
          setAllDojos(response.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    if (allQuestions.length < 1) {
      api
        .get("/listAllQuestions")
        .then((response) => {
          setAllQuestions(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    if (allUsers.length < 1) {
      api
        .get("/listAllUsers")
        .then((res) => {
          setAllUsers(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    // verificar se o usuário é piloto, copiloto ou plateia.
    // console.log(dojo, userId);
    // if (dojo.piloto === userId.id) {
    //   setPathname(`/${dojo.id}/responder`);
    // } else {
    //   let data = jwt.sign(questao, localStorage.usertoken);

    //   // setPathname(`/${data}/visualizar`);
    //   setPathname(`/${dojo.id}/responder`);
    //   console.log(pathname);
    // }
  }, [allDojos, allQuestions, allUsers]);

  const handleSubmit = (e) => {};

  const goQuestion = (e, id, titulo) => {
    e.preventDefault();
    const token = localStorage;
  };

  const viewQuestion = (e, id) => {
    e.preventDefault();
    let data = jwt.sign(id, localStorage.usertoken);
    // history.push(`/question/${id}/visualizar`);
    history.push(`${data}/visualizar`);
  };

  return (
    <>
      <Header />
      <div
      // className={classeWrapper}
      // onClick={this.btnWrapperClicked}
      >
        <div className="col">
          {/* <div className="main_container"> */}
          <div className="container">
            <div className="fundo-bg fundo-gray" />
            <section className="section-titulo-cursos">
              <h1>Code Dojo</h1>
              <p></p>
              <h5>
                Esse é o espaço onde você pode praticar suas habilidades de
                codificação ao lado de um copiloto. Boa sorte!
              </h5>
            </section>
            <div className="row">
              <div className="col">
                <ul>
                  {allDojos.length > 1 ? (
                    allDojos?.map((dojo, index) => (
                      <li className="list-group list-group-horizontal block">
                        {
                          <div className="" key={dojo.id}>
                            <div className="image-flip">
                              <div className="mainflip">
                                <div className="frontside">
                                  <div className="card">
                                    <div className="card-body text-center">
                                      <div className="course-icon ">
                                        <a href="">
                                          <i className="fas fa-graduation-cap"></i>
                                        </a>
                                      </div>
                                      <h4 className="card-title">
                                        Piloto: {dojo.piloto}, Copiloto:
                                        {dojo.copiloto}
                                      </h4>
                                    </div>
                                  </div>
                                </div>
                                <div className="backside">
                                  <div className="card">
                                    <div className="card-body text-center">
                                      <div className="custom-scrollbar-css p-2">
                                        <section className="backside-head">
                                          <h5 className="card-title">
                                            {/* {cursos[i].nome} */}
                                          </h5>
                                        </section>
                                        <section className="backside-body">
                                          <p className="card-text">
                                            {/* {cursos[i].descricao} */}
                                          </p>
                                          <small className="form-text text-muted">
                                            {/* Criado por {cursos[i].userNameCriador} */}
                                          </small>
                                        </section>
                                      </div>
                                      <section className="backside-footer">
                                        <button
                                          onClick={(e) => {
                                            console.log(dojo);
                                            if (
                                              dojo.piloto === userId.id ||
                                              dojo.copiloto === userId.id
                                            ) {
                                              setPathname(
                                                `/${dojo.id}/responder`
                                              );
                                            } else {
                                              console.log(dojo.questao_id);
                                              let data = jwt.sign(
                                                dojo.questao_id,
                                                localStorage.usertoken
                                              );
                                              setPathname(
                                                `/${data}/visualizar`
                                              );
                                            }
                                          }}
                                          className="btn btn-cursos"
                                        >
                                          <Link
                                            to={{
                                              pathname: pathname,
                                              state: {
                                                dojo,
                                              },
                                            }}
                                          >
                                            <input
                                              type="submit"
                                              value="Abrir Post"
                                              className="btn float-right login_btn"
                                              style={{ color: "white" }}
                                            />
                                          </Link>
                                          <i className="fas fa-sign-in-alt"></i>{" "}
                                          Ir para o curso
                                        </button>
                                      </section>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        }
                      </li>
                    ))
                  ) : (
                    <></>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
