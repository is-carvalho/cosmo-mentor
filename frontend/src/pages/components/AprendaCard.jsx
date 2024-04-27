import React, { Component, useEffect, useLayoutEffect, useState } from 'react';
import api from '../../services/api';
import '../../css/AprendaCard.css';
import '../../css/global.css';
import jwt_decode from 'jwt-decode';
import { Link } from 'react-router-dom';

function getUserData() {
  const token = localStorage.usertoken;
  const decoded = jwt_decode(token);

  return {
    id: decoded.id,
    tipo: decoded.tipo,
  };
}
function AprendaCard(props) {
  const [user] = useState(getUserData());
  const [qtQuestoes, setQtQuestoes] = useState(0);
  const [qtCorretas, setQtCorretas] = useState(0);
  const [porcentagemAcertos, setPorcentagemAcertos] = useState(0);

  useEffect(() => {
    api
      .get('/searchQuestions', {
        headers: {
          user: user.id,
        },
      })
      .then((response) => {
        try {
          // console.log(response);
          setPorcentagemAcertos(response.data * 100);
          // setQtCorretas(response.data[0][0].qtCorretas);
          // setQtQuestoes(response.data[1][0].totalQuestoes);
        } catch (e) {
          console.log(e);
        }
      });
  }, [porcentagemAcertos, qtCorretas, qtQuestoes]);

  useEffect(() => {
    let porcentagem = qtCorretas / qtQuestoes;
    if (typeof porcentagem == 'number') {
      setPorcentagemAcertos(porcentagem.toFixed(2));
      if (porcentagemAcertos < 1)
        setPorcentagemAcertos(porcentagemAcertos * 100);
    }

    // console.log(porcentagemAcertos);
  }, [qtCorretas, qtQuestoes]);
  return (
    <>
      <div className='card-aprenda'>
        <div className='card-aprenda-top'>
          <div className='aprenda-icon'>
            <a>
              <i className='fas fa-lightbulb'></i>
            </a>
          </div>
          <div className='aprenda-titulo'>
            <h3>Algoritmos 1</h3>
            <p>{props.tituloCurso}Total de Questões Respondidas</p>
          </div>
          <div
            className='progress'
            style={{ width: '100%', marginRight: '5vw' }}
          >
            <div
              className='progress-bar'
              role='progressbar'
              style={{ width: `${porcentagemAcertos + 10}%` }}
              aria-valuenow='25'
              aria-valuemin='0'
              aria-valuemax='100'
            >
              {/* i dont wanna the value with decimals */}
              {porcentagemAcertos ? `${porcentagemAcertos.toFixed(0)}%` : <></>}

              {/* {porcentagemAcertos > 0 ? `${porcentagemAcertos}%` : <></>} */}
            </div>
          </div>
          <div className='btn-continuar'>
            <Link to='/cursos'>Continuar Aprendendo</Link>
          </div>
        </div>
        <div className='card-aprenda-bottom'>
          {/* <div className="card-text">
                        <p className="cd_title">Domina esse assunto?</p>
                        <p className="cd_subtitle">Faça uma avaliação para verificar seu nível de conhecimento</p>
                    </div> */}
          {/* <div className="btn-avaliar">Avalie</div> */}
        </div>
      </div>
    </>
  );
}

export default AprendaCard;
// class AprendaCard extends Component {
//   constructor() {
//     super();

//     let dataUser = this.getUserData();
//     this.state = {
//       userId: dataUser.id,
//       cursos: [],
//       user: "",
//       dificuldades: [],
//       categorias: [],
//       conceitos: [],
//       curso: "",
//       categoria: "",
//       conceito: "",
//       titulo: "",
//       enunciado: "",
//       descEntrada: "",
//       descSaida: "",
//       resumo: "",
//       qtCorretas: "",
//       qtTotal: "",
//       porcentagemAcertos: "",
//     };
//     // this.onChange = this.onChange.bind(this)
//     // this.onSubmit = this.onSubmit.bind(this)
//     //this.catchQuestions = this.catchQuestions.bind(this)
//     // this.showAlert = this.showAlert.bind(this)
//     // this.closeAlert = this.closeAlert.bind(this)
//   }

//   getUserData() {
//     const token = localStorage.usertoken;
//     const decoded = jwt_decode(token);
//     // console.log(decoded)
//     this.setState({
//       userId: decoded.id,
//     });
//     return {
//       id: decoded.id,
//       tipo: decoded.tipo,
//     };
//   }
//   componentDidMount() {
//     api
//       .get("/searchQuestions", {
//         headers: {
//           user: this.state.userId,
//         },
//       })
//       .then((totalCorretas) => {
//         // console.log(totalCorretas)
//         this.setState({
//           totalQuestoes: totalCorretas.data[0][0].qtCorretas,
//           qtCorretas: totalCorretas.data[1][0].totalQuestoes,
//         });
//         this.setState({
//           porcentagemAcertos: parseInt(
//             (this.state.totalQuestoes / this.state.qtCorretas.toFixed(2)) * 100
//           ),
//         });
//       });
//   }

//   isNaN(x) {
//     x = Number(x);
//     // se x é NaN, NaN! = NaN é verdadeiro, senão é falso
//     return x != x;
//   }

//   render() {
//     this.state.porcentagemAcertos = parseInt(
//       (this.state.totalQuestoes / this.state.qtCorretas) * 100
//     );
//     if (isNaN(this.state.porcentagemAcertos)) this.state.porcentagemAcertos = 0;
//     if (this.state.porcentagemAcertos > 100)
//       this.state.porcentagemAcertos = 100;
//     let div = "";
//     if (this.state.porcentagemAcertos <= 10) {
//       div = (
//         <div className="progress" style={{ width: "50%" }}>
//           <div
//             className="progress-bar"
//             role="progressbar"
//             style={{ width: "10%" }}
//             aria-valuenow="25"
//             aria-valuemin="0"
//             aria-valuemax="100"
//           >
//             {this.state.porcentagemAcertos}%
//           </div>
//         </div>
//       );
//     } else if (this.state.porcentagemAcertos <= 60) {
//       div = (
//         <div className="progress" style={{ width: "50%" }}>
//           <div
//             className="progress-bar"
//             role="progressbar"
//             style={{ width: "50%" }}
//             aria-valuenow="25"
//             aria-valuemin="0"
//             aria-valuemax="100"
//           >
//             {this.state.porcentagemAcertos}%
//           </div>
//         </div>
//       );
//     } else if (this.state.porcentagemAcertos <= 80) {
//       div = (
//         <div className="progress" style={{ width: "50%" }}>
//           <div
//             className="progress-bar"
//             role="progressbar"
//             style={{ width: "70%" }}
//             aria-valuenow="25"
//             aria-valuemin="0"
//             aria-valuemax="100"
//           >
//             {this.state.porcentagemAcertos}%
//           </div>
//         </div>
//       );
//     } else {
//       div = (
//         <div className="progress" style={{ width: "50%" }}>
//           <div
//             className="progress-bar"
//             role="progressbar"
//             style={{ width: "100%" }}
//             aria-valuenow="25"
//             aria-valuemin="0"
//             aria-valuemax="100"
//           >
//             {this.state.porcentagemAcertos}%
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div className="card-aprenda">
//         <div className="card-aprenda-top">
//           <div className="aprenda-icon">
//             <a href="#">
//               <i className="fas fa-lightbulb"></i>
//             </a>
//           </div>
//           <div className="aprenda-titulo">
//             <h3>Algoritmos 1</h3>
//             <p>{this.props.tituloCurso}Total de Questões Respondidas</p>
//             {div}
//           </div>
//           <div className="btn-continuar">
//             <Link to="/cursos">Continuar Aprendendo</Link>
//           </div>
//         </div>
//         <div className="card-aprenda-bottom">
//           {/* <div className="card-text">
//                         <p className="cd_title">Domina esse assunto?</p>
//                         <p className="cd_subtitle">Faça uma avaliação para verificar seu nível de conhecimento</p>
//                     </div> */}
//           {/* <div className="btn-avaliar">Avalie</div> */}
//         </div>
//       </div>
//     );
//   }
// }
