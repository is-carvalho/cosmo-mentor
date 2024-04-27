// import React, { useState, useEffect } from 'react';
// import Navbar from './components/Navbar';
// import jwt_decode from 'jwt-decode';
// import Spinner from './components/Spinner';
// import api from '../services/api';
// import '../css/Log.css';
// import Alert from './components/Alert';
// import {
//   BarChart,
//   Bar,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   Line,
// } from 'recharts';

// function getUserType() {
//   const token = localStorage.usertoken;
//   const decoded = jwt_decode(token);
//   return decoded.tipo;
// }

// function getUserData() {
//   const token = localStorage.usertoken;
//   const decoded = jwt_decode(token);
//   return { id: decoded.id, type: decoded.tipo };
// }

// export default function DashboardClass() {
//   const [loading, setLoading] = useState(false);
//   const [userId, setUserId] = useState(0);
//   const [userType, setUserType] = useState(getUserType());
//   const [turmas, setTurmas] = useState([]);
//   const [turma, setTurma] = useState(0);

//   const [data, setData] = useState([
//     {
//       name: 'Corretas',
//       uv: 4000,
//       pv: 2400,
//       amt: 2400,
//     },
//     {
//       name: 'Erro de Execução',
//       uv: 3000,
//       pv: 1398,
//       amt: 2210,
//     },
//     {
//       name: 'Erro de Compilação',
//       uv: 2000,
//       pv: 9800,
//       amt: 2290,
//     },
//     {
//       name: 'Tempo Excedido',
//       uv: 2780,
//       pv: 3908,
//       amt: 2000,
//     },
//   ]);

//   const [search, setSearch] = useState(0);
//   const [table, setTable] = useState([]);
//   const [columns, setColumns] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [questionSelected, setQuestionSelected] = useState({
//     id: 0,
//     index: -1,
//   });
//   const [alerts, setAlerts] = useState([]);

//   const showAlert = (msg, status) => {
//     let alert = alerts;
//     alert.push(
//       <Alert
//         msg={msg}
//         status={status}
//         hide={closeAlert()}
//       />
//     );
//     setAlerts(alert);
//   };

//   const closeAlert = () => {
//     let alert = alerts;
//     alert.shift();
//     setAlerts(alert);
//   };

//   const onChange = (e) => {};

//   const getCourseData = (turmaId) => {
//     api
//       .get('/log/courseLog', {
//         headers: {
//           turmaId: turmaId,
//         },
//       })
//       .then((res) => {
//         console.log(res.data);
//         setTable(res.data);
//         setData(res.data);
//         // if (table) {
//         //   console.log(res.data);
//         //   const newData = [
//         //     {
//         //       name: 'Corretas',
//         //       value: res.data.respostasCorretas,
//         //     },
//         //     {
//         //       name: 'Erro de Execução',
//         //       value: res.data.respostasErroExecucao,
//         //     },
//         //     {
//         //       name: 'Erro de Compilação',
//         //       value: res.data.respostasErroCompilacao,
//         //     },
//         //     {
//         //       name: 'Tempo Excedido',
//         //       value: res.data.respostasTempoExcedido,
//         //     },
//         //   ];
//         //   setData(newData);
//         // }
//       })
//       .catch((err) => {});
//   };

//   useEffect(() => {
//     const user = getUserData();
//     setUserId(user.id);
//     api
//       .get('/allClasses')
//       .then((res) => {
//         setTurmas(res.data);
//       })
//       .catch((err) => {
//         console.log(err);
//         showAlert('Erro ao carregar turmas', 'danger');
//       });
//   }, [alerts]);

//   useEffect(() => {
//     console.log(turma);
//     getCourseData(turma);
//   }, [turma]);

//   return (
//     <>
//       {loading ? (
//         <>
//           {' '}
//           <Spinner />{' '}
//         </>
//       ) : (
//         <>
//           <Navbar />
//           {alerts ? alerts : <></>}
//           <div className='app-body main-log'>
//             <div className='fundo-bg fundo-gray' />
//             <div className='container'>
//               <div className='table-responsive'>
//                 <div className='table-wrapper'>
//                   <div className='table-title'>
//                     <div className='row'>
//                       <div className='col-sm-4'>
//                         <h2>
//                           Log <b>Turma</b>
//                         </h2>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <br />
//               <div className='row'>
//                 <div className='col-sm-6'>
//                   <div className='form-group'>
//                     <label>Turma</label>
//                     <select
//                       className='form-control'
//                       name='turma'
//                       value={turma}
//                       onChange={(e) => setTurma(parseInt(e.target.value))}
//                     >
//                       <option value='0'>Selecione uma turma</option>
//                       {turmas.map((turma, index) => (
//                         <option
//                           key={index}
//                           value={turma.id}
//                         >
//                           {turma.nome}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               <h2 className='text-center mt-8 justify-content-lg-start'>
//                 Total por questão{' '}
//               </h2>
//               {/* center this please */}
//               <div className='flex justify-center'>
//                 <BarChart
//                   width={800}
//                   height={300}
//                   data={data}
//                   margin={{
//                     top: 5,
//                     right: 30,
//                     left: 20,
//                     bottom: 5,
//                   }}
//                 >
//                   <CartesianGrid strokeDasharray='3 3' />
//                   <XAxis dataKey='titulo' />
//                   <YAxis dataKey='respostasCorretas' />
//                   <Tooltip />
//                   <Legend />
//                   <Bar
//                     dataKey='respostasCorretas'
//                     fill='#8884d8'
//                   />
//                 </BarChart>
//                 <BarChart
//                   width={800}
//                   height={300}
//                   data={data}
//                   margin={{
//                     top: 5,
//                     right: 30,
//                     left: 20,
//                     bottom: 5,
//                   }}
//                 >
//                   <CartesianGrid strokeDasharray='3 3' />
//                   <XAxis dataKey='titulo' />
//                   <YAxis dataKey='respostasErroExecucao' />
//                   <Tooltip />
//                   <Legend />
//                   <Bar
//                     dataKey='respostasErroExecucao'
//                     fill='#8884d8'
//                   />
//                 </BarChart>
//                 <BarChart
//                   width={800}
//                   height={300}
//                   data={data}
//                   margin={{
//                     top: 5,
//                     right: 30,
//                     left: 20,
//                     bottom: 5,
//                   }}
//                 >
//                   <CartesianGrid strokeDasharray='3 3' />
//                   <XAxis dataKey='titulo' />
//                   <YAxis dataKey='respostasErroCompilacao' />
//                   <Tooltip />
//                   <Legend />
//                   <Bar
//                     dataKey='respostasErroCompilacao'
//                     fill='#8884d8'
//                   />
//                 </BarChart>
//               </div>
//               <div className='responsive-table'>
//                 <table className='table table-striped table-hover'>
//                   <thead>
//                     <tr>
//                       <th>ID</th>
//                       <th>Nome</th>
//                       <th>Dificuldade</th>
//                       <th>Respostas Corretas</th>
//                       <th>Respostas com Erro de Compilação</th>
//                       <th>Respostas com Erro de Execução</th>
//                       <th>Respostas com Tempo Excedido</th>
//                       <th>Quantidade de Tentativas</th>
//                       <th>Pontos de Experiência</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {table.length > 0 ? (
//                       table?.map((row, index) => (
//                         <tr key={index}>
//                           <td>{row.idQuestao}</td>
//                           <td>{row.titulo}</td>
//                           <td>{row.dificuldade}</td>
//                           <td>{row.respostasCorretas}</td>
//                           <td>{row.respostasErroCompilacao}</td>
//                           <td>{row.respostasErroExecucao}</td>
//                           <td>{row.respostasTempoExcedido}</td>
//                           <td>{row.questaoMaiorTentativas}</td>
//                           <td>{row.xp}</td>
//                         </tr>
//                       ))
//                     ) : (
//                       <></>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//               <div className='clearfix'>
//                 <div className='hint-text'>
//                   Mostrando <b>{table.length}</b> de <b>{table.length}</b>{' '}
//                   entradas
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </>
//   );
// }
