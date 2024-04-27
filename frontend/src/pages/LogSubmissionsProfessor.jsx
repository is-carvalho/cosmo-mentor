import React, { useEffect, useState, useLayoutEffect } from 'react';
import Header from './components/Header';
import api from '../services/api';
import CodeModal from './components/CodeModal';
import Select from 'react-select';

/*
 * This page is used to show the submissions of a question
 * It is used by the teacher to see the submissions of a question, and the students to see their own submissions
 * It is accessed by clicking on the "Log de Submissões" button on the dashboard page
 * Its possible to filter the submissions by the student that made it, the language used, the status of the submission, and the date of the submission, and filter by class, course, and concept
 * It will be styled by bootstrap
 * When the page is loaded, it will make a request to the backend to get all the submissions
 * When the user clicks on the codigo, it will collapse and show the code of the submission
 */

export default function LogSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [flagCode, setFlagCode] = useState(false);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [courseChoosed, setCourseChoosed] = useState();
  const [userChoosed, setUserChoosed] = useState();
  const [statusChoosed, setStatusChoosed] = useState();
  const [conceptChoosed, setConceptChoosed] = useState();
  const [linguagens, setLinguagens] = useState([
    { value: 'C', label: 'C' },
    { value: 'C++', label: 'C++' },
    { value: 'C#', label: 'C#' },
    { value: 'Java', label: 'Java' },
    { value: 'Python', label: 'Python' },
    { value: 'JavaScript', label: 'JavaScript' },
  ]);
  const [languageChoosed, setLanguageChoosed] = useState();
  const [status, setStatus] = useState([
    { value: '1', label: 'Correto' },
    { value: '2', label: 'Compilação' },
    { value: '3', label: 'Erro' },
    { value: '4', label: 'Execução' },
    { value: '5', label: 'Tempo' },
  ]);

  /*
   * This useEffect is used to get all the users, questions and turma from the backend
   */
  useEffect(() => {
    document.title = 'Log de Submissões';
    // if (submissions.length < 1) {
    //   api.get('/log/allSubmissions').then((response) => {
    //     let results = [response.data];
    //     setSubmissions(...results);
    //   });
    // }
    api
      .get('/listAllUsers', {})
      .then((response) => {
        let results = [response.data];
        setUsers(...results);
      })
      .catch((err) => {
        console.log(err);
      });

    api
      .get('/courses', {})
      .then((response) => {
        let results = [response.data];
        setCourses(...results);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const findCodeById = (id) => {
    let code = '';
    submissions.forEach((submission) => {
      if (submission.id === id) {
        code = submission.codigo;
      }
    });
    return code;
  };

  /*
   * This function is used to search the submissions,
   * it will make a request to the backend to get the submissions that match the filters.
   */
  const searchSubmissions = () => {
    try {
      api
        .get('/log/searchSubmissions', {
          headers: {
            userId: userChoosed,
            courseId: courseChoosed,
            conceptId: conceptChoosed,
            resultId: statusChoosed,
          },
        })
        .then((response) => {
          let results = [response.data];
          setSubmissions(...results);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className='wrapper'>
        <br />
        <Header />
      </div>
      <div className='content'>
        <h1 className='text-center mt-5 mb-5 font-weight-bold'>
          Log de Submissões
        </h1>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12'>
              <div className='card'>
                <div className='card-header'>
                  <h4 className='card-title'>Filtros</h4>
                </div>
                <div className='card-body'>
                  <div className='row'>
                    <div className='col-md-3 pr-1'>
                      <div className='form-group'>
                        <label>Aluno</label>
                        <Select
                          options={users}
                          getOptionLabel={(user) => user.nome}
                          getOptionValue={(user) => user.id}
                          placeholder='Nome do aluno'
                          onChange={(user) => {
                            setUserChoosed(user.id);
                          }}
                        />
                        {/* <input
                          type='text'
                          className='form-control'
                          placeholder='Nome do aluno'
                        /> */}
                      </div>
                    </div>
                    <div className='col-md-3 px-1'>
                      <div className='form-group'>
                        <label>Linguagem</label>
                        <Select
                          options={linguagens}
                          getOptionLabel={(linguagem) => linguagem.label}
                          getOptionValue={(linguagem) => linguagem.value}
                          placeholder='Linguagem'
                          onChange={(linguagem) => {
                            setLanguageChoosed(linguagem.value);
                          }}
                        />
                      </div>
                    </div>
                    <div className='col-md-3 px-1'>
                      <div className='form-group'>
                        <label>Status</label>
                        <Select
                          options={status}
                          getOptionLabel={(status) => status.label}
                          getOptionValue={(status) => status.value}
                          placeholder='Status'
                          onChange={(status) => {
                            setStatusChoosed(status.value);
                          }}
                        />
                      </div>
                    </div>
                    <div className='col-md-3 pl-1'>
                      <div className='form-group'>
                        <label>Data</label>
                        <input
                          type='text'
                          className='form-control'
                          placeholder='Data'
                        />
                      </div>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-md-3 pr-1'>
                      <div className='form-group'>
                        <label>Curso</label>
                        <Select
                          options={courses}
                          getOptionLabel={(course) => course.nome}
                          getOptionValue={(course) => course.id}
                          placeholder='Nome do curso'
                          onChange={(course) => {
                            setCourseChoosed(course.id);
                          }}
                        />
                      </div>
                    </div>
                    <div className='col-md-3 px-1'>
                      <div className='form-group'>
                        <label>Turma</label>

                        <input
                          type='text'
                          className='form-control'
                          placeholder='Turma'
                        />
                      </div>
                    </div>
                    <div className='col-md-3 px-1'>
                      <div className='form-group'>
                        <label>Conceito</label>
                        <input
                          type='text'
                          className='form-control'
                          placeholder='Conceito'
                        />
                      </div>
                    </div>
                    <div className='col-md-3 pl-1'>
                      <div className='form-group'>
                        <label>Questão</label>
                        <input
                          type='text'
                          className='form-control'
                          placeholder='Questão'
                        />
                      </div>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='update ml-auto mr-auto'>
                      <button
                        type='submit'
                        className='btn btn-primary btn-round'
                        onClick={searchSubmissions}
                      >
                        Filtrar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-md-12'>
              <div className='card'>
                <div className='card-header'>
                  <h4 className='card-title'>Log de Submissões</h4>
                </div>
                <div className='card-body'>
                  <div className='table-responsive'>
                    <table
                      className='table'
                      style={{ overflow: 'hidden', overscrollBehavior: 'none' }}
                    >
                      <thead className=' text-primary'>
                        <tr>
                          <th>Aluno</th>
                          <th>Conceito</th>
                          <th>Questão</th>
                          <th>Status</th>
                          <th>Tempo</th>
                          <th>Codigo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {submissions.map((submission, index) => (
                          <tr data-aos='fade-up'>
                            <td>{submission.nome}</td>
                            <td>{submission.conceito}</td>
                            <td>{submission.titulo}</td>
                            <td>{submission.resultado}</td>
                            <td>{`${submission.tempo}s`}</td>{' '}
                            {/* Tempo em segundos de processamento, alterar para tempo de resolução do problema */}
                            <td>
                              <button
                                type='button'
                                className='btn btn-primary'
                                data-toggle='modal'
                                data-target={`#exampleModal${submission.id}`}
                              >
                                Timeline
                              </button>

                              <div
                                className='modal fade'
                                id={`exampleModal${submission.id}`}
                                tabIndex='-1'
                                role='dialog'
                                aria-labelledby='exampleModalLabel'
                                aria-hidden='true'
                              >
                                <CodeModal
                                  key={submission.id}
                                  codigo={findCodeById(submission.id)}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
