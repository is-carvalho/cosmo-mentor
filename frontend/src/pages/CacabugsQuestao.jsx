import React, { Component, useState, useEffect } from 'react';
import GoBackButton from './components/BotaoVoltar';
import '../css/Cacabugs.css';
import Navbar from './components/Navbar';
import Sidebar2 from './components/Sidebar';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { funcaoJuiz } from './CacabugsScripts';
import jwt_decode from 'jwt-decode';

function CacaBugsQuestao() {
  function getUserId() {
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);
    return decoded.id;
  }

  const [linguagem, setLinguagem] = useState('python');

  const { idQuestao } = useParams();

  const [cacabugsAtivado, setCacabugsAtivado] = useState(true);

  function getUserId() {
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);
    return decoded.id;
  }

  const [classeWrapper, setClasseWrapper] = useState('wrapper active');

  function btnWrapperClicked(e) {
    if (
      e.target.className === 'hamburger' ||
      e.target.className === 'hamburger__inner'
    ) {
      if (classeWrapper === 'wrapper active') {
        setClasseWrapper('wrapper');
      } else {
        setClasseWrapper('wrapper active');
      }
    }
  }

  const [submissoes, setSubmissoes] = useState([]);
  const [questao, setQuestao] = useState(null);
  const tempoInicial = new Date();

  useEffect(() => {
    const userid = getUserId();
    api
      .get('/cacabugsmanager')
      .then((res) => res.data)
      .then((loadEstadoCacabugs) => {
        setCacabugsAtivado(Boolean(loadEstadoCacabugs[0]['ativado']));
      });
    api
      .get(`/cacabugs/submissoes/${userid}`)
      .then((res) => res.data)
      .then((loadSubmissoes) => {
        setSubmissoes(loadSubmissoes);
      });
    api
      .get(`/cacabugs/questoes/${idQuestao}`)
      .then((res) => res.data)
      .then((loadquestoes) => {
        if (loadquestoes != undefined) {
          setQuestao(loadquestoes);
        } else {
          setQuestao(null);
        }
      });
  }, []);

  if (cacabugsAtivado === false) {
    return (
      <React.Fragment>
        <div
          className={classeWrapper}
          onClick={btnWrapperClicked}
        >
          <Navbar />
          <div className='main_container'>
            <Sidebar2 activeOption='cursos' />

            <div className='container-fluid'>
              <div className='row'>
                <div className='col'>
                  <section className='section-titulo-cacabugs'>
                    <h1>Caça-Bugs desativado</h1>
                  </section>
                  <div
                    id='divtotal'
                    className='divpaginaquestoes'
                  >
                    <h5>
                      O Caça-Bugs foi temporariamente desativado. Volte em outro
                      momento.
                    </h5>
                  </div>
                  <div className='botaoVoltarCacabugs'>
                    <GoBackButton />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  const submissaoQuestaoAnterior = submissoes.find(
    (s) => s.questao_id === parseInt(idQuestao) - 1 && s.tipo_resultado_id === 1
  );

  function listaRespostas() {
    const listaNomesInputs = [];
    const arrayInputs = questao?.entradas.split(',') || [];
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
    var idLinguagem = null;
    if (linguagem === 'lua') {
      idLinguagem = 4;
    } else if (linguagem === 'c') {
      idLinguagem = 1;
    } else if (linguagem === 'python') {
      idLinguagem = 5;
    }
    const body = {
      language: idLinguagem,
      result: listaRespostas(),
      resultType: funcaoJuiz(parseInt(idQuestao)),
      tempoInicial: tempoInicial,
      tempoFinal: tempoFinal,
    };
    api
      .post(`/answercb/${getUserId()}/${idQuestao}`, body)
      .then((res) => res.data)
      .then((loadquestoes) => {
        if (loadquestoes.length > 0) {
          setQuestao(loadquestoes[0]);
        }
      });
  }

  if (questao === null) {
    return (
      <React.Fragment>
        <div
          className={classeWrapper}
          onClick={btnWrapperClicked}
        >
          <Navbar />
          <div className='main_container'>
            <Sidebar2 activeOption='cursos' />

            <div className='container-fluid'>
              <div className='row'>
                <div className='col'>
                  <section className='section-titulo-cacabugs'>
                    <h1>Questão inexistente</h1>
                  </section>
                  <div
                    id='divtotal'
                    className='divpaginaquestoes'
                  >
                    <h5>
                      A questão do Caça-Bugs que você está tentando acessar não
                      existe. Tente acessar outra questão.
                    </h5>
                  </div>
                  <div className='botaoVoltarCacabugs'>
                    <GoBackButton />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
  if (submissaoQuestaoAnterior == null && idQuestao != 1) {
    return (
      <React.Fragment>
        <div
          className={classeWrapper}
          onClick={btnWrapperClicked}
        >
          <Navbar />
          <div className='main_container'>
            <Sidebar2 activeOption='cursos' />

            <div className='container-fluid'>
              <div className='row'>
                <div className='col'>
                  <section className='section-titulo-cacabugs'>
                    <h1>Questão bloqueada</h1>
                  </section>
                  <div
                    id='divtotal'
                    className='divpaginaquestoes'
                  >
                    <h5>
                      Você ainda não possui acesso a essa questão do Caça-Bugs.
                      Tente acessar outra questão.
                    </h5>
                  </div>
                  <div className='botaoVoltarCacabugs'>
                    <GoBackButton />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
  const arrayInputs = questao?.entradas.split(',') || [];
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

  return (
    <React.Fragment>
      <div
        className={classeWrapper}
        onClick={btnWrapperClicked}
      >
        <Navbar />
        <div className='main_container'>
          <Sidebar2 activeOption='cursos' />

          <div className='container-fluid'>
            <div className='row'>
              <div className='col'>
                <section className='section-titulo-cacabugs'>
                  <h1>Questão {idQuestao}</h1>
                  <p></p>
                  <h5>{questao['enunciado']}</h5>
                </section>
                <div
                  id='divtotal'
                  className='divpaginaquestoes'
                >
                  <div>
                    <button
                      id='botaopython'
                      className={`buttonTab ${
                        linguagem === 'python' ? 'ativo' : ''
                      }`}
                      onClick={() => setLinguagem('python')}
                    >
                      Python
                    </button>
                    <button
                      id='botaoc'
                      className={`buttonTab ${
                        linguagem === 'c' ? 'ativo' : ''
                      }`}
                      onClick={() => setLinguagem('c')}
                    >
                      C
                    </button>
                    <button
                      id='botaolua'
                      className={`buttonTab ${
                        linguagem === 'lua' ? 'ativo' : ''
                      }`}
                      onClick={() => setLinguagem('lua')}
                    >
                      Lua
                    </button>
                  </div>
                  <div className='code'>
                    {linguagem === 'lua'
                      ? questao.codigolua
                      : linguagem === 'c'
                      ? questao.codigoc
                      : questao.codigopython}
                  </div>
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
                <div className='botaoVoltarCacabugs'>
                  <GoBackButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default CacaBugsQuestao;
