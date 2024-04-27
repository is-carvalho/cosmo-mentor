import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import api from "../services/api";
import Alert from "./components/Alert";

export default function ChangeQuestionOrder() {
  const [questoes, setQuestoes] = useState([]);
  const [questao, setQuestao] = useState([]);
  const [curso, setCurso] = useState();
  const [cursos, setCursos] = useState([]);
  const [conceitos, setConceitos] = useState();
  const [ordem, setOrdem] = useState();
  const [alert] = useState(["", ""]);
  const history = useHistory();

  useEffect(() => {
    if (questoes.length === 0) {
      api
        .get("listAllQuestions")
        .then((response) => {
          setQuestoes(response.data);
        })
        .catch((err) => {
          console.log(err, "Erro na requisicao de questoes");
        });
    }

    if (cursos.length === 0) {
      api
        .get("/courses")
        .then((response) => {
          setCursos(response.data);
        })
        .catch((err) => {
          console.log(err, "Erro na requisicao de cursos");
        });
    }
  }, [questoes, cursos, alert]);

  const onSubmit = (e) => {
    e.preventDefault();
    // console.log(questao);

    api
      .put("/questionOrder", {
        headers: {
          questionId: questao,
          newOrder: ordem,
        },
      })
      .then((res) => {
        // console.log(res);
        showAlert("Questao atualizada", "success");
        console.log(alert);
      })
      .catch((err) => {
        console.log("Erro ao atualizar ordem da questão.", err);
      });
  };

  function showAlert(msg, status) {
    alert.push(<Alert msg={msg} status={status} hide={closeAlert} />);
    window.alert("Questao atualizada com sucesso!");
    setTimeout(() => {
      history.goBack();
    }, 2500);
    console.log(alert[alert.length - 1]);
  }
  function closeAlert() {
    alert.length = 0;
  }

  return (
    <>
      <div className="fundo-bg fundo-gray" />
      <section className="jumbotron text-left question-hero question-prof">
        <div className="container">
          <div className="row">
            <div className="col">
              <React.Fragment>
                <h1>Mudar Ordem das Questões</h1>
                <h6>
                  Nesse espaço, você é capaz de mudar a ordem sequencial de um
                  grupo com gamificação ativa.
                </h6>
              </React.Fragment>
            </div>
          </div>
        </div>
      </section>
      <section className="cosmo-hero">
        <div className="container wrapper">
          <form
            // onSubmit={this.onSubmit}
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
              </div>
            </div>
            <div className="controls">
              <div className="row">
                <div className="col-md-12">
                  <div className="fomr-group">
                    <label htmlFor="input-frmquest-title-group">
                      Questão <strong className="campo-obrigatorio">*</strong>
                    </label>
                    <div
                      id="input-frmquest-course-group"
                      // //   className={
                      // //     !validation.curso.wasValidated
                      // //       ? "input-group"
                      // //       : validation.curso.hasError
                      // //       ? "is-invalid input-group"
                      // //       : "is-valid input-group"
                      //   }
                    >
                      <div className="input-group-prepend">
                        <span className="input-group-text bg-light">
                          <i className="fas fa-globe-americas fle"></i>
                        </span>
                        <select
                          id="select-frmquest-course"
                          // className={
                          //   !validation.curso.wasValidated
                          //     ? "form-control"
                          //     : validation.curso.hasError
                          //     ? "is-invalid form-control"
                          //     : "is-valid form-control"
                          // }
                          name="curso"
                          placeholder="Curso"
                          value={questao}
                          aria-label="Curso"
                          onChange={(e) => {
                            setQuestao(e.target.value);
                          }}
                        >
                          {/* <option value=""> </option> */}
                          {questoes.map((questao) => {
                            return (
                              <option key={questao.id} value={questao.id}>
                                {questao.titulo}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-sm-3">
                  <div className="form-group">
                    <label htmlFor="input-frmquest-course-group">
                      Ordem (valor entre 1 e {questoes.length})
                      <strong className="campo-obrigatorio">*</strong>
                    </label>
                    <div id="input-frmquest-course-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text bg-light">
                          <i className="fas fa-globe-americas"></i>
                        </span>
                        <input
                          onChange={(e) => {
                            setOrdem(e.target.value);
                          }}
                        ></input>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12 text-center register-quest-footer">
                <button
                  id="btn-question-register"
                  type="submit"
                  className="btn btn-cadastrar-color-1"
                  onClick={(e) => {
                    onSubmit(e);
                  }}
                >
                  <i className="fas fa-save"></i> Salvar
                </button>
                <div className="float-right">
                  <button
                    type="button"
                    onClick={() => history.goBack()}
                    className="btn btn-danger cosmo-color-1"
                  >
                    Voltar
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
      {alert[alert.length - 1]}
      <>{alert.length > 0 ? alert[alert.length - 1] : null}</>
    </>
  );
}
