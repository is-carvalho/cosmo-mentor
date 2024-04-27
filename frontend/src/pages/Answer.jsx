import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../css/ResolucaoProblema.css';
import Navbar from './components/Navbar';
import Spinner from './components/Spinner';
import QuestionInformation from './components/Answer/Question/Information';
import CodeEditor from './components/Answer/Code/Editor';
import LanguageList from './components/Answer/Language/List';
import SubmitButton from './components/Answer/Submit/Button';
import ResultsModal from './components/Answer/Results/Modal';
import GoBackButton from './components/BotaoVoltar';
import '../css/Question.css';
import Alert from './components/Alert.jsx';
import { Conquista } from './components/Conquista.jsx';
import { getNivel } from './components/Nivel.jsx';

import useWebSocket from 'react-use-websocket';
import { ToastProvider, useToasts } from 'react-toast-notifications';

import jwt_decode from 'jwt-decode';
import api from '../services/api';

import axios from 'axios';
import { funcaoJuizEstiloCacabugs } from './QuestoesEstiloCacabugsScripts';

function getUserId() {
  const token = localStorage.usertoken;
  const decoded = jwt_decode(token);
  return decoded.id;
}

export default function Answer(Props) {
  const getUserData = () => {
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);

    return {
      id: decoded.id,
      tipo: decoded.tipo,
    };
  };

  const { addToast } = useToasts();

  const [dataUser, setDataUser] = useState(getUserData());

  const [updateStat, setUpdateStat] = useState(false);

  const location = useLocation();
  const [id, setId] = useState(0);
  const [turmaId, setTurmaId] = useState(null);
  const [userId, setUserId] = useState(getUserId());
  const [user_tipo, setUser_tipo] = useState(dataUser.tipo);
  const [linguagem_id, setLinguagem_id] = useState(0);
  const [content, setContent] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [questaoId, setQuestaoId] = useState(null);
  const [notViewer, setNotViewer] = useState(true);
  const [codigo, setCodigo] = useState('');
  const [apiSuggestions, setApiSuggestions] = useState([]);
  const [solucaoReferencia, setSolucaoReferencia] = useState([]);
  const [descricaoEntrada, setDescricaoEntrada] = useState('');
  const [descricaoSaida, setDescricaoSaida] = useState('');
  const [descricao, setDescricao] = useState('');
  const [titulo, setTitulo] = useState('');
  const [pontuacao, setPontuacao] = useState(0);
  const [tempoLimite, setTempoLimite] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [results, setResults] = useState({
    status: '',
    message: '',
    input: '',
    output: '',
    expectedOutput: '',
    time: '',
  });
  const [xp, setXp] = useState(0);
  const [enunciado, setEnunciado] = useState('');
  const [observacao, setObservacao] = useState('');
  const [autor, setAutor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [moedas, setMoedas] = useState(0);
  const [custo, setCusto] = useState(0);
  const [dificuldade, setDificuldade] = useState(0);
  const [limiteTempo, setLimiteTempo] = useState(0);
  const [dataCriacao, setDataCriacao] = useState(0);
  const [state, setState] = useState({
    notViewer: true,
  });
  const [questao, setQuestao] = useState({
    id: 0,
    titulo: '',
    enunciado: '',
    observacao: '',
    autor: '',
    categoria: '',
    moedas: 0,
    custo: 0,
    dificuldade: 0,
    limiteTempo: 0,
    dataCriacao: 0,
    xp: 0,
    entradas: 0,
    saidas: 0,
  });
  const [userTipo, setUserTipo] = useState(0);
  const [tipoResultadoId, setTipoResultadoId] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultado, setResultado] = useState({
    id: 0,
    questao_id: 0,
    user_id: 0,
    linguagem_id: 0,
    codigo: '',
    pontuacao: 0,
    tempo: 0,
    tipoResultado_id: 0,
    dataCriacao: 0,
  });
  const [resultadoId, setResultadoId] = useState(0);
  const [linguagemId, setLinguagemId] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [nomeTurma, setNomeTurma] = useState('');
  const [emotions, setEmotions] = useState([]);
  const [currentEmotion, setCurrentEmotion] = useState('');

  const [questaoCacabugs, setQuestaoCacabugs] = useState({
    // id:0,
    // curso_id:0,
    // dificuldade_id:0,
    // conceito_id:0,
    // titulo:"",
    // enunciado:"",
    id: 0,
    codigocerto: '',
    codigoerrado: '',
    codigopython: '',
    codigoc: '',
    codigolua: '',
    entradas: '',
    // moedas:"",
    // xp:"",
  });
  const [linguagemCacabugs, setLinguagemCacabugs] = useState('python');

  const apiUrl = 'http://200.137.132.247:3030/processImage';

  const showAlert = (msg, status) => {
    /*alerts.push(
      <Alert
        msg={msg}
        status={status}
        hide={closeAlert()}
      />
    );
    setAlerts(alerts);*/
    addToast(msg, { appearance: status, autoDismiss: true });
  };

  const { lastJsonMessage, sendMessage } = useWebSocket(
    'wss://cosmo.telemidia-ma.com.br/ws/',
    {
      onOpen: () => {
        /*console.log(`Connected to App WS (Answer.jsx)`)*/
      },
      onMessage: (message) => {
        const msg = JSON.parse(message.data);
        const data = msg.data;

        switch (msg.action) {
          case 'showAlert':
            showAlert(data.alertMsg, data.alertStatus);
            break;
        }
      },
      queryParams: { page: 'answer' },
      onError: (event) => {
        console.error(event);
      },
      shouldReconnect: (closeEvent) => true,
      reconnectInterval: 3000,
    }
  );

  /*const closeAlert = () => {
    alerts.shift();
    setAlerts(alerts);
  };*/

  useEffect(() => {
    // ATUALIZAÇÃO DO STAT
    if (updateStat) {
      api
        .put(`/updateStat/${dataUser.id}`, {
          nomeStat: 'nivel_atual',
          valorStat: dataUser.titulo_id,
        })
        .then((response) => {
          if (response.data.status) {
            // VERIFICAÇÃO DO 'nivel_atual'
            sendMessage(
              JSON.stringify({
                data: {
                  statValue: dataUser.titulo_id,
                  statName: 'nivel_atual',
                },
                fromComponent: 'answer',
                toComponent: 'conquista', // Componente Destino
                action: 'setStat',
              })
            );
          }
        });

      setUpdateStat(false);
    }
  }, [dataUser]);

  useEffect(() => {
    if (questao !== undefined) {
      try {
        setNotViewer(location.state.piloto === userId);
      } catch (e) {
        setState({
          notViewer: true,
        });
        console.log(e);
      }

      const questao_id = jwt_decode(Props.match.params.idQuest);
      setQuestaoId(questao_id);
      let turma_id;

      if (Props.match.params.idTurma) {
        turma_id = jwt_decode(Props.match.params.idTurma);
      } else {
        turma_id = 'undefined';
      }

      setId(questao_id);
      setTurmaId(turma_id);
      setLoading(true);
      if (location.state) setNomeTurma(location.state.turma);

      const questaoid = jwt_decode(Props.match.params.idQuest);
      setQuestaoId(questaoid);

      api.get(`/user/${dataUser.id}`).then((response) => {
        setDataUser({
          id: response.data.id,
          tipo: response.data.tipo,
          titulo_id: response.data.titulo_id,
          xp: response.data.xp,
        });
      });

      api
        .get(`/question/${questaoid}`)
        .then((response) => {
          // console.log(response.data);
          setQuestao({
            id: response.data.id,
            titulo: response.data.titulo,
            enunciado: response.data.enunciado,
            solucao_referencia: response.data.solucao_referencia,
            observacao: response.data.observacao,
            autor: response.data.autor,
            categoria: response.data.categoria,
            categoria_id: response.data.categoria_id,
            moedas: response.data.moedas,
            custo: response.data.custo,
            dificuldade: response.data.dificuldade,
            limiteTempo: response.data.limiteTempo,
            dataCriacao: response.data.dataCriacao,
            xp: response.data.xp,
          });

          // setXp(response.data.xp)

          api
            .post('/log/userLog', {
              logMessage: `Usuario: ${userId} acessou a questão ${questaoid}. ${new Date(
                Date.now()
              ).toISOString()}\n`,
              userId: response.data.data,
            })
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              // console.log(err);
            });

          return response.data;
        })
        .then((questao) => {
          // console.log(questao, 'questao');
          setLinguagem_id(questao.linguagem_id);
          setContent(questao.codigo);
          setDescricaoEntrada(questao.descricao_entrada);
          setDescricaoSaida(questao.descricao_saida);
          setDescricao(questao.descricao);
          setTitulo(questao.titulo);
          setPontuacao(questao.pontuacao);
          setTempoLimite(questao.tempo_limite);
          setEnunciado(questao.enunciado);
          setSolucaoReferencia(questao.solucao_referencia);
          setObservacao(questao.observacao);
          setAutor(questao.autor);
          setCategoria(questao.categoria);
          setMoedas(questao.moedas);
          setDificuldade(questao.dificuldade);
          setLimiteTempo(questao.limite_tempo);
          setDataCriacao(questao.data_criacao);
        });

      api
        .get('/testCasesFromQuestion', {
          headers: {
            question: questao_id,
          },
        })
        .then((response) => {
          return response.data;
        })
        .then((casosTeste) => {
          const questaoUpdate = {
            entradas: casosTeste.entradas,
            saidas: casosTeste.saidas,
          };

          setQuestao((questao) => ({
            ...questao,
            ...questaoUpdate,
            // loading: false,
          }));
        })
        .catch((err) => {
          showAlert(
            'Erro ao carregadar todos os casos de teste --> ' + err,
            'error'
          );
        });

      /*api
        .get(`/questaoTipoCacabugs/${questaoid}`)
        .then((response) => {
          console.log(response.data);
          setQuestaoCacabugs({
            // id: response.data.id,
            // curso_id: response.data.curso_id,
            // dificuldade_id: response.data.dificuldade_id,
            // categoria_id: response.data.categoria_id,
            // conceito_id: response.data.conceito_id,
            // titulo: response.data.titulo,
            // enunciado: response.data.enunciado,
            // moedas: response.data.moedas,
            // custo: response.data.custo,
            // xp: response.data.xp,
            // limiteTempo: response.data.limite_tempo,
            // resumo: response.data.resumo,
            id:response.data.id,
            // questao_id: response.data.questao_id,
            codigocerto: response.data.codigocerto,
            codigoerrado: response.data.codigoerrado,
            codigopython: response.data.codigopython,
            codigoc: response.data.codigoc,
            codigolua: response.data.codigolua,
            entradas: response.data.entradas,
          });
        })
        .catch((err)=>{
          console.log(err);
        })*/
    }
  }, []);

  useEffect(() => {
    const questaoid = jwt_decode(Props.match.params.idQuest);
    api
      .post('/log/userLog', {
        logMessage: `Usuario: ${userId} comecou a escrever a questão ${questaoid}. ${new Date(
          Date.now()
        ).toISOString()}\n`,
        userId: userId,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        // console.log(err);
      });
  }, [hasStarted]);

  const handleEditorChange = (value) => {
    setCodigo(value);
  };

  const handleLanguageChange = (event) => {
    setLinguagemId(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    /*capture();

    console.log(
      'As emoções predominantes durante essa questão foram: ',
      emotions
    );
    // sort emotions
    emotions.sort((a, b) => {
      return b.value - a.value;
    });
    // get the top 3 emotions
    emotions = emotions.slice(0, 3);
    // get the emotion names
    emotions = emotions.map((emotion) => {
      return emotion.emotion;
    });
    // join the emotions
    emotions = emotions.join(', ');
    console.log(emotions);*/

    api
      .post('/log/userLog', {
        logMessage: `Usuario: ${userId} enviou a questão ${questaoId} e suas emoções predominantes foram: ${emotions}. ${new Date(
          Date.now()
        ).toISOString()}\n`,
        userId: userId,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    if (user_tipo === 3) {
      event.preventDefault();

      setIsProcessing(true);
      setTipoResultadoId(null);
      setResultado(null);

      const quest = {
        code: codigo,
        language: linguagemId,
        in: questao.entradas,
        out: questao.saidas,
      };

      api
        .post('/processAnswer', quest)
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

          setTipoResultadoId(processamento.tipo_resultado_id);
          setResultado(processamento.resultado);

          api.post('/log/userLog', {
            logMessage: `Usuario: ${userId} enviou a questão ${questaoId} e teve resultado ${
              processamento.resultado
            }
            . ${new Date(Date.now()).toISOString()}\n`,
            userId: userId,
          });

          return processamento;
        })
        .then((processamento) => {

          if (processamento.tipo_resultado_id === 1){

              const API_URL = "http://200.137.132.247/api/suggestions/"
              const PAYLOAD = {
                codigo: codigo,
                aluno: String(userId),
                questao_desc: enunciado + " " + descricaoEntrada + " " + descricaoSaida,
                language: "python",
                questao: titulo,
                solucao: solucaoReferencia
              }

              console.log(PAYLOAD.questao_desc)
              axios.post(API_URL, PAYLOAD)
              .then(apiResponse => {
                setApiSuggestions(apiResponse.data.suggestions)
                if (apiResponse.data.code == "success"){
                  if (apiResponse.data.suggestions.variaveis.length > 0 ||
                      apiResponse.data.suggestions.complexidade.length > 0 ||
                      apiResponse.data.suggestions.refatoracao.length > 0){
                        setTipoResultadoId(6)
                      }
                }
              })
              .catch((error) => {
                console.error('Erro na chamada à API externa de Qualidade de Código:', error);
              })
              
          }
          const data = {
            code: quest.code,
            suggestions: JSON.stringify(apiSuggestions),
            language: quest.language,
            startTime: processamento.tempo_inicial,
            finalTime: processamento.tempo_final,
            result: processamento.resultado,
            resultType: processamento.tipo_resultado_id,
          };

          api
            .post(`answer/${userId}/${id}/${turmaId}`, data)
            .then((response) => {
              if (response.data.status && data.resultType === 1) {
                api
                  .get(`checkAnswerUnique/${userId}/${id}`)
                  .then((response2) => {
                    if (response2.data.status) {
                      api
                        .put(`userAfterCorrectAnswer/${userId}`, {
                          value: questao.xp,
                        })
                        .then((response3) => {
                          if (response3.data.status) {
                            const lvlUser = getNivel(dataUser.xp + questao.xp)[3]
                            api
                              .put(`/title`, {
                                user: userId,
                                titleId: /*dataUser.titulo_id*/lvlUser,
                              })
                              .then((res) => {
                                if (res.data.status) {
                                  api
                                    .get(`/user/${dataUser.id}`)
                                    .then((res2) => {
                                      // console.log(res2.data)

                                      setDataUser({
                                        id: res2.data.id,
                                        tipo: res2.data.tipo,
                                        titulo_id: res2.data.titulo_id,
                                        xp: res2.data.xp,
                                      });
                                    });

                                  setUpdateStat(true);
                                }
                              });

                            sendMessage(
                              JSON.stringify({
                                data: {
                                  fromComponent: 'answer',
                                  xp: questao.xp,
                                },
                                fromComponent: 'answer',
                                toComponent: 'nivel', // Componente Destino
                                action: 'submitAnswer',
                              })
                            );

                            showAlert(
                              `Você ganhou +${questao.xp} pontos de experiência!`,
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
                setTipoResultadoId(5);
                setResultado(error.response.data.message);
              }
            });
        })
        .catch((error) => {
          if (error.response.data && error.response.data.statusCode === 400) {
            setTipoResultadoId(5);
            setResultado(error.response.data.message);
          }
        })
        .finally(() => {
          setIsProcessing(false);
        });
    }
  };

  if (questao.id === 4) {
    const tempoInicial = new Date();

    function listaRespostas() {
      const listaNomesInputs = [];
      const arrayInputs = questaoCacabugs.entradas?.split(',') || [];
      var stringRespostas = '';
      const nomesInputs = arrayInputs.map((element, index) => {
        listaNomesInputs.push(`${element}`);
      });
      var count = 0;
      for (var i in listaNomesInputs) {
        count += 1;
        stringRespostas += `${listaNomesInputs[i]}:${
          document.getElementById(`txt${listaNomesInputs[i]}`).value
        }`;
        if (count < listaNomesInputs.length) {
          stringRespostas += ',';
        }
      }
      return stringRespostas;
    }

    function enviarDadosQuestao() {
      const tempoFinal = new Date();
      var idLinguagemCacabugs = null;
      if (linguagemCacabugs === 'lua') {
        idLinguagemCacabugs = 4;
      } else if (linguagemCacabugs === 'c') {
        idLinguagemCacabugs = 1;
      } else if (linguagemCacabugs === 'python') {
        idLinguagemCacabugs = 5;
      }
      const body = {
        userId: getUserId(),
        questionId: questaoId,
        language: idLinguagemCacabugs,
        result: listaRespostas(),
        resultType: funcaoJuizEstiloCacabugs(questaoCacabugs.id),
        tempoInicial: tempoInicial,
        tempoFinal: tempoFinal,
      };
      console.log(body);
      api
        .post(`/submitQuestaoEstiloCacabugs`, body)
        .then((res) => res.data)
        .then((loadquestoes) => {
          // if (loadquestoes.length > 0) {
          //   setQuestao(loadquestoes[0]);
          //   console.log(loadquestoes[0]);
          // }
          console.log(loadquestoes);
        });
    }
    const arrayInputs = questaoCacabugs.entradas?.split(',') || [];
    const inputs = arrayInputs.map((element, index) => {
      return (
        <div
          key={`input-${index + 1}`}
          className='divinput'
        >
          <p className='texto'>{element}</p>
          <input
            onChange={(e) => (e.target.style = '')}
            id={`txt${element}`}
            className='input'
          />
        </div>
      );
    });
    // console.log(arrayInputs);
    // console.log(inputs);
    return (
      <>
        {loading ? <Spinner /> : <></>}

        <>
          <Navbar />
          <Conquista />
          <div className='app-body'>
            <div className='fundo-bg fundo-gray' />
            {/* i wanna display none */}

            {/* <button
            onClick={capture}
            className='btn btn-primary  center'
          >
            Capture
          </button> */}
            <section
              className={
                nomeTurma !== null
                  ? 'jumbotron text-left question-hero-cacabugs'
                  : 'jumbotron text-left question-hero-cacabugs question-info-prof'
              }
            >
              <div className='container'>
                <div className='row'>
                  <div className='col'>
                    {nomeTurma !== null ? (
                      <h6>
                        <button
                          type='button'
                          onClick={() => Props.history.go(-2)}
                          className='link'
                        >
                          {nomeTurma}
                        </button>{' '}
                        /{' '}
                        <button
                          type='button'
                          onClick={() => Props.history.goBack()}
                          className='link'
                        >
                          Minhas Atividades
                        </button>
                      </h6>
                    ) : (
                      ''
                    )}
                    <h1>{titulo}</h1>

                    {/* {questao.location.state.turma !== null ?
                  <div className="div-autor">Cadastrada por {this.state.autor}</div>
                  : <h6><p></p></h6>
                } */}
                    <h6>
                      Ao acertar, você ganhará{' '}
                      {questao.xp > 1
                        ? questao.xp + ' pontos'
                        : questao.xp + ' ponto'}{' '}
                      de experiência.
                    </h6>
                  </div>
                </div>
              </div>
            </section>

            <section className='cosmo-hero'>
              <div className='container wrapper'>
                {/* <form
                className='resp-formulario'
                onSubmit={(e) => handleSubmit(e)}
              > */}
                <div className='row'>
                  {turmaId !== null && questaoId !== null ? (
                    <div className='problem'>
                      <div className='problem-content'>
                        <div className='problem-content-column1'>
                          <p
                            className='problem-enunciado'
                            align='justify'
                          >
                            {questao.enunciado}
                          </p>

                          <div>
                            <button
                              id='botaopython'
                              className={`buttonTab ${
                                linguagemCacabugs === 'python' ? 'ativo' : ''
                              }`}
                              onClick={() => setLinguagemCacabugs('python')}
                            >
                              Python
                            </button>
                            <button
                              id='botaoc'
                              className={`buttonTab ${
                                linguagemCacabugs === 'c' ? 'ativo' : ''
                              }`}
                              onClick={() => setLinguagemCacabugs('c')}
                            >
                              C
                            </button>
                            <button
                              id='botaolua'
                              className={`buttonTab ${
                                linguagemCacabugs === 'lua' ? 'ativo' : ''
                              }`}
                              onClick={() => setLinguagemCacabugs('lua')}
                            >
                              Lua
                            </button>
                          </div>
                          <div className='code'>
                            {linguagemCacabugs === 'lua'
                              ? questaoCacabugs.codigolua
                              : linguagemCacabugs === 'c'
                              ? questaoCacabugs.codigoc
                              : questaoCacabugs.codigopython}
                          </div>
                        </div>
                        <div className='problem-content-column2'>
                          <div className='inputebotao'>
                            {inputs}
                            <button
                              onClick={() => enviarDadosQuestao()}
                              className='botao'
                            >
                              Enviar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                {/* </form> */}
                <div style={{ marginTop: '2vh' }}>
                  <GoBackButton />
                </div>
              </div>
              <ResultsModal
                id='modalPush'
                type={tipoResultadoId}
                value={resultado}
                isProcessing={isProcessing}
                questaoId={questaoId}
              />
            </section>
          </div>
          {/* {alerts.length > 0 ? alerts[0] : null} */}
        </>
      </>
    );
  }

  return (
    <>
      {loading ? <Spinner /> : <></>}

      <>
        <Navbar />
        <Conquista />
        <div className='app-body'>
          <div className='fundo-bg fundo-gray' />
          {/* i wanna display none */}

          {/* <button
            onClick={capture}
            className='btn btn-primary  center'
          >
            Capture
          </button> */}
          <section
            className={
              nomeTurma !== null
                ? 'jumbotron text-left question-hero'
                : 'jumbotron text-left question-hero question-info-prof'
            }
          >
            <div className='container'>
              <div className='row'>
                <div className='col'>
                  {nomeTurma !== null ? (
                    <h6>
                      <button
                        type='button'
                        onClick={() => Props.history.go(-2)}
                        className='link'
                      >
                        {nomeTurma}
                      </button>{' '}
                      /{' '}
                      <button
                        type='button'
                        onClick={() => Props.history.goBack()}
                        className='link'
                      >
                        Minhas Atividades
                      </button>
                    </h6>
                  ) : (
                    ''
                  )}
                  <h1>{titulo}</h1>

                  {/* {this.props.location.state.turma !== null ?
                  <div className="div-autor">Cadastrada por {this.state.autor}</div>
                  : <h6><p></p></h6>
                } */}
                  <h6>
                    Ao acertar, você ganhará{' '}
                    {questao.xp > 1
                      ? questao.xp + ' pontos'
                      : questao.xp + ' ponto'}{' '}
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
                onSubmit={handleSubmit}
              >
                <div className='row'>
                  {turmaId !== null && questaoId !== null ? (
                    <QuestionInformation
                      turma_id={turmaId}
                      questao_id={questaoId}
                    />
                  ) : (
                    <></>
                  )}
                </div>
                <React.Fragment>
                  <div className='row well'>
                    <LanguageList
                      onChange={(value) => {
                        handleLanguageChange(value);
                      }}
                      value={linguagemId}
                      disabled={isProcessing}
                    />
                    <SubmitButton isProcessing={isProcessing} />
                  </div>

                  <div className='row'>
                    <CodeEditor
                      codigo={codigo}
                      onChange={(value) => {
                        handleEditorChange(value);
                        // updateCodeOnDatabase();
                        // getUpdatedCode();
                        // capture();
                        setHasStarted(true);
                      }}
                      linguagem_id={linguagemId}
                      suggestions = {
                        !(apiSuggestions.length === 0) ? apiSuggestions : []
                    }
                      readOnly={isProcessing}
                    />
                  </div>
                </React.Fragment>
              </form>
              <div style={{ marginTop: '2vh' }}>
                <GoBackButton />
              </div>
            </div>
            <ResultsModal
              id='modalPush'
              type={tipoResultadoId}
              value={resultado}
              isProcessing={isProcessing || (apiSuggestions.length === 0)}
              questaoId={questaoId}
            />
          </section>
        </div>
        {/* {alerts.length > 0 ? alerts[0] : null} */}
      </>
    </>
  );
}
