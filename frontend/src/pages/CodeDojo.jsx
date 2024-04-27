import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import api from '../services/api';
import QuestionInformation from './components/Answer/Question/Information';
import CodeEditor from './components/Answer/Code/Editor';
import LanguageList from './components/Answer/Language/List';
import SubmitButton from './components/Answer/Submit/Button';
import ResultsModal from './components/Answer/Results/Modal';
import Alert from './components/Alert';
import GoBackButton from './components/BotaoVoltar';
import Header from './components/Header';
import Webcam from 'react-webcam';
import axios from 'axios';

export default function CodeDojo() {
  const getUpdatedCode = () => {
    api
      .get(`/coding-dojo/${dojoId}`)
      .then((response) => {
        setCodigo(response.data.data[0].codigo);
        console.log(response.data.data[0].codigo);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const location = useLocation();
  const [dojoId, setDojoId] = useState(location.state.dojo.id);
  const [piloto, setPiloto] = useState(location.state.dojo.piloto);
  const [copiloto, setCopiloto] = useState(location.state.dojo.copiloto);
  const [dojo, setDojo] = useState('');
  const [loading, setLoading] = useState(false);
  const [questao, setQuestao] = useState('');
  const [questaoId, setQuestaoId] = useState(location.state.dojo.questao_id);
  const [xp, setXp] = useState(0);
  const [linguagem, setLinguagem] = useState(0);
  const [alert, setAlert] = useState([]);
  const [resultado, setResultado] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [resultadoId, setResultadoId] = useState(0);
  const [codigo, setCodigo] = useState(getUpdatedCode ? getUpdatedCode() : '');
  const [turmaId, setTurmaId] = useState(localStorage.turma);
  const [entrada, setEntrada] = useState('');
  const [saida, setSaida] = useState('');
  const [tempo, setTempo] = useState('');
  const [memoria, setMemoria] = useState('');
  const [enunciado, setEnunciado] = useState('');
  const [observacao, setObservacao] = useState('');
  const [imageSrc, setImageSrc] = useState(null);

  const history = useHistory();

  const webcamRef = useRef('');

  const capture = () => {
    let imageSrc = webcamRef.current.getScreenshot();

    setImageSrc(imageSrc);
    axios
      .post(
        'http://127.0.0.1:8000/processImage',
        {
          image: imageSrc,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    setInterval(() => {
      // atualizar o codeeditor a cada 1 sec
      getUpdatedCode();
    }, 1000);
  }, [codigo]);

  useEffect(() => {
    // console.log(dojoId, piloto, copiloto, questaoId);
    if (dojoId.length < 1) {
      api
        .get(`/coding-dojo/${dojoId}`)
        .then((response) => {
          setDojo(response.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    if (questao.length < 1) {
      api
        .get(`/question/${questaoId}`)
        .then((response) => {
          setQuestao(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const configureQuestion = (questao) => {
    setEntrada(questao.descricao_entrada);
    setSaida(questao.descricao_saida);
    setEnunciado(questao.enunciado);
    setObservacao(questao.observacao);
  };

  const handleEditorChange = (value) => {
    setCodigo(value);
  };

  const handleLanguageChange = (e) => {
    setLinguagem(e.target.value);
  };

  const updateCodeOnDatabase = (codigo) => {
    codigo.length < 1 ? (codigo = ' ') : console.log(''); // caso seja palavra vazia, o update vai ter null somente
    api
      .put(`/coding-dojo/${dojoId}`, {
        codigo: codigo,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);
    api
      .post(`/coding-dojo/${dojoId}/results`, {
        codigo: codigo,
        linguagem: linguagem,
        questao_id: questaoId,
        turma_id: turmaId,
        piloto: piloto,
        copiloto: copiloto,
      })
      .then((response) => {
        setResultado(response.data.data);
        setResultadoId(response.data.data.id);
        setProcessing(false);
        setAlert([]);
      })
      .catch((err) => {
        setProcessing(false);
        setAlert(err.response.data.errors);
      });
  };

  return (
    <>
      <div className='app-body'>
        <Header />
        <>
          <div className='fundo-bg fundo-gray' />

          <section
            className={
              turmaId !== null
                ? 'jumbotron text-left question-hero'
                : 'jumbotron text-left question-hero question-info-prof'
            }
          >
            <div className='container'>
              <div className='row'>
                <div className='col'>
                  {turmaId !== null ? (
                    <h6>
                      <button
                        type='button'
                        onClick={() => history.go(-2)}
                        className='link'
                      >
                        {turmaId}
                      </button>{' '}
                      /{' '}
                      <button
                        type='button'
                        onClick={() => history.goBack()}
                        className='link'
                      >
                        Minhas Atividades
                      </button>
                    </h6>
                  ) : (
                    ''
                  )}
                  <h1>{enunciado}</h1>
                  <h6>
                    Ao acertar, você ganhará{' '}
                    {xp > 1 ? xp + ' pontos' : xp + ' ponto'} de experiência.
                  </h6>
                </div>
              </div>
            </div>
          </section>

          <section className='cosmo-hero'>
            <div className='container wrapper'>
              <form
                className='resp-formulario'
                onSubmit={(e) => handleSubmit(e)}
              >
                <div className='row'>
                  <QuestionInformation
                    turma_id={turmaId}
                    questao_id={questaoId}
                  />
                </div>
                <React.Fragment>
                  <div className='row well'>
                    <LanguageList
                      onChange={(value) => {
                        handleLanguageChange(value);
                      }}
                      value={linguagem}
                      disabled={processing}
                    />
                    <SubmitButton isProcessing={processing} />
                  </div>
                  <div className='row'>
                    <CodeEditor
                      codigo={codigo}
                      onChange={(value) => {
                        handleEditorChange(value);
                        updateCodeOnDatabase(value);
                      }}
                      linguagem_id={linguagem}
                      readOnly={processing}
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
              type={resultadoId}
              value={resultado}
              isProcessing={processing}
              questaoId={questaoId}
            />
          </section>
        </>
        <div>
          <Webcam
            ref={webcamRef}
            audio={false}
            height={480}
            screenshotFormat='image/jpeg'
            width={480}
          />
          <button
            onClick={capture}
            className='btn btn-primary  center'
          >
            Capture
          </button>
          {imageSrc && (
            <img
              src={imageSrc}
              alt='Webcam Image'
            />
          )}
        </div>
      </div>
    </>
  );
}
