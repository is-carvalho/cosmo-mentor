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

import jwt_decode from 'jwt-decode';
import api from '../services/api';

export default class Answer extends Component {
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
    const questao_id = jwt_decode(this.props.match.params.idQuest);
    this.setState({ questaoId: questao_id });
    let turma_id;

    if (this.props.match.params.idTurma) {
      turma_id = jwt_decode(this.props.match.params.idTurma);
    } else {
      turma_id = 'undefined';
    }

    this.setState({
      id: questao_id,
      turma_id: turma_id,
      loading: true,
    });

    api
      .post('/log/userLog', {
        logMessage: `Usuário ${
          this.state.user_id
        } acessou a questão ${jwt_decode(
          this.props.match.params.idQuest
        )} -  ${new Date(Date.now()).toISOString()}\n`,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
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
        return response.data;
      })
      .then((casosTeste) => {
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

  handleEditorChange(value) {
    this.setState({ content: value });
  }

  handleLanguageChange(event) {
    this.setState({ language: event.target.value });
  }

  handleSubmit(event) {
    if (this.state.user_tipo === 3) {
      event.preventDefault();

      api
        .post('/log/userLog', {
          logMessage: `Usuário ${
            this.state.user_id
          } submeteu para questão ${jwt_decode(
            this.props.match.params.idQuest
          )} -  ${new Date(Date.now()).toISOString()}\n`,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });

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
                  .post('/log/userLog', {
                    logMessage: `Usuário ${
                      this.state.user_id
                    } acertou a questão ${this.state.id} - ${new Date(
                      Date.now()
                    ).toISOString()}\n`,
                  })
                  .then((res) => {
                    console.log(res);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
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
    
    if(this.state.categoria==="Caça-Bugs"){
      return (
        <React.Fragment>
          <Navbar />
          <div className='app-body'>
          <div className='fundo-bg fundo-gray' />
  
          <section
            className={
              this.props.location.state.turma !== null
                ? 'jumbotron text-left question-hero-cacabugs'
                : 'jumbotron text-left question-hero-cacabugs question-info-prof'
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
  
                  {/* {this.props.location.state.turma !== null ?
                    <div className="div-autor">Cadastrada por {this.state.autor}</div>
                    : <h6><p></p></h6>
                  } */}
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
              <form
                className='resp-formulario'
                onSubmit={(e) => this.handleSubmit(e)}
              >
                <div className='row'>


                <div className="col-md-12 question-box">
                <div className="problem">
				<div className="problem-content"  style={{borderRadius:"8px 8px 50px 50px"}}>
					<div className="problem-content-column1">
            <p className="problem-enunciado" align="justify">{this.state.enunciado}</p>
          </div>
					<div className="problem-content-column2">
          </div>
				</div>
			</div>
                </div>

                </div>
                {this.state.user_tipo === 3 ? (
                  <React.Fragment>
                    {/* <div className='row well'>
                      <LanguageList
                        onChange={(value) => {
                          this.handleLanguageChange(value);
                        }}
                        value={this.state.language}
                        disabled={this.state.isProcessing}
                      />
                      <SubmitButton isProcessing={this.state.isProcessing} />
                    </div> */}
  
                    {/* <div className='row'>
                      <CodeEditor
                        codigo={this.state.content}
                        onChange={(value) => {
                          this.handleEditorChange(value);
                          this.updateCodeOnDatabase();
                          this.getUpdatedCode();
                        }}
                        linguagem_id={this.state.language}
                        readOnly={
                          this.state.isProcessing || !this.state.notViewer
                          // this.state.isProcessing
                        }
                      />
                    </div> */}
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
          </div>
          {this.state.alerts.length > 0 ? this.state.alerts[0] : null}
        </React.Fragment>
      );
    } 
    
    else
    {

      return (
        <React.Fragment>
          <Navbar />
          <div className='app-body'>
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

                {/* {this.props.location.state.turma !== null ?
                  <div className="div-autor">Cadastrada por {this.state.autor}</div>
                  : <h6><p></p></h6>
                } */}
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
                      readOnly={this.state.isProcessing}
                    />
                  </div>
                </React.Fragment>
              ) : (
                <div className='text-center'>
                  <button
                    type='button'
                    onClick={() => this.props.history.goBack()}
                    className='btn btn-danger cosmo-color-1'
                  >
                    Voltar
                  </button>
                </div>
              )}
            </form>
          </div>

          <ResultsModal
            id='modalPush'
            type={this.state.tipo_resultado_id}
            value={this.state.resultado}
            isProcessing={this.state.isProcessing}
            questaoId={this.state.questaoId}
          />
        </section>
        </div>
          {this.state.alerts.length > 0 ? this.state.alerts[0] : null}
        </React.Fragment>
      );
              }
  }
}
