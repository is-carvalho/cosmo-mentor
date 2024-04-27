import React, { Component, useEffect } from 'react';

import '../css/ViewTheory.css';
import Spinner from './components/Spinner';
import Navbar from './components/Navbar';
import api from '../services/api';
import jwt_decode from 'jwt-decode';
import Alert from './components/Alert';
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-lua';
import 'prismjs/components/prism-java';
import 'prismjs/plugins/toolbar/prism-toolbar.min.css';
import 'prismjs/plugins/toolbar/prism-toolbar.min';
import 'prismjs/plugins/line-numbers/prism-line-numbers.js';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/plugins/show-language/prism-show-language.js';
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.js';

class ViewTheory extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      curso_id: '',
      conceito_id: '',
      conteudo: '',
      exibir_concluir: true,
      turma: '',
      alerts: [],
    };

    this.getUserId = this.getUserId.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.showAlert = this.showAlert.bind(this);
  }

  showAlert(msg, status) {
    let alerts = this.state.alerts;
    alerts.push(
      <Alert
        msg={msg}
        status={status}
        hide={this.closeAlert.bind(this)}
      />
    );
    this.setState({ alerts: alerts });
  }

  closeAlert() {
    let alerts = this.state.alerts;
    alerts.shift();
    this.setState({ alerts: alerts });
  }

  componentDidMount() {
    Prism.highlightAll();

    let idConceito = null;
    if (this.props.match.params.idConceito) {
      idConceito = jwt_decode(this.props.match.params.idConceito);
    }

    let idTurma = null;
    if (this.props.match.params.idTurma) {
      idTurma = jwt_decode(this.props.match.params.idTurma);
    }

    if (idConceito && idTurma) {
      api
        .get(`/theory_manager/${idConceito}/view`)
        .then((response) => {
          return response.data;
        })
        .then((teoria) => {
          this.setState({
            id: teoria.id,
            curso: teoria.curso,
            conceito: teoria.conceito,
            conteudo: teoria.conteudo,
          });
          api
            .post('/log/userLog', {
              logMessage: `Aluno ${this.getUserId()} acessou a página de visualização de teoria id - ${
                teoria.id
              } em ${new Date().toISOString()}\n`,
              userId: this.getUserId(),
            })
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              // console.log(err);
            });

          let id_teoria = this.state.id;
          let id_usuario = this.getUserId();
          api
            .get(
              `/theory_manager/${id_usuario}/${id_teoria}/getReadingCompletionDate`
            )
            .then((response) => {
              return response.data;
            })
            .then((conclusao) => {
              if (conclusao.dt_conclusao) {
                this.setState({
                  exibir_concluir: false,
                });
              }
            })
            .catch((error) => {
              this.showAlert(
                'Ocorreu um erro inesperado. Por favor, entre em contato com o administrador do sistema.',
                'error'
              );
            });
        })
        .catch((err) => {
          this.showAlert(
            'Ocorreu um erro inesperado. Por favor, entre em contato com o administrador do sistema.',
            'error'
          );
        });

      api
        .get(`class/${idTurma}`)
        .then((res) => {
          const turma = res.data;
          this.setState({ turma: turma.nome });
        })
        .catch((err) => {
          this.showAlert(
            'Ocorreu um erro inesperado. Por favor, entre em contato com o administrador do sistema.',
            'error'
          );
        });
    } else {
      this.showAlert(
        'Ocorreu um erro inesperado. Por favor, entre em contato com o administrador do sistema.',
        'error'
      );
    }

    this.setState({
      loading: false,
    });
  }

  componentDidUpdate() {
    Prism.highlightAll();
  }

  getUserId() {
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);

    return decoded.id;
  }

  checkItem() {
    const theory = {
      id_teoria: this.state.id,
      id_usuario: this.getUserId(),
    };

    api
      .post(`/theory_manager/registerReadingCompletion`, theory)
      .then((response) => {
        if (response.data.status) {
          this.setState({ exibir_concluir: false, loading: false });
          this.showAlert('Conteúdo teórico concluído com sucesso.', 'success');
        } else {
          this.setState({ exibir_concluir: true, loading: false });
          this.showAlert(
            'Não foi possível concluir o conteúdo teórico. Por favor, entre em contato com o administrador do sistema.',
            'error'
          );
        }
      })
      .catch((error) => {
        this.setState({ exibir_concluir: true, loading: false });
        this.showAlert(
          'Ocorreu um erro inesperado. Por favor, entre em contato com o administrador do sistema.',
          'error'
        );
      });
  }

  onSubmit(e) {
    e.preventDefault();

    this.setState({ loading: true });

    this.checkItem();

    this.setState({ loading: false });
  }

  render() {
    if (this.state.loading) {
      return <Spinner />;
    }

    let btn_concluir = '';

    if (this.state.exibir_concluir) {
      btn_concluir = (
        <button
          id='btn-question-register'
          type='submit'
          className='btn btn-cadastrar-color-1'
        >
          <i className='fas fa-solid fa-check'></i> Concluir
        </button>
      );
    }

    const retorno = (
      <React.Fragment>
        <div className='fundo-bg fundo-gray' />

        <section className='jumbotron text-left item-hero'>
          <div className='container'>
            <div className='row'>
              <div className='col'>
                <h6>
                  <button
                    type='button'
                    onClick={() => this.props.history.go(-2)}
                    className='link'
                  >
                    {this.state.curso}
                  </button>{' '}
                  /{' '}
                  <button
                    type='button'
                    onClick={() => this.props.history.go(-1)}
                    className='link'
                  >
                    {this.state.turma}
                  </button>{' '}
                  /{' '}
                  <button
                    type='button'
                    onClick={() => this.props.history.goBack()}
                    className='link'
                  >
                    Conteúdo Teórico
                  </button>
                </h6>

                <h1>{this.state.conceito}</h1>

                <h6>
                  Ao concluir a leitura, você ganhará{' '}
                  {this.state.xp > 1
                    ? this.state.xp + ' pontos'
                    : this.state.xp + ' ponto'}{' '}
                  de experiência.
                </h6>
              </div>
            </div>
          </div>
        </section>

        <section className='cosmo-hero'>
          <div className='container wrapper'>
            <form
              onSubmit={this.onSubmit}
              className='form-question'
              encType='multipart/form-data'
              noValidate
            >
              <div className='row'>
                <div className='col-md-12'>
                  <section
                    dangerouslySetInnerHTML={{ __html: this.state.conteudo }}
                  />
                </div>
              </div>

              <div className='row'>
                <div className='col-md-12 text-center register-quest-footer'>
                  <div className='float-right'>
                    {btn_concluir}

                    <button
                      type='button'
                      onClick={() => this.props.history.goBack()}
                      className='btn btn-danger cosmo-color-1'
                    >
                      Voltar
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </section>
      </React.Fragment>
    );

    return (
      <React.Fragment>
        <Navbar />
        <div className='app-body'>{retorno}</div>
        {this.state.alerts.length > 0 ? this.state.alerts[0] : null}
      </React.Fragment>
    );
  }
}
export default ViewTheory;