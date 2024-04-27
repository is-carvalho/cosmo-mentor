import React, { Component } from "react";
import LikeButton from "../../../../images/like.svg";
import api from "../../../../services/api";
import Alert from "../../Alert";

export default class Modal extends Component {
  constructor() {
    super();
    this.state = {
      alerts: [],
      flagLike: true,
    };
  }
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

  likeQuestion = () => {
    try {
      const question = {
        questaoId: this.props.questaoId,
      };
      // console.log(this.props.questaoId);
      api.put("likeQuestion", question).then((res) => {
        if (res.data.status) {
          console.log("Like efetuado.");
          this.setState({ flagLike: false });
          this.showAlert(
            "Like efetuado com sucesso, obrigado pelo feedback!",
            "success"
          );
        } else {
          this.showAlert("Erro ao efetuar like!", "error");
        }
      });
    } catch (e) {
      this.showAlert("Erro ao efetuar like!", "error");
      console.log(e);
    }
  };

  render() {
    const isProcessing = this.props.isProcessing;
    const value = this.props.value;
    const type = this.props.type;

    let divProcessing = (
      <div key="divProcessing" className="text-center">
        Estamos processando sua requisição. Por favor, aguarde um instante!
        <br />
        <br />
        <span className="spinner-grow" style={{ width: 30, height: 30 }}></span>
        <span className="spinner-grow" style={{ width: 30, height: 30 }}></span>
        <span className="spinner-grow" style={{ width: 30, height: 30 }}></span>
        <br />
      </div>
    );

    let divSuccess = (
      <div key="divSuccess" style={{ display: "flex" }}>
        <i className="fa fa-check text-success" aria-hidden="true"></i> O
        resultado produzido pelo seu código está correto! Parabéns!
        <br />
        {this.state.flagLike === true ? (
          <img
            src={LikeButton}
            onClick={this.likeQuestion}
            style={{
              cursor: "pointer",
              width: "30px",
              height: "30px",
              display: "flex",
              margin: "0 0 0 50px",
            }}
          />
        ) : (
          <></>
        )}
      </div>
    );

    let divSuggestions = (
      <div key="divWarning" style={{ display: "flex" }}>
        <i className="fa fa-exclamation-triangle" aria-hidden="true"></i> O
        seu código está correto! Contudo, ainda pode melhorar. Considere fazer as correções apresentadas!
        <br />
        {this.state.flagLike === true ? (
          <img
            src={LikeButton}
            onClick={this.likeQuestion}
            style={{
              cursor: "pointer",
              width: "30px",
              height: "30px",
              display: "flex",
              margin: "0 0 0 50px",
            }}
          />
        ) : (
          <></>
        )}
      </div>
    );

    let divError = (
      <div key="divError">
        <i className="fa fa-times text-danger" aria-hidden="true"></i> O
        resultado produzido pelo seu código falhou para um ou mais casos de
        teste! Revise seu código e submeta novamente!
        <br />
      </div>
    );

    let divCompilationError = (
      <div key="divWarning">
        <i className="fa fa-code"></i> O código resultou no seguinte erro de
        compilação:
        <br />
        <pre className="text-left">{value}</pre>
      </div>
    );

    let divTimeLimitExceeded = (
      <div key="divWarning">
        <i className="fa fa-clock"></i> O código ultrapassou o tempo limite
        máximo para a questão.
        <br />
        <pre className="text-left">{value}</pre>
      </div>
    );

    let divWarning = (
      <div key="divWarning">
        <i className="fa fa-exclamation-triangle"></i> {value}
        <br />
      </div>
    );

    let result = "";

    if (isProcessing) {
      result = divProcessing;
    } else {
      if (type === 1) {
        result = divSuccess;
      } else if (type === 2) {
        result = divError;
      } else if (type === 3) {
        result = divCompilationError;
      } else if (type === 4) {
        result = divTimeLimitExceeded;
      } else if (type === 5) {
        result = divWarning;
      } else if (type === 6) {
        result = divSuggestions;
      }
    }

    let retorno = (
      <>
        <div
          className="modal fade"
          id={this.props.id}
          tabIndex="-1"
          role="dialog"
          aria-labelledby="modalProcessamento"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalCenterTitle">
                  Resultados do processamento
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">{result}</div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
        {this.state.alerts.length > 0 ? this.state.alerts[0] : null}
      </>
    );

    return <React.Fragment>{retorno}</React.Fragment>;
  }
}
