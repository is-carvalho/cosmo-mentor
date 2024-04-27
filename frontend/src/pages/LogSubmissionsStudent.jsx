import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import api from '../services/api';
import CodeModal from './components/CodeModal';
import Select from 'react-select';
import jwt_decode from 'jwt-decode';

/*
 * This page is similar to LogSubmissionsProfessor.jsx, but it is for students.
 * It shows the submissions of the student.
 * Its possible to filter the submissions by the student that made it, the language used, the status of the submission, and the date of the submission, and filter by class, course, and concept
 * It will be styled by bootstrap
 * When the page is loaded, it will make a request to the backend to get all the submissions
 * When the user clicks on the codigo, it will collapse and show the code of the submission
 */

export default function LogSubmissionsStudent() {
  const getUserData = () => {
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);
    return {
      id: decoded.id,
      tipo: decoded.tipo,
    };
  };

  const [submissions, setSubmissions] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [concepts, setConcepts] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedConcept, setSelectedConcept] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [user, setUser] = useState(getUserData);
  // const [emotionsOnQuestions, setEmotionsOnQuestions] = useState([]);

  const loadSubmissions = () => {
    const response = api
      .get('/log/userSubmissions', {
        headers: {
          userid: user.id,
        },
      })
      .then((response) => {
        console.log(response);
        setSubmissions(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const findCodeById = (id) => {
    let code = '';
    // console.log(id);
    submissions.forEach((submission) => {
      if (submission.id === id) {
        code = submission.codigo;
      }
    });
    return code;
  };

  useEffect(() => {
    if (submissions.length === 0) loadSubmissions();
  }, [submissions]);
  return (
    <>
      <>
        <div className='wrapper'>
          <br />
          <Header />
        </div>
        <div className='content'>
          <h1 className='text-center mt-5 mb-5 font-weight-bold '>
            Log de Submissões
          </h1>
          <div className='container'>
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
                        style={{
                          overflow: 'hidden',
                          overscrollBehavior: 'none',
                        }}
                      >
                        <thead className=' text-primary'>
                          <tr>
                            <th>Questão</th>
                            <th>Conceito</th>
                            <th>Status</th>
                            <th>Tempo</th>
                            <th>Codigo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {submissions.map((submission, index) => (
                            <tr data-aos='fade-up'>
                              <td>{submission.titulo}</td>
                              <td>{submission.conceito}</td>
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
                                    user={user}
                                    submission={submission.id}
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
    </>
  );
}
