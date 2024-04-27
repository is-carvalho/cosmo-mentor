import React, { useState, useEffect } from "react";
import api from "../services/api";
import GoBackButton from "./components/BotaoVoltar";
import Header from "./components/Header";
import Spinner from "./components/Spinner";
import "../css/CreateDojo.css";

export default function CreateDojo(props) {
  const [questaoDojo, setQuestaoDojo] = useState([]);
  const [piloto, setPiloto] = useState("");
  const [coPiloto, setCopiloto] = useState("");
  const [loading, setLoading] = useState(false);
  const [questaoId, setQuestaoId] = useState("");
  const [allQuestions, setAllQuestions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allChoosedQuestions, setAllChoosedQuestions] = useState([]);
  const [dojoId, setDojoId] = useState();
  const [currentDojoAvaliable, setCurrentDojoAvaliable] = useState({});
  const [hasCurrentDojo, setHasCurrentDojo] = useState(false);

  const [validationQuestion, setValidationQuestion] = useState(false);
  const [validationPiloto, setValidationPiloto] = useState(false);
  const [validationCopiloto, setValidationCopiloto] = useState(false);

  useEffect(() => {
    setLoading(true);

    if (!dojoId) {
      api
        .get("/coding-dojo")
        .then((res) => {
          console.log(res);
          setDojoId(res.data.data[res.data.data.length - 1].id + 1);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    if (allQuestions.length === 0) {
      api // get all questions
        .get("/listAllQuestions")
        .then((res) => {
          if (res.data.length > 0) {
            setLoading(false);
            setAllQuestions(res.data);
          }
        })
        .catch((err) => {
          console.log(err); // necessário colocar o alert ainda
          setLoading(false);
        });
    }

    if (allUsers.length === 0) {
      api // get all users
        .get("/listAllUsers")
        .then((res) => {
          if (res.data.length > 0) {
            setLoading(false);
            setAllUsers(res.data);
          }
        })
        .catch((err) => {
          console.log(err); // necessário colocar o alert ainda
          setLoading(false);
        });
    }
    // find if has a active dojo
    api
      .get("/dojosAvaliables")
      .then((res) => {
        setCurrentDojoAvaliable(res.data);
        setHasCurrentDojo(true);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [allQuestions, allUsers]);

  useEffect(() => {
    return () => {
      // api
      //   .post("/coding-dojo/createQuestion", {
      //     questao_id: questaoId,
      //     dojoId: dojoId,
      //   })
      //   .then((res) => {
      //     console.log(res);
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
    };
  }, [
    validationQuestion,
    validationPiloto,
    validationCopiloto,
    loading,
    coPiloto,
    piloto,
    allChoosedQuestions,
    questaoDojo,
  ]);

  const pushNewQuestion = (e) => {
    e.preventDefault();
    const auxId = questaoId;
    const auxQuestao = allQuestions.filter((questao) => {
      if (questao.id == auxId) {
        console.log(questao);
        return questao;
      }
    });
    setQuestaoDojo(auxQuestao[0]);
    allChoosedQuestions.push(auxQuestao[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const submitForm = (e) => {
    e.preventDefault();

    if (allChoosedQuestions.length > 0) {
      allChoosedQuestions.forEach((questao) => {
        console.log(dojoId, "dojoid");
        api
          .post("/coding-dojo/createQuestion", {
            questao_id: questao.id,
            dojoId: dojoId,
          })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    }
    const headers = {
      questao_id: questaoId,
      piloto: piloto,
      coPiloto: coPiloto,
      data: new Date(),
    };
    // console.log(headers);
    if (validationQuestion && validationPiloto && validationCopiloto) {
      api
        .post("/createDojo", headers)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
      console.log("Formulário enviado com sucesso!");
      alert("Criado com sucesso.");
    } else {
      console.log("err ao enviar o formulário");
    }
  };

  // i wanna find the dojos that are actives and end them
  const endDojo = () => {
    api
      .post(`/endDojo/`, {
        dojoId: dojoId - 1, // dojoId é o atual que irá ser criado, quero remover o anterior, portanto, -1
      })
      .then((res) => {
        console.log(res);
        alert("Dojo finalizado");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const removeQuestion = (index) => {
    allChoosedQuestions.splice(index, 1);
    console.log(allChoosedQuestions);
  };

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
                <h1>Criar Code Dojo</h1>
                <h6>
                  Nesse espaço, você é capaz de criar um Evento de Code Dojo,
                  selecionando a questão, o piloto e seu copiloto.
                </h6>
              </>
            </div>
          </div>
        </div>
      </section>
      <section className="cosmo-hero">
        <div className="container wrapper">
          <form
            onSubmit={handleSubmit}
            className="form-question"
            encType="multipart/form-data"
            noValidate
          >
            <div className="row">
              <div className="col-md-12">
                <p className="text-muted">
                  <strong className="campo-obrigatorio">*</strong> Campo
                  Obrigatório
                </p>
                <div
                  className="bs-bars float-right"
                  onClick={() => {
                    endDojo();
                  }}
                >
                  <div className="toolbar btn btn-danger neworder ">
                    <i className="fas fa-minus"></i> Desativar Dojo Atual
                  </div>
                </div>
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
                        className={
                          validationQuestion
                            ? "is-valid form-control"
                            : "form-control"
                        }
                        name="curso"
                        placeholder="Curso"
                        onChange={(e) => {
                          setQuestaoId(e.target.value);
                          setValidationQuestion(true);
                          // setQuestaoDojo(e.target.value);
                        }}
                      >
                        {allQuestions !== undefined ? (
                          allQuestions.map(function (questao) {
                            return (
                              <option
                                key={questao.id}
                                value={questao.id}
                                name={questao}
                              >
                                {questao.titulo}
                              </option>
                            );
                          })
                        ) : (
                          <></>
                        )}
                      </select>
                      <div
                        className=" bg-green input-group-append input-group-text "
                        style={{
                          display: "flex",
                          marginLeft: "1vw",
                          cursor: "pointer",
                        }}
                        onClick={pushNewQuestion}
                      >
                        <button
                          type="button"
                          className="border-0 bg-transparent"
                        >
                          <i className="fas fa-check-square"></i>
                        </button>
                      </div>
                    </div>
                    {<span className="invalid-feedback"></span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="controls">
              <div className="row">
                <div className="col-sm-3">
                  <div className="form-group">
                    <label htmlFor="input-frmquest-course-group">
                      Piloto<strong className="campo-obrigatorio">*</strong>
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
                        className={
                          validationPiloto
                            ? "is-valid form-control"
                            : "form-control"
                        }
                        name="curso"
                        placeholder="Curso"
                        onChange={(e) => {
                          setCopiloto(e.target.value);
                          setValidationPiloto(true);
                        }}
                      >
                        <option value=""> </option>
                        {allUsers !== undefined ? (
                          allUsers.map(function (user) {
                            return (
                              <option key={user.id} value={user.id}>
                                {user.nome}
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
            </div>

            <div className="controls">
              <div className="row">
                <div className="col-sm-3">
                  <div className="form-group">
                    <label htmlFor="input-frmquest-course-group">
                      Copiloto<strong className="campo-obrigatorio">*</strong>
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
                        className={
                          validationCopiloto
                            ? "is-valid form-control"
                            : "form-control"
                        }
                        name="curso"
                        placeholder="Curso"
                        onChange={(e) => {
                          setPiloto(e.target.value);
                          setValidationCopiloto(true);
                        }}
                      >
                        <option value=""> </option>
                        {allUsers !== undefined ? (
                          allUsers.map(function (user) {
                            return (
                              <option key={user.id} value={user.id}>
                                {user.nome}
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

              <br />
              <div>
                <h2>Questões adicionadas</h2>
                <div className="row">
                  <div className="col-md-12">
                    <div className="table-responsive">
                      <table className="table table-striped table-hover">
                        <thead>
                          <tr>
                            <th>Questão</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allChoosedQuestions.map((question, index) => (
                            <tr key={index}>
                              <td>{question.titulo}</td>
                              <td>
                                <button
                                  className="btn btn-danger"
                                  onClick={() => removeQuestion(index)}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <br />
            <div className="row">
              <div className="col-md-12 text-center register-quest-footer">
                <button
                  id="btn-question-register"
                  type="submit"
                  className="btn btn-cadastrar-color-1"
                  onClick={submitForm}
                >
                  <i className="fas fa-save"></i> Finalizar
                </button>
                <div className="float-right"></div>
              </div>
            </div>
          </form>
          <GoBackButton />
        </div>
      </section>

      {alert[alert.length - 1]}
      <>{alert.length > 0 ? alert[alert.length - 1] : null}</>
    </>
  );
}
