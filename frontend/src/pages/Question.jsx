import React, { Component, Button } from "react";
import jwt_decode from "jwt-decode";
import "../css/Question.css";
//import imgQuestion from "../images/online_course_programming.jpg"
import api from "../services/api";
import jwt from "jsonwebtoken";
import Navbar from "./components/Navbar";
import Spinner from "./components/Spinner";
import Alert from "./components/Alert";
import GoBackButton from "./components/BotaoVoltar";

import {
  Accordion,
  AccordionCollapse,
  AccordionToggle,
  Card,
} from "react-bootstrap";
import iconDuvida from "../images/icons8-question-mark-32.png";
import iconListaDuvidas from "../images/icons8-bulleted-list-24.png";
import { Link } from "react-router-dom";

import { useEffect } from "react";
import { useState } from "react";
import useWebSocket from 'react-use-websocket';

import { BsFillStarFill } from "react-icons/bs"
import { BsStar } from "react-icons/bs"
// import { FaBeer } from 'react-icons/fa';

export default function Question(props) {

  const getUserId = () => {
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);
    // setUserGroup(localStorage.userGroup)
    return decoded.id;
  }

  const getUserGroup = () => {
    const token = localStorage.userGroup;
    // const decoded = jwt_decode(token);
    // setUserGroup(localStorage.userGroup)
    // console.log(token);
    return token;
  }

  const [userId, setUserId] = useState(getUserId())
  const [questoes, setQuestoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [curso, setCurso] = useState({})
  const [turma, setTurma] = useState({})
  const [conceitos, setConceitos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [dificuldades, setDificuldades] = useState([])
  const [situacoes, setSituacoes] = useState([])
  /*const [conceito, setConceito] = useState(0)
  const [categoria, setCategoria] = useState(0)
  const [dificuldade, setDificuldade] = useState(0)
  const [situacao, setSituacao] = useState(0)*/
  const [filtroQuestoes, setFiltroQuestoes] = useState([])
  const [alerts, setAlerts] = useState([])
  const [flagActive, setFlagActive] = useState([])
  const [userGroup, setUserGroup] = useState(getUserGroup())
  const [filterState, setFilterState] = useState({
    situacao: 0,
    dificuldade: 0,
    categoria: 0,
    conceito: 0,
  })

  const showAlert = (msg, status) => {
    let alertsList = alerts;
    alertsList.push(
      <Alert msg={msg} status={status} hide={closeAlert.bind(this)} />
    );
    setAlerts(alertsList);
  }

  const closeAlert = () => {
    let alertsList = alerts;
    alertsList.shift();
    setAlerts(alertsList);
  }

  // getUserGroup() {
  //   api
  //     .get(`/userGroup/${this.state.userId}`)
  //     .then((response) => {
  //       console.log(response.data[0].grupo);
  //       this.setState({
  //         userGroup: response.data[0].grupo,
  //       });
  //     })
  //     .catch((err) => {
  //       this.showAlert("Erro ao carregadar grupo do usuário", "error");
  //     });
  // }

  useEffect(() => {
    setUserId(getUserId())
    setUserGroup(getUserGroup())
  }, [])

  useEffect(() => {
    // this.getUserGroup();
    
    const idCurso = jwt_decode(props.match.params.idCurso);
    const idTurma = jwt_decode(props.match.params.idTurma);

    api
      .get(`/userGroup/${userId}`)
      .then((response) => {
        // console.log(response.data[0].grupo);
        setUserGroup(response.data[0].grupo)
      })
      .catch((err) => {
        showAlert("Erro ao carregadar grupo do usuário", "error");
      });

    api
      .get(`/course/${idCurso}`)
      .then((res) => {
        const objetoCurso = res.data;
        setCurso(objetoCurso)
      })
      .catch((err) => {
        showAlert("Erro ao carregar dados do curso", "error");
      });

    api
      .get(`/class/${idTurma}`)
      .then((res) => {
        const turma = res.data;
        //console.log(turma)
        setTurma(turma)
      })
      .catch((err) => {
        showAlert("Erro ao carregar dados da turma", "error");
      });
    const headers = {
      course: idCurso,
      conceito: filterState.conceito,
      dificuldade: filterState.dificuldade,
      categoria: filterState.categoria,
      situacao: filterState.situacao,
      user: userId,
      group: userGroup,
    };
    // console.log(headers);
    api
      .get(`/questions`, {
        headers: {
          course: idCurso,
          conceito: filterState.conceito,
          dificuldade: filterState.dificuldade,
          categoria: filterState.categoria,
          situacao: filterState.situacao,
          user: userId,
          group: userGroup,
        },
      })
      .then((res) => {
        const questoes = res.data;
        // console.log(questoes);
        setQuestoes(questoes)
        setLoading(false)
      })
      .catch((err) => {
        showAlert("Erro ao carregar dados das questões", "error");
      });

    api
      .get(`/concepts`)
      .then((response) => {
        console.log(response);
        // this.setState({ flagActive: response.flagActive });
        // console.log(this.state);
        
        return response.data.map((conceito) => ({
          id_conceito: `${conceito.id}`,
          descricao_conceito: `${conceito.descricao}`,
          flagActive: `${conceito.flagActive}`,
          disponivel_em: `${conceito.disponivel_em}`,
        }));
      })
      .then((conceitos) => {
        setConceitos(conceitos)
        // console.log(this.state.conceitos);
      });

    api
      .get(`/categories`)
      .then((response) => {
        return response.data.map((categoria) => ({
          id: `${categoria.id}`,
          descricao: `${categoria.descricao}`,
        }));
      })
      .then((categorias) => {
        setCategorias(categorias)
      });

    api
      .get(`/dificulties`)
      .then((response) => {
        return response.data.map((dificuldade) => ({
          id: `${dificuldade.id}`,
          descricao: `${dificuldade.descricao}`,
        }));
      })
      .then((dificuldades) => {
        setDificuldades(dificuldades)
      });
  }, [userId, filterState]);

  const goAnswer = (e, questao, titulo) => {
    e.preventDefault();

    let data = jwt.sign(questao, localStorage.usertoken);

    //console.log("Criptografado: ", data)
    const idTurma = props.match.params.idTurma;

    props.history.push("/" + idTurma + "/" + data + "/responder", {
      turma: turma.nome,
      questao: titulo,
    });
  }

  const onChange = (e) => {
    const filterUpdate = {[e.target.name]: e.target.value}
    // console.log(filterState)
    setFilterState(filterState => ({
      ...filterState,
        // ...stateAtual,
      ...filterUpdate,
    })); // <-----------------------------------------!!!!!!!!
    // console.log(filterState)
  }

  const onSubmit = (e) => {
    e.preventDefault();

    setLoading(true)

    api
      .get(`/questions`, {
        headers: {
          course: curso.id,
          conceito: filterState.conceito,
          dificuldade: filterState.dificuldade,
          categoria: filterState.categoria,
          situacao: filterState.situacao,
          user: userId,
        },
      })
      .then((res) => {
        console.log(res);
        const questoes = res.data;
        questoes.sort();
        setQuestoes(questoes)
        setLoading(false)
      })
      .catch((err) => {
        showAlert("Erro ao carregar dados das questões", "error");
      });
  };

  const calcularTempoRestante = (data_horario, idConceito) => {
    const agora = Date.parse(localStorage.dataHorario);
    const tempoLimite = Date.parse(data_horario);

    let tempoRestante = tempoLimite - agora;
    if (tempoRestante >= 0) {
      const segundos = Math.floor((tempoRestante / 1000) % 60);
      const minutos = Math.floor((tempoRestante / (1000 * 60)) % 60);
      const horas = Math.floor((tempoRestante / (1000 * 60 * 60)) % 24);

      tempoRestante = /*dias + " dias " +*/ horas + "h" + minutos + ":" + segundos
      // console.log(tempoRestante)
      return tempoRestante;
    } else {
      api.put(`/updateFlagActive`, {
        id_conceito: idConceito,
      })
      .then((res) => {
        window.location.reload(false);
      });
      return "00h00:00";
    }
  }

  const { lastJsonMessage, sendMessage } = useWebSocket('wss://cosmo.telemidia-ma.com.br/ws/', {
    onOpen: () => {return/*console.log(`Connected to App WS (Question.jsx)`)*/},
    onMessage: () => {
      if (lastJsonMessage) {
        localStorage.setItem("dataHorario", lastJsonMessage.currentdate)
        calcularTempoRestante(lastJsonMessage.currentdate, 0)
      }
    },
    queryParams: { 'token': localStorage.usertoken, 'page': 'question' },
    onError: (event) => { console.error(event); },
    shouldReconnect: (closeEvent) => true,
    reconnectInterval: 3000
  });

  const getHtmlQuestoes = () => {
    const questoesList = questoes;
    // console.log(questoes, "questoes");
    let lista = {};
    let retorno = [];
    const arrayConceitos = conceitos;

    for (let i in questoesList) {
      // if (arrayConceitos)
      let conceito = questoesList[i].conceito;

      if (typeof lista[conceito] == "undefined" || lista[conceito] == null) {
        lista[conceito] = [];
      }

      let situacaoStyle = "";
      if (questoesList[i].situacao_id >= 1 && questoesList[i].situacao_id <= 3) {
        situacaoStyle = `qbox-content${questoesList[i].situacao_id} m-b-sm pb-3 mb-0 small lh-125`;
      }

      /** alterar icon para situação */
      let categoriasList = [];
      const nomeClasses = [
        "far fa-money-bill-alt fa-lg",
        "far fa-flag fa-lg",
        "far fa-clock fa-lg",
      ];
      if (questoesList[i].categoria_id >= 1 && questoesList[i].categoria_id <= 3) {
        categoriasList.push(
          <i
            key={i}
            className={`${nomeClasses[questoesList[i].categoria_id - 1]}`}
            style={{ color: "grey" }}
          ></i>
        );
      }

      let progress = [];
      function progress_width() {
        if (questoesList[i].dificuldade_id === 1) {
          return 10;
        } else if (
          questoesList[i].dificuldade_id > 1 &&
          questoesList[i].dificuldade_id <= 5
        ) {
          return (questoesList[i].dificuldade_id - 1) * 25;
        }
      }
      if (questoesList[i].dificuldade_id >= 1 && questoesList[i].dificuldade_id <= 5) {
        progress.push(
          <div
            key={i}
            title={`Dificuldade: ${questoesList[i].dificuldade_id}/5`}
            className="progress"
            style={{ height: "10px", backgroundColor: "rgb(200,200,200)" }}
          >
            <div
              className={`progress-bar progress-bar-striped dificuldade-${questoesList[i].dificuldade_id}`}
              role="progressbar"
              style={{ width: `${progress_width()}%` }}
              aria-valuenow={`${progress_width}`}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        );
      }
      /*
      let $imagePreview = null;
      if (questoes[i].imagem === null) {
        $imagePreview = imgQuestion
      } else {
        $imagePreview = this.state.foto
      }*/
      // console.log(lista[conceito]);
      lista[conceito].push(
        <div
          className={situacaoStyle}
          key={questoesList[i].sequencia}
          //onClick={(e) => this.goAnswer(e, questoes[i].id, questoes[i].titulo)}
        >
          <div className="row">
            <div
              className="col-10 align-self-center"
              onClick={(e) =>
                goAnswer(e, questoesList[i].id, questoesList[i].titulo)
              }
            >
              <strong className="d-block text-gray-dark">
                {questoesList[i].titulo}
              </strong>
              {questoesList[i].resumo}
            </div>
            <div
              className="col-1 align-self-center text-center"
              style={{ width: "20px" }}
            >
              <Link
                to={{
                  pathname: `/${curso.id}/${turma.id}/${questoesList[i].id}/criarPost`,
                  state: {
                    cursoId: curso.id,
                    turmaId: turma.id,
                    questId: questoesList[i].id,
                  },
                }}
              >
                <img
                  src={iconDuvida}
                  alt="?"
                  title="Submeter dúvida"
                  style={{
                    width: "20px",
                  }} /*onClick={(e) => this.submitDoubt(e, questoes[i].id)}*/
                ></img>
              </Link>
            </div>
            <div
              className="col-1 align-self-center text-center"
              style={{ width: "20px" }}
            >
              <Link
                to={{
                  pathname: `/${curso.id}/${turma.id}/${questoesList[i].id}/duvidas`,
                  state: {
                    cursoId: curso.id,
                    turmaId: turma.id,
                    questId: questoesList[i].id,
                    menu: false,
                  },
                }}
              >
                <img
                  src={iconListaDuvidas}
                  alt=""
                  title="Listar dúvidas nesta questão"
                  style={{
                    width: "20px",
                  }} /*onClick={(e) => this.listDoubts(e, questoes[i].id)}*/
                ></img>
              </Link>
            </div>
            <div className="col-1 align-self-center text-center">
              {filterState.categoria}
            </div>
            <div className="col-1 align-self-center text-center">
              {progress}
            </div>
            <div
              style={{ height: "18px" }}
              className="col-10 align-self-center"
              onClick={(e) =>
                goAnswer(e, questoesList[i].id, questoesList[i].titulo)
              }
            ></div>
          </div>
        </div>
      );
    }

    const configurarTopicos = (conceito) => {
      //conceito = [conceito.descricao_conceito, conceito.flagActive];

      retorno.push(
        <Accordion key={[conceito.descricao_conceito, conceito.flagActive]} defaultActiveKey="1">
          <Card className="qbox shadow-sm rounded">
            <Card.Header>
              <AccordionToggle as={Button} variant="link" eventKey="0">
                <div className="qbox-title">
                  <h4>{conceito.descricao_conceito}</h4>
                  <div>
                    {parseInt(conceito.flagActive) !== 1 ? `Disponível em ${ calcularTempoRestante(conceito.disponivel_em, parseInt(conceito.id_conceito)) }  ` : "Disponível  "}
                    {/*<i
                      className={parseInt(conceito.flagActive) !== 1 ? "fa fa-lock" : "fa fa-unlock"}
                    ></i>*/}
                    <BsFillStarFill/>
                    <BsFillStarFill/>
                    <BsStar/>
                  </div>
                </div>
              </AccordionToggle>
            </Card.Header>

            {conceito.flagActive !== "null" ? (
              <AccordionCollapse eventKey="0">
                <Card.Body>
                  {lista[conceito.descricao_conceito]}
                  <div className="qbox-footer"></div>
                </Card.Body>
              </AccordionCollapse>
            ) : (
              <></>
            )}
          </Card>
        </Accordion>
      );

    }

    conceitos.forEach(configurarTopicos);
    return retorno;
  }

  const submitDoubt = (e, idQuestao) => {
    e.preventDefault();
    let data = jwt.sign(idQuestao, userId.toString());

    //console.log("Criptografado: ", data)

    const idCurso = props.match.params.idCurso;
    const idTurma = props.match.params.idTurma;

    props.history.push(`/${idCurso}/${idTurma}/${data}/criarPost`);
  }

  /*listDoubts(e, idQuestao) {
    e.preventDefault()
    let data = jwt.sign(idQuestao, this.state.userId.toString())

    //console.log("Criptografado: ", data)

    const idCurso = this.props.match.params.idCurso
    const idTurma = this.props.match.params.idTurma

    this.props.history.push(`/${idCurso}/${idTurma}/${data}/duvidas`)
  }*/

  if (loading) {
    return <Spinner />;
  }

  const questoesPagina = getHtmlQuestoes();

  const retorno = (
    <React.Fragment>
      <div className="fundo-bg fundo-gray" />
      <section className="jumbotron text-left question-hero">
        <div className="container">
          <div className="row">
            <div className="col">
              <h6>
                <button
                  type="button"
                  onClick={() => props.history.go(-2)}
                  className="link"
                >
                  {curso.nome}
                </button>{" "}
                /{" "}
                <button
                  type="button"
                  onClick={() => props.history.go(-1)}
                  className="link"
                >
                  {turma.nome}
                </button>
              </h6>
              <h1>Minhas atividades</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="cosmo-hero">
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="ibox shadow-sm rounded">
                <div className="ibox-title">
                  <h5>
                    Filtrar <i className="fa fa-filter"></i>
                  </h5>
                </div>
                <div className="ibox-content m-b-sm border-bottom">
                  <form
                    noValidate
                    onSubmit={onSubmit}
                    className="form-search"
                  >
                    <div className="row">
                      <div className="col-3">
                        <div className="form-group">
                          <label className="col-form-label">Conceito:</label>
                          <select
                            id="select-frm-conceito"
                            className="form-control"
                            name="conceito"
                            placeholder="Conceito"
                            value={filterState.conceito}
                            aria-label="Conceito"
                            onChange={onChange}
                          >
                            <option key="0" value="0">
                              Todos
                            </option>
                            {conceitos.map(function (conceito) {
                              return (
                                <option
                                  key={conceito.id_conceito}
                                  value={conceito.id_conceito}
                                >
                                  {conceito.descricao_conceito}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="form-group">
                          <label className="col-form-label">Categoria:</label>
                          <select
                            id="select-frm-categoria"
                            className="form-control"
                            name="categoria"
                            placeholder="Categoria"
                            value={filterState.categoria}
                            aria-label="Categoria"
                            onChange={onChange}
                          >
                            <option key="0" value="0">
                              Todas
                            </option>
                            {categorias.map(function (categoria) {
                              return (
                                <option
                                  key={categoria.id}
                                  value={categoria.id}
                                >
                                  {categoria.descricao}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="form-group">
                          <label className="col-form-label">
                            Dificuldade:
                          </label>
                          <select
                            id="select-frm-dificuldade"
                            className="form-control"
                            name="dificuldade"
                            placeholder="Dificuldade"
                            value={filterState.dificuldade}
                            aria-label="Dificuldade"
                            onChange={onChange}
                          >
                            <option key="0" value="0">
                              Todas
                            </option>
                            {dificuldades.map(function (
                              dificuldade
                            ) {
                              return (
                                <option
                                  key={dificuldade.id}
                                  value={dificuldade.id}
                                >
                                  {dificuldade.descricao}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="form-group">
                          <label className="col-form-label">Situação:</label>
                          <select
                            id="select-frm-situacao"
                            className="form-control"
                            name="situacao"
                            placeholder="Situação"
                            value={filterState.situacao}
                            aria-label="Situação"
                            onChange={onChange}
                          >
                            <option key="0" value="0">
                              Todas
                            </option>
                            <option key="1" title="não resolvi" value="1">
                              Não resolvi
                            </option>
                            <option key="2" title="acertei" value="2">
                              Acertei
                            </option>
                            <option key="3" title="errei" value="3">
                              Errei
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <button className="btn btn-primary btn-sm float-right">
                          Filtrar
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">{questoesPagina}</div>
          </div>
          <GoBackButton />
        </div>
      </section>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <Navbar />
      <div className="app-body">{retorno}</div>
      {alerts.length > 0 ? alerts[0] : null}
    </React.Fragment>
  );
  
}
