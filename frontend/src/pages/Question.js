import React, { Component, Button, Fragment } from 'react';
import jwt_decode from 'jwt-decode';
import '../css/Question.css';
//import imgQuestion from "../images/online_course_programming.jpg"
import api from '../services/api';
import jwt from 'jsonwebtoken';
import Navbar from './components/Navbar';
import Spinner from './components/Spinner';
import Alert from './components/Alert';
import GoBackButton from './components/BotaoVoltar';
import DojoImg from '../images/dojo-img.png';

import {
  Accordion,
  AccordionCollapse,
  AccordionToggle,
  Card,
} from 'react-bootstrap';
import iconDuvida from '../images/icons8-question-mark-32.png';
import iconListaDuvidas from '../images/icons8-bulleted-list-24.png';
import { Link } from 'react-router-dom';

export default class Question extends Component {
  constructor() {
    super();
    this.state = {
      userId: this.getUserId(),
      questoes: [],
      loading: true,
      curso: {},
      turma: {},
      conceitos: [],
      conteudos: [],
      categorias: [],
      dificuldades: [],
      situacoes: [],
      conceito: 0,
      categoria: 0,
      dificuldade: 0,
      situacao: 0,
      filtroQuestoes: [],
      alerts: [],
      flagActive: [],
      userGroup: this.getUserGroup(),
      allDojos: [],
      dojoId: this.getDojoId(),
      dojoName: '',
      dojo: {},
      questaoDojo: [],
      flagHasUpdated: false,
      questoesDojo: [],
      flagHasFound: false,
      piloto: 0,
      situacaoQuestoesEstiloCacabugs:[],
      teoriasConcluidas:[],
    };
    this.onChange = this.onChange.bind(this);
    this.getUserId = this.getUserId.bind(this);
    this.showAlert = this.showAlert.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
    this.getUserGroup = this.getUserGroup.bind(this);
    this.getDojoQuestions = this.getDojoQuestions.bind(this);
  }

  getDojoQuestions() {
    const questoes = this.state.questoesDojo;

    let lista = {};
    let retorno = [];
    const arrayConceitos = this.state.conceitos;
    for (let i in questoes) {
      // if (arrayConceitos)
      let conceito = questoes[i].conceito;

      if (typeof lista[conceito] == 'undefined' || lista[conceito] == null) {
        lista[conceito] = [];
      }

      let situacaoStyle = 'qbox-content1 m-b-sm pb-3 mb-0 small lh-125';
      if (questoes[i].situacao_id >= 1 && questoes[i].situacao_id <= 3) {
        situacaoStyle = `qbox-content${questoes[i].situacao_id} m-b-sm pb-3 mb-0 small lh-125`;
      }
      if (questoes[i].categoria_id===4 && questoes[i].situacao_id >= 1 && questoes[i].situacao_id <= 3) {
        situacaoStyle = `qbox-content${questoes[i].situacao_id}-cacabugs m-b-sm pb-3 mb-0 small lh-125`;
      }

      /** alterar icon para situação */
      let categoria = [];
      const nomeClasses = [
        'far fa-money-bill-alt fa-lg',
        'far fa-flag fa-lg',
        'far fa-clock fa-lg',
        'fa-solid fa-bug-slash'
      ];
      if (questoes[i].categoria_id >= 1 && questoes[i].categoria_id <= 4) {
        var symbolStyle;
        if(questoes[i].categoria_id===4){
          symbolStyle={ color: '#9FA2A3',fontSize:'15px'}
        }
        else{
          symbolStyle={ color: 'grey' }
        }
        categoria.push(
          <i
            key={i}
            className={`${nomeClasses[questoes[i].categoria_id - 1]}`}
            style={symbolStyle}
            title="Caça-Bugs"
          ></i>
        );
      }

      let progress = [];
      function progress_width() {
        if (questoes[i].dificuldade_id === 1) {
          return 10;
        } else if (
          questoes[i].dificuldade_id > 1 &&
          questoes[i].dificuldade_id <= 5
        ) {
          return (questoes[i].dificuldade_id - 1) * 25;
        }
      }
      if (questoes[i].dificuldade_id >= 1 && questoes[i].dificuldade_id <= 5) {
        progress.push(
          <div
            key={'progress-' + i}
            title={`Dificuldade: ${questoes[i].dificuldade_id}/5`}
            className='progress'
            style={{ height: '10px', backgroundColor: 'rgb(200,200,200)' }}
          >
            <div
              className={`progress-bar progress-bar-striped dificuldade-${questoes[i].dificuldade_id}`}
              role='progressbar'
              style={{ width: `${progress_width()}%` }}
              aria-valuenow={`${progress_width}`}
              aria-valuemin='0'
              aria-valuemax='100'
            ></div>
          </div>
        );
      }
      lista[conceito].push(
        <div
          className={situacaoStyle}
          key={'qt-dojo-' + i}
          //onClick={(e) => this.goAnswer(e, questoes[i].id, questoes[i].titulo)}
        >
          <div className='row'>
            <div
              className='col-10 align-self-center'
              onClick={(e) =>
                this.goAnswerDojo(e, questoes[i].id, questoes[i].titulo)
              }
            >
              <strong className='d-block text-gray-dark'>
                {questoes[i].titulo}
              </strong>
              {questoes[i].resumo}
            </div>
            <div
            className='col-1 align-self-center text-center'
              style={{ width: '20px' }}
            >
              <Link
                to={{
                  pathname: `/${this.state.curso.id}/${this.state.turma.id}/${questoes[i].id}/criarPost`,
                  state: {
                    cursoId: this.state.curso.id,
                    turmaId: this.state.turma.id,
                    questId: questoes[i].id,
                    piloto: this.state.piloto,
                  },
                }}
              >
                <img
                  src={iconDuvida}
                  alt='?'
                  title='Submeter dúvida'
                  style={{
                    width: '20px',
                  }} /*onClick={(e) => this.submitDoubt(e, questoes[i].id)}*/
                ></img>
              </Link>
            </div>
            <div
              className='col-1 align-self-center text-center'
              style={{ width: '20px' }}
            >
              <Link
                to={{
                  pathname: `/${this.state.curso.id}/${this.state.turma.id}/${questoes[i].id}/duvidas`,
                  state: {
                    cursoId: this.state.curso.id,
                    turmaId: this.state.turma.id,
                    questId: questoes[i].id,
                    menu: false,
                    piloto: this.state.piloto,
                  },
                }}
              >
                <img
                  src={iconListaDuvidas}
                  alt=''
                  title='Listar dúvidas nesta questão'
                  style={{
                    width: '20px',
                  }} /*onClick={(e) => this.listDoubts(e, questoes[i].id)}*/
                ></img>
              </Link>
            </div>
            <div className='col-1 align-self-center text-center'>
              {categoria}
            </div>
            <div className='col-1 align-self-center text-center'>
              {progress}
            </div>
            <div
              style={{ height: '18px' }}
              className='col-10 align-self-center'
              onClick={(e) =>
                this.goAnswerDojo(e, questoes[i].id, questoes[i].titulo)
              }
            ></div>
          </div>
        </div>
      );
    }

    let conceitoWithFlag = [];
    for (var conceito in lista) {
      var flagActive = 1;
      for (let i in arrayConceitos) {
        if (arrayConceitos[i].descricao_conceito == conceito) {
          if (arrayConceitos[i].flagActive == '0') {
            flagActive = 0;
          }
        }
      }
      conceitoWithFlag.push(conceito);
      conceitoWithFlag.push(flagActive);
      conceito = [conceito, flagActive];

      retorno.push(
        <Accordion
          key={this.state.dojo.id}
          defaultActiveKey='1'
        >
          <Card className='qbox shadow-sm rounded'>
            <Card.Header>
              <AccordionToggle
                as={Button}
                variant='link'
                eventKey='0'
              >
                <div
                  className='qbox-title'
                  id='dojo'
                >
                  <img
                    src={DojoImg}
                    style={{
                      width: '30px',
                      height: '30px',
                    }}
                    className='rounded-circle'
                  />
                  <h4>Coding Dojo</h4>
                  <i
                    className={
                      this.state.dojo.flagAtivo !== 1
                        ? 'fa fa-lock'
                        : 'fa fa-unlock'
                    }
                  ></i>
                </div>
              </AccordionToggle>
            </Card.Header>

            {flagActive !== 0 ? (
              <AccordionCollapse eventKey='0'>
                <Card.Body>
                  {lista[conceito[0]]}
                  <div className='qbox-footer'></div>
                </Card.Body>
              </AccordionCollapse>
            ) : (
              <></>
            )}
          </Card>
        </Accordion>
      );
    }
    conceitoWithFlag = [];
    return retorno;
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
    // this.getUserGroup();
    api
      .post('/log/userLog', {
        logMessage: `Usuário ${
          this.state.userId
        } acessou a página de questões -  ${new Date(
          Date.now()
        ).toISOString()}\n`,
        userId: this.state.userId,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        // console.log(err);
      });

    const idCurso = jwt_decode(this.props.match.params.idCurso);
    const idTurma = jwt_decode(this.props.match.params.idTurma);

    api
      .get(`/userGroup/${this.state.userId}`)
      .then((response) => {
        // console.log(response.data[0].grupo);
        this.setState({
          userGroup: response.data[0].grupo,
        });
      })
      .catch((err) => {
        this.showAlert('Erro ao carregadar grupo do usuário', 'error');
      });

    api
      .get(`course/${idCurso}`)
      .then((res) => {
        const objetoCurso = res.data;
        this.setState({ curso: objetoCurso });
      })
      .catch((err) => {
        this.showAlert('Erro ao carregar dados do curso', 'error');
      });

    api
      .get(`class/${idTurma}`)
      .then((res) => {
        const turma = res.data;
        //console.log(turma)
        this.setState({ turma: turma });
      })
      .catch((err) => {
        this.showAlert('Erro ao carregar dados da turma', 'error');
      });
    const headers = {
      course: idCurso,
      conceito: this.state.conceito,
      dificuldade: this.state.dificuldade,
      categoria: this.state.categoria,
      situacao: this.state.situacao,
      user: this.state.userId,
      group: this.state.userGroup,
    };
    // console.log(headers);
    api
      .get('questions', {
        headers: {
          course: idCurso,
          conceito: this.state.conceito,
          dificuldade: this.state.dificuldade,
          categoria: this.state.categoria,
          situacao: this.state.situacao,
          user: this.state.userId,
          group: this.state.userGroup,
        },
      })
      .then((res) => {
        const questoes = res.data;
        // console.log(questoes);
        this.setState({ questoes: questoes, loading: false });
      })
      .catch((err) => {
        this.showAlert('Erro ao carregar dados das questões', 'error');
      });

    api
      .get('/contents', {
        headers: {
          course: idCurso,
          conceito: this.state.conceito,
          user: this.state.userId,
        },
      })
      .then((res) => {
        const conteudos = res.data;
        this.setState({ conteudos: conteudos, loading: false });
      })
      .catch((err) => {
        this.showAlert(
          'Erro ao carregar dados dos conteúdos teóricos.',
          'error'
        );
      });

    api
      .get('/concepts')
      .then((response) => {
        // console.log(response.data);
        this.setState({ flagActive: response.flagActive });
        // console.log(this.state);
        return response.data.map((conceito) => ({
          id_conceito: `${conceito.id}`,
          descricao_conceito: `${conceito.descricao}`,
          flagActive: `${conceito.flagActive}`,
        }));
      })
      .then((conceitos) => {
        this.setState({
          conceitos,
        });
        // console.log(this.state.conceitos);
      });

    api
      .get('/categories')
      .then((response) => {
        return response.data.map((categoria) => ({
          id: `${categoria.id}`,
          descricao: `${categoria.descricao}`,
        }));
      })
      .then((categorias) => {
        this.setState({
          categorias,
        });
      });

    api
      .get('/dificulties')
      .then((response) => {
        return response.data.map((dificuldade) => ({
          id: `${dificuldade.id}`,
          descricao: `${dificuldade.descricao}`,
        }));
      })
      .then((dificuldades) => {
        this.setState({
          dificuldades,
        });
      });
    api
      .get('/coding-dojo')
      .then((response) => {
        const lastDojo = response.data.data[response.data.data.length - 1];
        this.setState({
          allDojos: response.data.data,
          piloto: lastDojo.piloto,
        });
      })
      .catch((err) => {
        console.log(err);
        this.showAlert('Erro ao carregar dados dos Dojos', 'error');
      });

    this.getDojoQuestions();
    this.getDojoId();

    api
    .get(`/situacaoQuestoesEstiloCacabugs/${this.getUserId()}`)
    .then((res)=>{
      this.setState({situacaoQuestoesEstiloCacabugs:res.data});
      // console.log(res.data);
    })
    .catch((err) => {
        console.log(err);
        // this.showAlert('Erro ao carregar dados dos Dojos', 'error');
      });

    api
					.get(`/theory_manager/${this.getUserId()}/getAllReadingCompletionDate`)
					.then((conclusao) => {
            // console.log(conclusao.data);
						// if(conclusao.dt_conclusao) {
							this.setState({
								teoriasConcluidas: conclusao.data
							});
						// }
					})
          .catch((error) => {
            console.log(error);
						this.showAlert(
							'Ocorreu um erro inesperado. Por favor, entre em contato com o administrador do sistema.',
							'error'
						);
					});
  }

  componentDidUpdate() {
    if (this.state.flagHasFound === false) {
      let dojoId = this.state.dojoId;
      let listaAux = [];
      this.getDojoQuestions();
      // console.log("Dojo pilot", this.state.piloto);
      if (dojoId && this.state.flagHasFound === false) {
        api
          .get(`/question-dojo`, { headers: { dojoId } })
          .then((response) => {
            listaAux = response.data.data;
            // console.log(response, 'eai');
            this.setState({
              questoesDojo: response.data.data,
              flagHasFound: true,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        console.log();
      }
      let questoes = [];

      for (let i in this.state.questoesDojo) {
        let flag = false;
        // console.log(i, "eai doidao");
        api
          .get(`/question/${this.state.questoesDojo[i].questao_id}`)
          .then((res) => {
            // console.log(res, "Oi, eu to no res ");
            questoes = res.data;
            // console.log(res.data, "Entrei no then do question dojo ");
            // o problema ta aqui:
            // i dont wanna repetead values in the list

            if (this.state.questaoDojo.length > 0) {
              for (let j in this.state.questaoDojo) {
                if (this.state.questaoDojo[j].titulo === questoes.titulo) {
                  // console.log("Achei uma repetida");
                  flag = true;
                } else {
                  this.state.questaoDojo.push(questoes);
                }
              }
            } else {
              let aux = [];
              this.state.questaoDojo.push(questoes);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }

  getUserId() {
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);
    this.setState({
      userGroup: localStorage.userGroup,
    });
    return decoded.id;
  }

  getUserGroup() {
    const token = localStorage.userGroup;
    // const decoded = jwt_decode(token);
    this.setState({
      userGroup: localStorage.userGroup,
    });
    // console.log(token);
    return token;
  }

  getDojoId() {
    let res;
    try {
      // show actives dojos
      api
        .get(`/dojosAvaliables`)
        .then((res) => {
          res = res.data[0];
          this.setState({ dojoId: res.id });
        })

        .catch((err) => {
          console.log(err);
        });
    } catch (e) {
      console.log(e);
    }
  }

  viewContent(e, id, teoriaId) {
    e.preventDefault();

    const idConceito = jwt.sign(id, localStorage.usertoken);
    teoriaId = jwt.sign(teoriaId, localStorage.usertoken);

    const idTurma = this.props.match.params.idTurma;

    this.props.history.push(
      `/theory-view/${idTurma}/${idConceito}/${teoriaId}`
    );
  }

  goAnswer(e, questao, titulo) {
    e.preventDefault();

    let data = jwt.sign(questao, localStorage.usertoken);

    //console.log("Criptografado: ", data)
    const idTurma = this.props.match.params.idTurma;
    // console.log(idTurma);
    this.props.history.push('/' + idTurma + '/' + data + '/responder', {
      turma: this.state.turma.nome,
      questao: titulo,
    });
  }

  goAnswerDojo(e, questao, titulo) {
    e.preventDefault();

    let data = jwt.sign(questao, localStorage.usertoken);

    //console.log("Criptografado: ", data)
    const idTurma = this.props.match.params.idTurma;
    // console.log(idTurma);
    this.props.history.push('/' + idTurma + '/' + data + '/responderDojo', {
      turma: this.state.turma.nome,
      questao: titulo,
      piloto: this.state.piloto,
      dojoId: this.state.dojoId,
    });
  }

  goAnswerCacabugs(e, questao, titulo) {
    e.preventDefault();

    let data = jwt.sign(questao, localStorage.usertoken);

    //console.log("Criptografado: ", data)
    const idTurma = this.props.match.params.idTurma;
    // console.log(idTurma);
    this.props.history.push('/' + idTurma + '/' + data + '/responder', {
      turma: this.state.turma.nome,
      questao: titulo,
    });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit = (e) => {
    e.preventDefault();

    this.setState({ loading: true });

    api
      .get('questions', {
        headers: {
          course: this.state.curso.id,
          conceito: this.state.conceito,
          dificuldade: this.state.dificuldade,
          categoria: this.state.categoria,
          situacao: this.state.situacao,
          user: this.state.userId,
        },
      })
      .then((res) => {
        // console.log(res);
        const questoes = res.data;
        questoes.sort();
        this.setState({ questoes: questoes, loading: false });
      })
      .catch((err) => {
        this.showAlert('Erro ao carregar dados das questões', 'error');
      });
  };

  getHtmlQuestoes() {
    const questoes = this.state.questoes;

    let lista = {};
    let conteudo = {};

    let retorno = [];
    const arrayConceitos = this.state.conceitos;

    const arrayConteudos = this.state.conteudos;

    const teoriasConcluidas=this.state.teoriasConcluidas;
    
    Object.keys(arrayConteudos).forEach(
      function (key) {
        let idConceito = arrayConteudos[key].conceito_id;
        let descricaoConceito = arrayConteudos[key].conceito;
        if (
          typeof conteudo[descricaoConceito] == 'undefined' ||
          conteudo[descricaoConceito] == null
          ) {
            conteudo[descricaoConceito] = [];
          }
          
          // console.log(arrayConteudos);
          
          function theoryStyle(teoriasConcluidas){
            for(var iterationTheoryStyle=0;iterationTheoryStyle<teoriasConcluidas.length;iterationTheoryStyle++){
              if(teoriasConcluidas[iterationTheoryStyle].id_teoria===arrayConteudos[key].id){
                return 2;
              }
            }
            return 1;
          }
        conteudo[descricaoConceito].push(
          <div
            className={`qbox-content${theoryStyle(teoriasConcluidas)} m-b-sm pb-3 mb-0 small lh-125`}
            onClick={(e) =>
              this.viewContent(e, idConceito, arrayConteudos[key].id)
            }
            key={'aaaa' + idConceito}
          >
            <div className='practice-icon'>
              <a>
                <i className='fa-solid fa-file-lines'></i>
              </a>
            </div>
            <div className='row'>
              <div className='col-10 align-self-center'>
                <strong className='d-block text-gray-dark'>
                  Conteúdo teórico
                </strong>
                Acesse o material de {descricaoConceito}.
              </div>
            </div>
          </div>
        );
      }.bind(this)
    );


    //QUESTÕES ESTILO TRADICIONAL
    for (let i in questoes) {
      if(questoes[i].categoria_id>=1 && questoes[i].categoria_id<=3){
      // if (arrayConceitos)
      let conceito = questoes[i].conceito;

      if (typeof lista[conceito] == 'undefined' || lista[conceito] == null) {
        lista[conceito] = [];
      }

      let situacaoStyle = '';
      if (questoes[i].situacao_id >= 1 && questoes[i].situacao_id <= 3) {
        situacaoStyle = `qbox-content${questoes[i].situacao_id} m-b-sm pb-3 mb-0 small lh-125`;
      }
      if (questoes[i].categoria_id===4 && questoes[i].situacao_id >= 1 && questoes[i].situacao_id <= 3) {
        situacaoStyle = `qbox-content${questoes[i].situacao_id}-cacabugs m-b-sm pb-3 mb-0 small lh-125`;
      }

      /** alterar icon para situação */
      let categoria = [];
      const nomeClasses = [
        'far fa-money-bill-alt fa-lg',
        'far fa-flag fa-lg',
        'far fa-clock fa-lg',
        'fa-solid fa-bug-slash'
      ];
      if (questoes[i].categoria_id >= 1 && questoes[i].categoria_id <= 4) {
        var symbolStyle;
        if(questoes[i].categoria_id===4){
          symbolStyle={ color: '#9FA2A3',fontSize:'15px'}
        }
        else{
          symbolStyle={ color: 'grey' }
        }

        categoria.push(
          <i
            key={i}
            className={`${nomeClasses[questoes[i].categoria_id - 1]}`}
            style={symbolStyle}
            title="Caça-Bugs"
          ></i>
        );
      }

      let progress = [];
      function progress_width() {
        if (questoes[i].dificuldade_id === 1) {
          return 10;
        } else if (
          questoes[i].dificuldade_id > 1 &&
          questoes[i].dificuldade_id <= 5
        ) {
          return (questoes[i].dificuldade_id - 1) * 25;
        }
      }
      if (questoes[i].dificuldade_id >= 1 && questoes[i].dificuldade_id <= 5) {
        progress.push(
          <div
            key={i}
            title={`Dificuldade: ${questoes[i].dificuldade_id}/5`}
            className='progress'
            style={{ height: '10px', backgroundColor: 'rgb(200,200,200)' }}
          >
            <div
              className={`progress-bar progress-bar-striped dificuldade-${questoes[i].dificuldade_id}`}
              role='progressbar'
              style={{ width: `${progress_width()}%` }}
              aria-valuenow={`${progress_width}`}
              aria-valuemin='0'
              aria-valuemax='100'
            ></div>
          </div>
        );
      }
      lista[conceito].push(
        <div
          className={situacaoStyle}
          key={i + 'bbbb' + conceito}
          //onClick={(e) => this.goAnswer(e, questoes[i].id, questoes[i].titulo)}
        >
          <div className='practice-icon'>
            <a>
              <i className='fas fa-code'></i>
            </a>
          </div>
          <div
            className='row'
            onClick={(e) =>
              this.goAnswer(e, questoes[i].id, questoes[i].titulo)
            }
          >
            <div className='col-10 align-self-center'>
              <strong className='d-block text-gray-dark'>
                {questoes[i].titulo}
              </strong>
              {questoes[i].resumo}
            </div>
            <div
              className='col-1 align-self-center text-center'
              style={{ width: '20px' }}
            >
              <Link
                to={{
                  pathname: `/${this.state.curso.id}/${this.state.turma.id}/${questoes[i].id}/criarPost`,
                  state: {
                    cursoId: this.state.curso.id,
                    turmaId: this.state.turma.id,
                    questId: questoes[i].id,
                  },
                }}
              >
                <img
                  src={iconDuvida}
                  alt='?'
                  title='Submeter dúvida'
                  style={{
                    width: '20px',
                  }} /*onClick={(e) => this.submitDoubt(e, questoes[i].id)}*/
                ></img>
              </Link>
            </div>
            <div
              className='col-1 align-self-center text-center'
              style={{ width: '20px' }}
            >
              <Link
                to={{
                  pathname: `/${this.state.curso.id}/${this.state.turma.id}/${questoes[i].id}/duvidas`,
                  state: {
                    cursoId: this.state.curso.id,
                    turmaId: this.state.turma.id,
                    questId: questoes[i].id,
                    menu: false,
                  },
                }}
              >
                <img
                  src={iconListaDuvidas}
                  alt=''
                  title='Listar dúvidas nesta questão'
                  style={{
                    width: '20px',
                  }} /*onClick={(e) => this.listDoubts(e, questoes[i].id)}*/
                ></img>
              </Link>
            </div>
            <div className='col-1 align-self-center text-center'>
              {categoria}
            </div>
            <div className='col-2 align-self-center text-center'>
              {progress}
            </div>
            <div
              style={{ height: "18px",padding:"auto" }}
              className="col-9 align-self-center"
              onClick={(e) =>
                this.goAnswer(e, questoes[i].id, questoes[i].titulo)
              }
            ></div>
          </div>
        </div>
      );
                }
    }

    //QUESTÕES ESTILO CAÇABUGS
    for (let i in questoes) {
      if(questoes[i].categoria_id===4){
      // if (arrayConceitos)
      let conceito = questoes[i].conceito;

      if (typeof lista[conceito] == 'undefined' || lista[conceito] == null) {
        lista[conceito] = [];
      }
      
      function situacaoStyleQuestaoEstiloCacabugs(situacaoQuestoesEstiloCacabugs){
        for(var a=0;a<situacaoQuestoesEstiloCacabugs.length;a++){
          if (situacaoQuestoesEstiloCacabugs[a].questao_id===questoes[i].id && situacaoQuestoesEstiloCacabugs[a].tipo_resultado_id===1){
            return 2;
          }
        }
        for(var b=0;b<situacaoQuestoesEstiloCacabugs.length;b++){
          if (situacaoQuestoesEstiloCacabugs[b].questao_id===questoes[i].id && situacaoQuestoesEstiloCacabugs[b].tipo_resultado_id===2){
            return 3;
          }
        }
        return 1;
      }

      let situacaoStyle = '';
      if (situacaoStyleQuestaoEstiloCacabugs(this.state.situacaoQuestoesEstiloCacabugs) >= 1 && situacaoStyleQuestaoEstiloCacabugs(this.state.situacaoQuestoesEstiloCacabugs) <= 3) {
        situacaoStyle = `qbox-content${situacaoStyleQuestaoEstiloCacabugs(this.state.situacaoQuestoesEstiloCacabugs)} m-b-sm pb-3 mb-0 small lh-125`;
      }
      let progress = [];
      function progress_width() {
        if (questoes[i].dificuldade_id === 1) {
          return 10;
        } else if (
          questoes[i].dificuldade_id > 1 &&
          questoes[i].dificuldade_id <= 5
        ) {
          return (questoes[i].dificuldade_id - 1) * 25;
        }
      }
      if (questoes[i].dificuldade_id >= 1 && questoes[i].dificuldade_id <= 5) {
        progress.push(
          <div
            key={i}
            title={`Dificuldade: ${questoes[i].dificuldade_id}/5`}
            className='progress'
            style={{ height: '10px', backgroundColor: 'rgb(200,200,200)' }}
          >
            <div
              className={`progress-bar progress-bar-striped dificuldade-${questoes[i].dificuldade_id}`}
              role='progressbar'
              style={{ width: `${progress_width()}%` }}
              aria-valuenow={`${progress_width}`}
              aria-valuemin='0'
              aria-valuemax='100'
            ></div>
          </div>
        );
      }
      
      lista[conceito].push(
        <div
          className={situacaoStyle}
          key={i + 'bbbb' + conceito}
          //onClick={(e) => this.goAnswer(e, questoes[i].id, questoes[i].titulo)}
        >
          <div className='practice-icon'>
            <a>
              <i className='fa-solid fa-bug-slash' style={{color:"#ffffff"}}></i>
            </a>
          </div>
          <div
            className='row'
          >
            <div className='col-10 align-self-center'
            onClick={(e) =>
              this.goAnswer(e, questoes[i].id, questoes[i].titulo)
            }
            >
              <strong className='d-block text-gray-dark'>
                {questoes[i].titulo}
              </strong>
              {questoes[i].resumo}
            </div>
            <div
              className='col-1 align-self-center text-center'
              style={{ width: '20px' }}
            >
              <Link
                to={{
                  pathname: `/${this.state.curso.id}/${this.state.turma.id}/${questoes[i].id}/criarPost`,
                  state: {
                    cursoId: this.state.curso.id,
                    turmaId: this.state.turma.id,
                    questId: questoes[i].id,
                  },
                }}
              >
                <img
                  src={iconDuvida}
                  alt='?'
                  title='Submeter dúvida'
                  style={{
                    width: '20px',
                  }} /*onClick={(e) => this.submitDoubt(e, questoes[i].id)}*/
                ></img>
              </Link>
            </div>
            <div
              className='col-1 align-self-center text-center'
              style={{ width: '20px' }}
            >
              <Link
                to={{
                  pathname: `/${this.state.curso.id}/${this.state.turma.id}/${questoes[i].id}/duvidas`,
                  state: {
                    cursoId: this.state.curso.id,
                    turmaId: this.state.turma.id,
                    questId: questoes[i].id,
                    menu: false,
                  },
                }}
              >
                <img
                  src={iconListaDuvidas}
                  alt=''
                  title='Listar dúvidas nesta questão'
                  style={{
                    width: '20px',
                  }} /*onClick={(e) => this.listDoubts(e, questoes[i].id)}*/
                ></img>
              </Link>
            </div>
            <div className='col-1 align-self-center text-center'>
            <i
            key={i}
            className='fa-solid fa-bug-slash'
            style={{ color: 'grey', fontSize:"15px"}}
          ></i>
            </div>
            <div className='col-2 align-self-center text-center'>
              {progress}
            </div>
            <div
              style={{ height: "18px",padding:"auto" }}
              className="col-9 align-self-center"
              onClick={(e) =>
                this.goAnswer(e, questoes[i].id, questoes[i].titulo)
              }
            ></div>
          </div>
        </div>
      );
                }
    }

    let conceitoWithFlag = [];
    for (var conceito in lista) {
      var flagActive = 1;
      for (let i in arrayConceitos) {
        if (arrayConceitos[i].descricao_conceito == conceito) {
          if (arrayConceitos[i].flagActive == '0') {
            // console.log(arrayConceitos[i].flagActive);
            flagActive = 0;
            // console.log("bloqueei o conceito", arrayConceitos[i]);
          } else {
            // console.log(" nao bloqueei o conceito", arrayConceitos[i]);
          }
        }
        // console.log(arrayConceitos[i].descricao_conceito);
      }
      conceitoWithFlag.push(conceito);
      conceitoWithFlag.push(flagActive);
      conceito = [conceito, flagActive];

      retorno.push(
        <Accordion
          key={conceito}
          defaultActiveKey='1'
        >
          <Card className='qbox shadow-sm rounded'>
            <Card.Header>
              <AccordionToggle
                as={Button}
                variant='link'
                eventKey='0'
              >
                <div className='qbox-title'>
                  <h4>{conceito[0]}</h4>
                  <i
                    className={flagActive !== 1 ? 'fa fa-lock' : 'fa fa-unlock'}
                  ></i>
                </div>
              </AccordionToggle>
            </Card.Header>

            {flagActive !== 0 ? (
              <AccordionCollapse eventKey='0'>
                <Card.Body>
                  {conteudo[conceito[0]]}
                  {lista[conceito[0]]}
                  <div className='qbox-footer'></div>
                </Card.Body>
              </AccordionCollapse>
            ) : (
              <></>
            )}
          </Card>
        </Accordion>
      );
    }
    conceitoWithFlag = [];
    return retorno;
  }

  submitDoubt(e, idQuestao) {
    e.preventDefault();
    let data = jwt.sign(idQuestao, this.state.userId.toString());

    //console.log("Criptografado: ", data)

    const idCurso = this.props.match.params.idCurso;
    const idTurma = this.props.match.params.idTurma;

    this.props.history.push(`/${idCurso}/${idTurma}/${data}/criarPost`);
  }

  /*listDoubts(e, idQuestao) {
    e.preventDefault()
    let data = jwt.sign(idQuestao, this.state.userId.toString())

    //console.log("Criptografado: ", data)

    const idCurso = this.props.match.params.idCurso
    const idTurma = this.props.match.params.idTurma

    this.props.history.push(`/${idCurso}/${idTurma}/${data}/duvidas`)
  }*/

  render() {
    if (this.state.loading) {
      return <Spinner />;
    }

    const questoes = this.getHtmlQuestoes();
    const dojo = this.state.dojo;
    const questaoDojo = this.getDojoQuestions();

    const dojoReturn = questaoDojo;
    // const dojoReturn = (
    //   <>
    //     <Accordion key={this.state.dojo.id} defaultActiveKey="1">
    //       <Card className="qbox shadow-sm rounded">
    //         <Card.Header>
    //           <AccordionToggle as={Button} variant="link" eventKey="0">
    //             <div className="qbox-title" id="dojo">
    //               <img
    //                 src={DojoImg}
    //                 style={{
    //                   width: "30px",
    //                   height: "30px",
    //                 }}
    //                 className="rounded-circle"
    //               />
    //               <h4>Coding Dojo</h4>
    //               <i
    //                 className={
    //                   this.state.dojo.flagAtivo !== 1
    //                     ? "fa fa-lock"
    //                     : "fa fa-unlock"
    //                 }
    //               ></i>
    //             </div>
    //           </AccordionToggle>
    //         </Card.Header>

    //         {this.state.dojo.flagAtivo !== 0 ? (
    //           <AccordionCollapse eventKey="0">
    //             <Card.Body>
    //               {/* {this.state.questoesDojo} */}
    //               {questaoDojo}
    //               <div className="qbox-footer"></div>
    //             </Card.Body>
    //           </AccordionCollapse>
    //         ) : (
    //           <></>
    //         )}
    //       </Card>
    //     </Accordion>
    //   </>
    // );

    const retorno = (
      <React.Fragment>
        <div className='fundo-bg fundo-gray' />
        <section className='jumbotron text-left question-hero'>
          <div className='container'>
            <div className='row'>
              <div className='col'>
                <h6>
                  <button
                    type='button'
                    onClick={() => this.props.history.go(-2)}
                    className='link'
                  >
                    {this.state.curso.nome}
                  </button>{' '}
                  /{' '}
                  <button
                    type='button'
                    onClick={() => this.props.history.go(-1)}
                    className='link'
                  >
                    {this.state.turma.nome}
                  </button>
                </h6>
                <h1>Minhas atividades</h1>
              </div>
            </div>
          </div>
        </section>

        <section className='cosmo-hero'>
          <div className='container'>
            <div className='row'>
              <div className='col'>
                <div className='ibox shadow-sm rounded'>
                  <div className='ibox-title'>
                    <h5>
                      Filtrar <i className='fa fa-filter'></i>
                    </h5>
                  </div>
                  <div className='ibox-content m-b-sm border-bottom'>
                    <form
                      noValidate
                      onSubmit={this.onSubmit}
                      className='form-search'
                    >
                      <div className='row'>
                        <div className='col-3'>
                          <div className='form-group'>
                            <label className='col-form-label'>Conceito:</label>
                            <select
                              id='select-frm-conceito'
                              className='form-control'
                              name='conceito'
                              placeholder='Conceito'
                              value={this.state.conceito}
                              aria-label='Conceito'
                              onChange={this.onChange}
                            >
                              <option
                                key='0'
                                value='0'
                              >
                                Todos
                              </option>
                              {this.state.conceitos.map(function (conceito) {
                                return (
                                  <option
                                    key={conceito.id_conceito}
                                    value={conceito.id_conceito}
                                  >
                                    {conceito.descricao_conceito}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                        <div className='col-3'>
                          <div className='form-group'>
                            <label className='col-form-label'>Categoria:</label>
                            <select
                              id='select-frm-categoria'
                              className='form-control'
                              name='categoria'
                              placeholder='Categoria'
                              value={this.state.categoria}
                              aria-label='Categoria'
                              onChange={this.onChange}
                            >
                              <option
                                key='0'
                                value='0'
                              >
                                Todas
                              </option>
                              {this.state.categorias.map(function (categoria) {
                                return (
                                  <option
                                    key={categoria.id}
                                    value={categoria.id}
                                  >
                                    {categoria.descricao}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                        <div className='col-3'>
                          <div className='form-group'>
                            <label className='col-form-label'>
                              Dificuldade:
                            </label>
                            <select
                              id='select-frm-dificuldade'
                              className='form-control'
                              name='dificuldade'
                              placeholder='Dificuldade'
                              value={this.state.dificuldade}
                              aria-label='Dificuldade'
                              onChange={this.onChange}
                            >
                              <option
                                key='0'
                                value='0'
                              >
                                Todas
                              </option>
                              {this.state.dificuldades.map(function (
                                dificuldade
                              ) {
                                return (
                                  <option
                                    key={dificuldade.id}
                                    value={dificuldade.id}
                                  >
                                    {dificuldade.descricao}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                        <div className='col-3'>
                          <div className='form-group'>
                            <label className='col-form-label'>Situação:</label>
                            <select
                              id='select-frm-situacao'
                              className='form-control'
                              name='situacao'
                              placeholder='Situação'
                              value={this.state.situacao}
                              aria-label='Situação'
                              onChange={this.onChange}
                            >
                              <option
                                key='0'
                                value='0'
                              >
                                Todas
                              </option>
                              <option
                                key='1'
                                title='não resolvi'
                                value='1'
                              >
                                Não resolvi
                              </option>
                              <option
                                key='2'
                                title='acertei'
                                value='2'
                              >
                                Acertei
                              </option>
                              <option
                                key='3'
                                title='errei'
                                value='3'
                              >
                                Errei
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col'>
                          <button className='btn btn-primary btn-sm float-right'>
                            Filtrar
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col'>{questoes}</div>
            </div>
            {/* <div className='row'>
              <div className='col'>
                {questaoDojo.length > 0 ? questaoDojo : dojoReturn}
              </div>
            </div> */}
            {/* descomentar isso para ativar dojo */}
            <GoBackButton />
          </div>
        </section>
      </React.Fragment>
    );

    return (
      <React.Fragment>
        <Navbar />
        <div className='app-body'>{retorno}</div>
        {this.state.alerts.length > 0 ? this.state.alerts[0] : null}
      </React.Fragment>
    );
  }
}
