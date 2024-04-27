import React, { Component } from 'react';
import '../css/ResolucaoProblema.css';
import Navbar from './components/Navbar';
import Spinner from './components/Spinner';
import QuestionInformation from './components/Answer/Question/Information';
import CodeEditor from './components/Answer/Code/Editor';
import LanguageList from './components/Answer/Language/List';
import SubmitButton from './components/Answer/Submit/Button';
import ResultsModal from './components/Answer/Results/Modal';
import Alert from './components/Alert';
import GoBackButton from './components/BotaoVoltar';

import _ from 'lodash';
import jwt_decode from 'jwt-decode';
import api from '../services/api';

export default class AnswerDojo extends Component {
  constructor() {
    super();
    let dataUser = this.getUserData();
    this.state = {
      user_id: dataUser.id,
      user_tipo: dataUser.tipo,
      linguagem_id: 0,
      content: '',
      alerts: [],
      processing: false,
      loading: true,
      questaoId: 0,
      notViewer: true,
      hasStarted: false,
      copilotoTime: 0,
      usersQueued: [],
      pilotoTime: 5,
      lastCalledTime: 0,
      // this.state.turma_id: this.props.location.state.turma_id,
      // turma_id: this.props.location.state.turma_id,
      // dojoId: this.props.history.location.state.dojoId,
    };
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
    try {
      api
        .get(`/findUsersInDojo/${this.props.history.location.state.dojoId}`)
        .then((res) => {
          // console.log(res, 'users in queue');
          this.setState({
            usersQueued: res.data,
            // piloto: res.data[0],
          });
          //remote
          this.showAlert(
            `O primeiro piloto será ${res.data[0].nome}`,
            'success'
          );
        });
    } catch (e) {
      console.log(e);
    }

    try {
      this.setState({
        notViewer:
          this.props.history.location.state.piloto === this.state.user_id,
        piloto: this.props.history.location.state.piloto,
      });
    } catch (e) {
      // console.log(this.props.history);

      console.log(e);
    }
    // console.log(this.state);

    const questao_id = jwt_decode(this.props.match.params.idQuest);
    this.setState({ questaoId: questao_id });
    let turma_id;

    if (this.props.match.params.idTurma) {
      turma_id = jwt_decode(this.props.match.params.idTurma);
    } else {
      turma_id = 'undefined';
    }
    console.log(turma_id);

    this.setState({
      id: questao_id,
      turma_id: turma_id,
      loading: true,
    });

    api
      .get(`/question/${questao_id}`)
      .then((response) => {
        return response.data;
      })
      .then((questao) => {
        this.setState({
          id: questao_id,
          turma_id: turma_id,
          titulo: questao.titulo,
          enunciado: questao.enunciado,
          descricao_entrada: questao.descricao_entrada,
          descricao_saida: questao.descricao_saida,
          observacao: questao.observacao,
          autor: questao.autor,
          categoria: questao.categoria,
          moedas: questao.moedas,
          custo: questao.custo,
          xp: questao.xp,
          dificuldade: questao.dificuldade,
          limite_tempo: questao.limite_tempo,
          data_criacao: questao.data_criacao,
        });
      });

    api
      .get('testCasesFromQuestion', {
        headers: {
          question: questao_id,
        },
      })
      .then((response) => {
        console.log(response);
        return response.data;
      })
      .then((casosTeste) => {
        console.log('Casos de teste', casosTeste);
        this.setState({
          entradas: casosTeste.entradas,
          saidas: casosTeste.saidas,
          loading: false,
        });
      })
      .catch((err) => {
        this.showAlert('Erro ao carregadar todos os casos de teste', 'error');
      });
  }

  getUpdatedCode = () => {
    try {
      api
        .get(`/coding-dojo/${this.props.history.location.state.dojoId}`)
        .then((response) => {
          // setCodigo(response.data.data[0].codigo);
          this.setState({ content: response.data.data[0].codigo });
          // console.log(response.data.data[0].codigo);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (e) {
      console.log(e);
    }
  };

  updateCodeOnDatabase = () => {
    // verify if codigo is string
    try {
      let codigo = this.state.content;
      console.log();
      if (codigo !== undefined) {
        codigo < 1 ? (codigo = ' ') : console.log(''); // caso seja palavra vazia, o update vai ter null somente
        api
          .put(`/coding-dojo/${this.props.history.location.state.dojoId}`, {
            codigo: codigo,
          })
          .then((response) => {
            // console.log(response);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } catch (e) {
      console.log(e);
    }
  };

  componentDidUpdate() {
    if (!this.state.notViewer) {
      this.getUpdatedCode();
    } else {
      this.updateCodeOnDatabase();
    }

    // every 5 minutes, change the piloto to copiloto, and the next on the queue became the copiloto
    // when the time is up, the copiloto becomes the piloto
    // and the piloto becomes the copiloto
    // and display it on the screen
    // verify if the user is the piloto or copiloto
    // if the user is not one of them, he can't edit the code and can't submit
    // if the user is the piloto, he can edit the code and submit
    // if the user is the copiloto, he can't edit the code, but can submit and see
    // show the current piloto, the next on the queue, and the current copiloto

    // setTimeout(() => {
    //   // i wanna use the state of usersQueued to in a interval of 5 minutes, the copiloto will be the next user in the queue, and the first in the queue is the piloto
    //   // and the piloto will be the copiloto
    //   // and the copiloto will be the next in the queue

    //   // const piloto = this.state.piloto - 1;

    //   const firstOfQueue = this.state.usersQueued[0];
    //   //remove of queue the first
    //   this.state.usersQueued.shift();
    //   //add the first to the end of the queue
    //   this.state.usersQueued.push(firstOfQueue);

    //   api
    //     .patch(`/updatePiloto/`, {
    //       dojoId: this.props.history.location.state.dojoId,
    //       userId: firstOfQueue.user_id,
    //     })
    //     .then((res) => {
    //       console.log(res);
    //       this.showAlert(
    //         `O piloto foi alterado para ${firstOfQueue.nome}
    //       `,
    //         'success'
    //       );
    //       this.setState({ piloto: firstOfQueue });
    //       window.location.reload();
    //     });
    // }, 30000);
    // }, 300000);

    // this.getUpdatedCode();
  }
  handleEditorChange(value) {
    this.setState({ content: value });
  }

  handleLanguageChange(event) {
    this.setState({ language: event.target.value });
  }

  handleSubmit(event) {
    if (this.state.user_tipo === 3) {
      event.preventDefault();

      this.setState({
        isProcessing: true,
        tipo_resultado_id: null,
        resultado: null,
      });

      const questao = {
        code: this.state.content,
        language: this.state.language,
        in: this.state.entradas,
        out: this.state.saidas,
      };

      api
        .post('processAnswer', questao)
        .then((response) => {
          return response.data;
        })
        .then((response) => {
          let processamento = {
            tempo_inicial: response.tempo_inicial,
            tempo_final: response.tempo_final,
            resultado: response.resultado,
            tipo_resultado_id: response.tipo_resultado,
          };

          this.setState({
            tipo_resultado_id: processamento.tipo_resultado_id,
            resultado: processamento.resultado,
          });

          return processamento;
        })
        .then((processamento) => {
          const data = {
            code: questao.code,
            language: questao.language,
            startTime: processamento.tempo_inicial,
            finalTime: processamento.tempo_final,
            result: processamento.resultado,
            resultType: processamento.tipo_resultado_id,
          };

          api
            .post(
              `answer/${this.state.user_id}/${this.state.id}/${this.state.turma_id}`,
              data
            )
            .then((response) => {
              if (response.data.status && data.resultType === 1) {
                api
                  .get(
                    `checkAnswerUnique/${this.state.user_id}/${this.state.id}`
                  )
                  .then((response2) => {
                    //console.log(response2)
                    if (response2.data.status) {
                      api
                        .put(`userAfterCorrectAnswer/${this.state.user_id}`, {
                          value: this.state.xp,
                        })
                        .then((response3) => {
                          if (response3.data.status) {
                            this.showAlert(
                              `Você ganhou +${this.state.xp} pontos de experiência!`,
                              'success'
                            );
                          } else
                            console.log(
                              'Erro ao atualizar pontos de experiencia'
                            );
                        })
                        .catch((erro) => {
                          console.log(
                            'Erro ao atualizar pontos de experiencia'
                          );
                        });
                    }
                  })
                  .catch((error) => {
                    console.log('Erro ao checar resposta');
                  });
              }
            })
            .catch((error) => {
              if (
                error.response.data &&
                error.response.data.statusCode === 400
              ) {
                this.setState({
                  tipo_resultado_id: 5,
                  resultado: error.response.data.message,
                });
              }
            });
        })
        .catch((error) => {
          if (error.response.data && error.response.data.statusCode === 400) {
            this.setState({
              tipo_resultado_id: 5,
              resultado: error.response.data.message,
            });
          }
        })
        .finally(() => {
          this.setState({ isProcessing: false });
        });
    }
  }

  getUserData() {
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);
    //console.log(decoded)
    return {
      id: decoded.id,
      tipo: decoded.tipo,
    };
  }

  render() {
    //console.log(this)
    if (this.state.loading) {
      return <Spinner />;
    }

    const retorno = (
      <React.Fragment>
        <div className='fundo-bg fundo-gray' />

        <section
          className={
            this.props.location.state.turma !== null
              ? 'jumbotron text-left question-hero'
              : 'jumbotron text-left question-hero question-info-prof'
          }
        >
          <div className='container'>
            <div className='row'>
              <div className='col'>
                {this.props.location.state.turma !== null ? (
                  <h6>
                    <button
                      type='button'
                      onClick={() => this.props.history.go(-2)}
                      className='link'
                    >
                      {this.props.location.state.turma}
                    </button>{' '}
                    /{' '}
                    <button
                      type='button'
                      onClick={() => this.props.history.goBack()}
                      className='link'
                    >
                      Minhas Atividades
                    </button>
                  </h6>
                ) : (
                  ''
                )}
                <h1>{this.state.titulo}</h1>
                <h6>
                  Ao acertar, você ganhará{' '}
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
            <div className='col-12'>
              <div
                className='alert alert-warning'
                role='alert'
              >
                <h4 className='alert-heading'>Atenção!</h4>
                <p>
                  Você está no período de teste para ser um copiloto. Você terá{' '}
                  {this.state.pilotoTime} minutos para avaliar as respostas do
                  piloto. Após esse período, você será promovido ao cargo de
                  pilotos.
                </p>
              </div>
            </div>
            <form
              className='resp-formulario'
              onSubmit={(e) => this.handleSubmit(e)}
            >
              <div className='row'>
                <QuestionInformation
                  turma_id={this.state.turma_id}
                  questao_id={this.state.id}
                />
              </div>

              {this.state.user_tipo === 3 ? (
                <React.Fragment>
                  <div className='row well'>
                    <LanguageList
                      onChange={(value) => {
                        this.handleLanguageChange(value);
                      }}
                      value={this.state.language}
                      disabled={this.state.isProcessing}
                    />
                    <SubmitButton isProcessing={this.state.isProcessing} />
                  </div>

                  <div className='row'>
                    <CodeEditor
                      codigo={this.state.content}
                      onChange={(value) => {
                        this.handleEditorChange(value);
                      }}
                      linguagem_id={this.state.language}
                      readOnly={
                        this.state.isProcessing ||
                        !(this.state.user_id === this.state.piloto) // se nao for piloto
                        // this.state.isProcessing
                      }
                    />
                  </div>
                </React.Fragment>
              ) : (
                <></>
              )}
            </form>
            <div style={{ marginTop: '2vh' }}>
              <GoBackButton />
            </div>
          </div>
          <ResultsModal
            id='modalPush'
            type={this.state.tipo_resultado_id}
            value={this.state.resultado}
            isProcessing={this.state.isProcessing}
            questaoId={this.state.questaoId}
          />
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
