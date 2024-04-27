import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import api from "../services/api";
import Header from "./components/Header";
import jwt_decode from "jwt-decode";
import Alert from "./components/Alert";
import profCosmo from "../images/amostra-usuarios/1.png";
import userCosmo from "../images/amostra-usuarios/2.png";
import Spinner from "./components/Spinner";

function getUserId() {
  const token = localStorage.usertoken;
  const decoded = jwt_decode(token);
  return decoded;
}

export default function InsidePost(props) {
  const location = useLocation().state;
  const history = useHistory();

  const [titulo] = useState(location.titulo);
  const [descricao] = useState(location.conteudo);
  const [autor] = useState(location.autor);
  const [flagReply, setFlagReply] = useState(false);
  const [results, setResults] = useState([]);
  const [postId] = useState(location.postId);
  const [turmaId] = useState(location.turmaId);
  const [forumId, setForumId] = useState();
  const [userId] = useState(getUserId().id);
  const [descricaoReply, setDescricaoReply] = useState("");
  const [alert] = useState(["", ""]);
  const [loading, setLoading] = useState(false)

  // const [tipoUsuario, setTipoUsuario] = useState();
  useEffect(() => {
    setLoading(true)
    api.get(`/getForum/${turmaId}`).then((res) => {
      setLoading(false)
      if (res.data.data[0]) setForumId(res.data.data[0].idForum);
    });

    setLoading(true)
    api
      .get("forum/reply", {
        headers: {
          postId: postId,
          forumId: forumId,
          userId: userId,
        },
      })
      .then((res) => {
        setLoading(false)
        setResults(res.data);
      })
      .catch((err) => {
        setLoading(false)
        console.log(err);
      });
  }, [descricaoReply, flagReply, alert, userId, turmaId, forumId, postId]);

  const configureReply = () => {
    refresh();
    setFlagReply(!flagReply);
  };

  const refresh = () => {
    setDescricaoReply({});
  };

  const registerReply = () => {
    const reply = {
      descricao: descricaoReply,
      userId: userId,
      postId: postId,
    };

    console.log(reply);

    api
      .post("forum/registerReply", reply)
      .then((res) => {
        if (res.data.status) {
          showAlert("Resposta cadastrada com sucesso.", "success");
          refresh();
        } else {
          console.log("erro ao registrar post");
        }
      })
      .catch((err) => {
        showAlert("Erro ao cadastrar resposta.", "error");
        console.log(err);
      });
    configureReply();

    api
      .get("/notifications", {
        headers: {
          idUser: userId,
          entityID: postId,
          type: "reply",
        },
      })
      .then((res) => {
        const results = res.data.data;

        // console.log(results);

        if (results.length > 0) {
          api.put("/updateNotification", {
            headers: {
              idUser: userId,
              entityID: postId,
              type: "reply",
            },
          });
        } else {
          api.post("/registerNotification", {
            headers: {
              idUser: userId,
              entityID: postId,
              type: "reply",
            },
          });
        }
      });
  };

  function showAlert(msg, status) {
    alert.push(<Alert msg={msg} status={status} hide={closeAlert} />);
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
  const closeAlert = () => {
    // alert.shift();
    alert.length = 0;
  };

  return (
    <>
      <>
      {loading ? <Spinner /> : <></>}
        <Header />
        <div className="fundo-bg fundo-gray" />

        <section className="jumbotron text-left question-hero question-prof">
          <div className="container">
            <div className="row">
              <div className="col">
                <>
                  <h1>{titulo}</h1>
                  <h6>Postagem realizada por: {autor}</h6>
                </>
              </div>
            </div>
          </div>
        </section>

        <section className="cosmo-hero">
          <div className="container wrapper">
            <div className="form-question">
              <div className="controls">
                <h1>{titulo}</h1>
                {descricao}
              </div>

              <div className="row">
                <div className="col-md-12 text-center register-quest-footer">
                  <button
                    id="btn-question-register"
                    onClick={() => {
                      configureReply();
                    }}
                    className="btn btn-cadastrar-color-1"
                  >
                    <i className="fas fa-plus"></i> Responder
                  </button>
                  <div className="float-right">
                    <button
                      type="button"
                      className="btn btn-danger cosmo-color-1"
                      onClick={history.goBack}
                    >
                      Voltar
                    </button>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 text-center register-quest-footer">
                  {flagReply ? (
                    <>
                      {
                        <div className="">
                          <label htmlFor="input-frmquest-title-group">
                            {" "}
                            Descrição{" "}
                            <strong className="campo-obrigatorio">*</strong>
                          </label>
                          <textarea
                            id="input-frmquest-enun"
                            className={"form-control"}
                            name="enunciado"
                            placeholder="Descrição da Resposta"
                            aria-label="Descrição da Postagem"
                            onChange={(e) => setDescricaoReply(e.target.value)}
                          />{" "}
                          <br />
                          <button
                            id="btn-question-register"
                            onClick={registerReply}
                            className="btn btn-cadastrar-color-1"
                          >
                            Salvar{" "}
                            <i
                              className="fas fa-save"
                              onClick={registerReply}
                            ></i>
                          </button>
                        </div>
                      }
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col-md-12 text-center register-quest-footer">
                  <ul>
                    {results?.map((reply, index) => (
                      <li>
                        {
                          <div
                            className="card border-info mb-3"
                            style={{ padding: "20px", textAlign: "left" }}
                          >
                            <h6>
                              Resposta feita por: {reply.nomeAutor} -{" "}
                              {reply.tipoUsuario !== 3 ? (
                                <>
                                  {"Professor"}
                                  <img
                                    src={profCosmo}
                                    alt="foto"
                                    style={{
                                      height: 50,
                                      width: 50,
                                      margin: 10,
                                      borderRadius: 90,
                                    }}
                                  />
                                </>
                              ) : (
                                <>
                                  {"Aluno"}
                                  <img
                                    src={userCosmo}
                                    alt="foto"
                                    style={{
                                      height: 50,
                                      width: 50,
                                      margin: 10,
                                      borderRadius: 90,
                                    }}
                                  />
                                </>
                              )}
                            </h6>
                            {reply.comentario}
                          </div>
                        }
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        {alert.length > 0 ? alert[alert.length - 1] : null}
      </>
    </>
  );
}
