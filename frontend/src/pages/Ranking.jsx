import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import '../css/Ranking.css';
import GoBackButton from './components/BotaoVoltar';
import Sidebar2 from './components/Sidebar';
import api from '../services/api';
import jwt_decode from 'jwt-decode';
// import Footer from "./components/Footer";

function Ranking() {
  const [classeWrapper, setClasseWrapper] = useState('wrapper active');
  const [dataTable, setDataTable] = useState(null);
  const [page, setPage] = useState(1);
  const [ranking, setRanking] = useState([0]);
  const [turmasAluno, setTurmasAluno] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [selectValue, setSelectValue] = useState(null);
  const [myPositionObject, setMyPositionObject] = useState(null);

  const onChangeSelect = (event) => {
    const value = event.target.value;
    setPage(1);
    setSelectValue(value);
  };

  function changeMyPositionObject() {
    if (page === Math.ceil(myPosition(ranking) / 10)) {
      setMyPositionObject(null);
    } else if (ranking !== undefined && ranking.length > 1) {
      setMyPositionObject(
        <>
          <tr>
            <td></td>
            <td>
              <td></td>
            </td>
            <td></td>
          </tr>
          <tr
            className='my-position'
            key={`my-position`}
          >
            <td>{myPosition(ranking)}</td>
            <td>
              Minha posição:
              <td
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  borderTop: '2px solid #BABABA',
                }}
              >
                {ranking[myPosition(ranking) - 1]['nome']}
              </td>
            </td>
            <td>{ranking[myPosition(ranking) - 1]['xp']}</td>
          </tr>
        </>
      );
    }
  }

  function getUserId() {
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);
    return decoded.id;
  }
  function myPosition(ranking) {
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);
    for (var i in ranking) {
      if (ranking[i]['id'] === decoded.id) {
        return parseInt(i) + 1;
      }
    }
  }

  function gerarElementos(loadRanking) {
    const tabela = loadRanking.map((element, index) => {
      if (index < 10 && index < loadRanking.length && page === 1) {
        if (index === 0) {
          return (
            <tr
              className={`${
                myPosition(loadRanking) === index + 1 ? 'my-position' : ''
              }`}
              key='posicao-1'
            >
              <td>
                <i className='fa-solid fa-medal goldCell'></i>
                {index + 1}
              </td>
              <td>{element['nome']}</td>
              <td>{element['xp']}</td>
            </tr>
          );
        } else if (index === 1) {
          return (
            <tr
              className={`${
                myPosition(loadRanking) === index + 1 ? 'my-position' : ''
              }`}
              key='posicao-2'
            >
              <td>
                <i className='fa-solid fa-medal silverCell'></i>
                {index + 1}
              </td>
              <td>{element['nome']}</td>
              <td>{element['xp']}</td>
            </tr>
          );
        } else if (index === 2) {
          return (
            <tr
              className={`${
                myPosition(loadRanking) === index + 1 ? 'my-position' : ''
              }`}
              key='posicao-3'
            >
              <td>
                <i className='fa-solid fa-medal bronzeCell'></i>
                {index + 1}
              </td>
              <td>{element['nome']}</td>
              <td>{element['xp']}</td>
            </tr>
          );
        } else {
          return (
            <tr
              className={`${
                myPosition(loadRanking) === index + 1 ? 'my-position' : ''
              }`}
              key={`posicao-${index + 1}`}
            >
              <td>{index + 1}</td>
              <td>{element['nome']}</td>
              <td>{element['xp']}</td>
            </tr>
          );
        }
      } else if (
        (page - 1) * 10 <= index &&
        index < page * 10 &&
        index < loadRanking.length
      ) {
        return (
          <tr
            className={`${
              myPosition(loadRanking) === index + 1 ? 'my-position' : ''
            }`}
            key={`posicao-${index + 1}`}
          >
            <td>{index + 1}</td>
            <td>{element['nome']}</td>
            <td>{element['xp']}</td>
          </tr>
        );
      }
    });
    return tabela;
  }

  useEffect(() => {
    const userId = getUserId();
    api
      .get('/ranking')
      .then((res) => res.data)
      .then((loadRanking) => {
        setDataTable(gerarElementos(loadRanking));
        setRanking(loadRanking);
      });

    api
      .get(`/ranking/${userId}/turmas`)
      .then((res) => res.data)
      .then((loadTurmasAluno) => {
        setTurmasAluno(loadTurmasAluno);
      });

    api
      .get(`/ranking/turmas`)
      .then((res) => res.data)
      .then((loadTurmas) => {
        setTurmas(loadTurmas);
      });
  }, []);

  useEffect(() => {
    setDataTable(gerarElementos(ranking));
    changeMyPositionObject();
  }, [page]);

  useEffect(() => {
    changeMyPositionObject();
  }, [ranking]);

  useEffect(() => {
    if (selectValue === 'geral') {
      api
        .get('/ranking')
        .then((res) => res.data)
        .then((loadRanking) => {
          setDataTable(gerarElementos(loadRanking));
          setRanking(loadRanking);
        });
    } else {
      console.log(selectValue)
      api
        .get(`/ranking/alunos/${selectValue}`)
        .then((res) => res.data)
        .then((loadAlunosTurmas) => {
          setDataTable(gerarElementos(loadAlunosTurmas));
          setRanking(loadAlunosTurmas);
        });
    }
  }, [selectValue]);

  const listaTurmasAluno = turmasAluno.map((element) => {
    for (var i in turmas) {
      if (turmas[i]['id'] === element['turma_id']) {
        return (
          <option
            key={turmas[i]['nome']}
            value={`${turmas[i]['id']}`}
          >
            {turmas[i]['nome']}
          </option>
        );
      }
    }
  });

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

  return (
    <>
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
                <div className='container-ranking'>
                  <div className='table-responsive'>
                    <div className='table-wrapper-ranking'>
                      <div className='table-title-ranking'>
                        <div className='row'>
                          <div className='col-sm-7'>
                            <h2 className='ranking-title'>
                              <i
                                style={{ marginRight: '  10px' }}
                                className='fa-solid fa-ranking-star'
                              ></i>
                              Ranking geral
                            </h2>
                          </div>
                          <div className='col-sm-5'>
                            <div className='bs-bars float-right'>
                              <div className='toolbar'>
                                <label className='label-filter'>
                                  Filtrar turma:
                                </label>
                                <select
                                  id='select-frm-conceito'
                                  className='form-control'
                                  defaultValue='geral'
                                  onChange={(e) => onChangeSelect(e)}
                                >
                                  <option value='geral'>Geral</option>
                                  {listaTurmasAluno}
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className='body-table-question-manager'>
                        <table
                          className='table table-striped table-hover table-question-manager'
                          cellSpacing='0'
                          cellPadding='0'
                        >
                          <thead>
                            <tr>
                              <th>Posição</th>
                              <th>Aluno</th>
                              <th>Pontuação</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dataTable}
                            {myPositionObject}
                          </tbody>
                        </table>
                      </div>
                      <div className='page-change-buttons'>
                        <button
                          onClick={() => {
                            setPage(1);
                          }}
                          type='button'
                          className='btn btn-primary'
                          disabled={page === 1 ? true : false}
                        >
                          &lt;&lt;
                        </button>
                        <button
                          onClick={() => {
                            setPage(page - 1);
                          }}
                          type='button'
                          className='btn btn-primary'
                          disabled={page === 1 ? true : false}
                        >
                          &lt;
                        </button>
                        <button
                          onClick={() => {
                            setPage(page + 1);
                          }}
                          type='button'
                          className='btn btn-primary'
                          disabled={
                            page === Math.ceil(ranking.length / 10)
                              ? true
                              : false
                          }
                        >
                          &gt;
                        </button>
                        <button
                          onClick={() => {
                            setPage(Math.ceil(ranking.length / 10));
                          }}
                          type='button'
                          className='btn btn-primary'
                          disabled={
                            page === Math.ceil(ranking.length / 10)
                              ? true
                              : false
                          }
                        >
                          &gt;&gt;
                        </button>
                      </div>
                      <h7 className='texto-pagina'>Página {page}</h7>
                    </div>
                  </div>
                  <GoBackButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <Footer/> */}
    </>
  );
}
export default Ranking;
