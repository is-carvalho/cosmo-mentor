import React, { Component, useEffect, useState } from 'react';
import GoBackButton from './components/BotaoVoltar';
import '../css/Cacabugs.css';
import Navbar from './components/Navbar';
import Sidebar2 from './components/Sidebar';
import { Link } from 'react-router-dom';
import api from '../services/api';
import jwt_decode from 'jwt-decode';

function Cacabugs() {
  const [classeWrapper, setClasseWrapper] = useState('wrapper active');
  const [questoes, setQuestoes] = useState([]);
  const [submissoes, setSubmissoes] = useState([]);
  const [cacabugsAtivado, setCacabugsAtivado] = useState(true);

  function getUserId() {
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);
    return decoded.id;
  }

  useEffect(() => {
    const userid = getUserId();
    api
      .get('/cacabugsmanager')
      .then((res) => res.data)
      .then((loadEstadoCacabugs) => {
        setCacabugsAtivado(Boolean(loadEstadoCacabugs[0]['ativado']));
      });
    api
      .get('/cacabugs/questoes')
      .then((res) => res.data)
      .then((loadQuestoes) => {
        setQuestoes(loadQuestoes);
      });

    api
      .get(`/cacabugs/submissoes/${userid}`)
      .then((res) => res.data)
      .then((loadSubmissoes) => {
        setSubmissoes(loadSubmissoes);
      });
  }, []);

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

  const questoesElementos = questoes.map((q, index, arrayQuestoes) => {
    // verificar se a submissão do usuário foi realizada com sucesso para mostrar a questão bloqueada ou não

    const idQuestao = q.id;

    const submissaoQuestao = submissoes.find(
      (s) => s.questao_id === idQuestao && s.tipo_resultado_id === 1
    );

    //para que a seguinte função funcione, os ids das questões precisam ser incrementais de 1 em 1
    const submissaoQuestaoAnterior = submissoes.find(
      (s) => s.questao_id === idQuestao - 1 && s.tipo_resultado_id === 1
    );
    return (
      <Link
        to={`/${q.id}/cacabugs`}
        key={`questao-${index + 1}`}
        className={`menuQuestion ${
          submissaoQuestao || submissaoQuestaoAnterior || idQuestao === 1
            ? ''
            : 'disabled'
        }`}
      >
        Questão {index + 1}
      </Link>
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
                  <h1>Caça-Bugs</h1>
                  <p></p>
                  <h5>
                    O Caça-Bugs é uma ferramenta educacional em que você deve
                    ler o código incorreto e digitar os valores de entrada que
                    exploram o bug. Boa sorte!
                  </h5>
                </section>
                <div
                  id='divtotal'
                  className='divquestoes'
                >
                  <div className='menu'>
                    <div className='instruction'>Selecione uma questão</div>
                    <div className='tableMenu'>{questoesElementos}</div>
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

export default Cacabugs;
