import React, { useEffect, useState } from "react";
import "../css/Forum.css";
import { useLocation, useHistory } from "react-router-dom";
import api from "../services/api";
import jwt_decode from "jwt-decode";
import Header from "./components/Header";
import Alert from "./components/Alert";
import GoBackButton from "./components/BotaoVoltar";
import Spinner from "./components/Spinner";

function getUserId() {
  const token = localStorage.usertoken;
  const decoded = jwt_decode(token);
  return decoded;
}

export default function CreatePost() {
  const locationState = useLocation().state;
  const history = useHistory();

  const [questaoId, setQuestaoId] = useState();
  const [turmaId, setTurmaId] = useState(1);
  const [user] = useState(getUserId());
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [alert] = useState(["", ""]);
  const [questoes, setQuestoes] = useState();
  const [hasClicked, setHasClicked] = useState(false);
  const [loading, setLoading] = useState(false)

  if (
    locationState !== undefined &&
    questaoId === undefined &&
    setTurmaId &&
    undefined
  ) {
    setQuestaoId(locationState.questId);
    setTurmaId(locationState.turmaId);
  }
  useEffect(() => {
    setLoading(true)
    api
      .get("/allQuestions", {
        headers: {
          userId: user.id,
        },
      })
      .then((res) => {
        setQuestoes(res.data);
        setLoading(false)
      })
      .catch((err) => {
        console.log(err);
        setLoading(false)
      });
  }, [titulo, questaoId, alert, user]);

  const configurePost = () => {
    setLoading(true)
    api
      .get(`/getForum/${turmaId}`)
      .then((resGet) => {
        setLoading(false)
        const post = {
          userId: user.id,
          questionId: questaoId,
          forumId: resGet.data.data[0].idForum,
          titulo: titulo,
          descricao: descricao,
        };

        api
          .post("/registerPost", post)
          .then((res) => {
            if (res.data.status) {
              showAlert("Postagem cadastrada com sucesso.", "success");
              setHasClicked(true);
            } else {
              showAlert("Erro ao cadastrar resposta.", "error");
              console.log("erro ao registrar post");
            }
          })
          .catch((err) => {
            showAlert("Erro ao cadastrar resposta.", "error");
            console.log(err);
          });
      })
      .catch((err) => {
        setLoading(false)
        showAlert("Erro ao cadastrar resposta.", "error");
        console.log(err);
      });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
  };
  function showAlert(msg, status) {
    alert.push(<Alert msg={msg} status={status} hide={closeAlert} />);
    // window.alert("Postagem Criada com sucesso!");
    setTimeout(() => {
      // window.location.reload();
      history.goBack();
    }, 2500);
    console.log(alert[alert.length - 1]);
  }
  function closeAlert() {
    alert.length = 0;
  }
  return (
    <>
      {loading ? <Spinner /> : <></>}
      <Header />
      <div className="fundo-bg fundo-gray" />

      <section className="jumbotron text-left question-hero question-prof">
        <div className="container">
          <div className="row">
            <div className="col">
              <>
                <h1>Cadastrar Postagem</h1>
                <h6>
                  Ao cadastrar, a postagem ficará disponível para ter respostas
                  no Forum.
                </h6>
              </>
            </div>
          </div>
        </div>
      </section>

      <section className="cosmo-hero">
        <div className="container wrapper">
          <div className="form-question" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-12">
                <p className="text-muted">
                  <strong className="campo-obrigatorio">*</strong> Campo
                  Obrigatório
                </p>
              </div>
            </div>
            <div className="controls">
              <div className="row">
                <div className="col-sm-3">
                  <div className="form-group">
                    <label htmlFor="input-frmquest-course-group">
                      Questão<strong className="campo-obrigatorio">*</strong>
                    </label>
                    <div
                      id="input-frmquest-course-group"
                      className={"input-group"}
                    >
                      <div className="input-group-prepend">
                        <span className="input-group-text bg-light">
                          <i className="fas fa-globe-americas"></i>
                        </span>
                      </div>
                      <select
                        id="select-frmquest-course"
                        className={"is-valid form-control"}
                        name="curso"
                        placeholder="Curso"
                        onChange={(e) => {
                          setQuestaoId(e.target.value);
                        }}
                      >
                        <option value=""> </option>
                        {questoes !== undefined ? (
                          questoes.map(function (questao) {
                            return (
                              <option key={questao.id} value={questao.id}>
                                {questao.titulo}
                              </option>
                            );
                          })
                        ) : (
                          <></>
                        )}
                      </select>
                    </div>
                    {<span className="invalid-feedback"></span>}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label htmlFor="input-frmquest-title-group">
                      Titulo <strong className="campo-obrigatorio">*</strong>
                    </label>
                    <input
                      id="input-frmquest-title"
                      type="text"
                      className={"form-control"}
                      name="titulo"
                      placeholder="Titulo da Postagem"
                      onChange={(e) => setTitulo(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="input-frmquest-title-group">
                      {" "}
                      Descrição <strong className="campo-obrigatorio">*</strong>
                    </label>
                    <textarea
                      id="input-frmquest-enun"
                      className={"form-control"}
                      name="enunciado"
                      placeholder="Descrição da Postagem"
                      aria-label="Descrição da Postagem"
                      onChange={(e) => setDescricao(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12 text-center register-quest-footer">
                {!hasClicked ? (
                  <button
                    id="btn-question-register"
                    type="submit"
                    onClick={configurePost}
                    className="btn btn-cadastrar-color-1"
                  >
                    <i className="fas fa-save"></i> Salvar
                  </button>
                ) : (
                  <></>
                )}
                <GoBackButton />
              </div>
            </div>
          </div>
        </div>
        <>{alert.length > 0 ? alert[alert.length - 1] : null}</>
      </section>
    </>
  );
}
