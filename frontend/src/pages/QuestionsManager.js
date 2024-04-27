import React, { Component } from 'react';
import '../css/QuestionManager.css';
import Spinner from './components/Spinner';
import api from '../services/api';
import Navbar from './components/Navbar';
import { Link } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { Modal } from 'react-bootstrap';
import Alert from './components/Alert';
import GoBackButton from "./components/BotaoVoltar";

const jwt = require('jsonwebtoken');

export default class QuestionsManager extends Component {
  state = {
    userId: 0,
    userType: 0,
    questoes: [],
    showModal: false,
    loading: true,
    questionSelected: {
      id: 0,
      index: -1,
    },
    alerts: [],
  };

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
    const user = this.getUserData();
    this.setState({ userId: user.id, userType: user.type });
    api
      .get(`/classesCreatedByUser`, {
        headers: {
          user: user.id,
        },
      })
      .then((res) => {
        const turmas = res.data;
        // console.log("turmas:", res.data, user.id)

        let cursosId = [];
        turmas.forEach((turma) => {
          cursosId.push(turma.curso_id);
        });

        api
          .get('/questions3', {
            headers: {
              course: JSON.stringify(cursosId),
              conceito: 0,
              dificuldade: 0,
              categoria: 0,
              situacao: 0,
              user: user.id,
            },
          })
          .then((res) => {
            const questoes = res.data;
            this.setState({ questoes, loading: false });
            // console.log(questoes)
          })
          .catch((err) => {
            this.showAlert('Erro ao carregar dados das questões', 'error');
          });
      })
      .catch((err) => {
        this.showAlert('Erro ao carregar dados da turma', 'error');
      });
  }

  getUserData() {
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);
    return { id: decoded.id, type: decoded.tipo };
  }

  closeModal() {
    this.setState({ showModal: false });
  }

  openModal(id, index) {
    const questionSelected = {
      id,
      index,
    };
    this.setState({ showModal: true, questionSelected });
  }

  goQuestion(e, id, titulo) {
    e.preventDefault();
    let data = jwt.sign(id, localStorage.usertoken);
    this.props.history.push(`${data}/visualizar`, {
      turma: null,
      questao: titulo,
    });
  }

  updateQuestion(e, id) {
    e.preventDefault();

    let data = jwt.sign(id, localStorage.usertoken);

    this.props.history.push(`${data}/editar`);
  }

  deleteQuestion(e) {
    e.preventDefault();

    api
      .delete(`/question/${this.state.questionSelected.id}`)
      .then((res) => {
        if (res.data.status) {
          //console.log("res:", res.data)
          this.showAlert('Questão excluída com sucesso.', 'success');

          let auxQuestions = this.state.questoes;
          //console.log(this.state.questoes)
          auxQuestions[this.state.questionSelected.index].status = 1;

          this.setState({ questoes: auxQuestions });
          this.closeModal();
        } else {
          this.showAlert(
            'Não foi possível excluir a questão. Por favor, entre em contato com o administrador do sistema.',
            'error'
          );
        }
      })
      .catch((error) => {
        this.showAlert(
          'Ocorreu um erro inesperado. Por favor, entre em contato com o administrador do sistema.',
          'error'
        );
      });
  }

  render() {
    if (this.state.loading) {
      return <Spinner />;
    }

    let dataTable = [];
    console.log(this.state.questoes);
    this.state.questoes.forEach((questao, index) => {
      let data = new Date(questao.updated_at || questao.created_at);
      const dia = data.getDate() < 10 ? '0' + data.getDate() : data.getDate();
      const mes =
        data.getMonth() + 1 < 10
          ? '0' + (data.getMonth() + 1).toString()
          : (data.getMonth() + 1).toString();
      const ano = data.getFullYear();
      const dataFormat = dia + '/' + mes + '/' + ano;

      if (questao.status === 0 || this.state.userType === 1) {
        dataTable.push(
          <tr key={index}>
            {this.state.userType === 1 ? (
              questao.status === 0 ? (
                <td>Ativa</td>
              ) : (
                <td>Excluída</td>
              )
            ) : null}
            <td>{questao.titulo}</td>
            <td>{questao.curso}</td>
            <td>{questao.nome}</td>
            <td>{questao.dificuldade}</td>
            <td>{dataFormat}</td>
            <td className='actions'>
              <button
                className='visualizar-question'
                onClick={(e) => this.goQuestion(e, questao.id, questao.titulo)}
                title='Visualizar questão'
              >
                <i className='fas fa-eye'></i>
              </button>
              {(this.state.userId === questao.usuario_id ||
                this.state.userType === 1) &&
              questao.status === 0 ? (
                <React.Fragment>
                  <button
                    className='editar-question'
                    disabled={
                      !(
                        (this.state.userId === questao.usuario_id ||
                          this.state.userType === 1) &&
                        questao.status === 0
                      )
                    }
                    onClick={(e) => this.updateQuestion(e, questao.id)}
                    title='Editar questão'
                  >
                    <i className='fas fa-pencil-alt'></i>
                  </button>
                  <button
                    className='excluir-question'
                    disabled={
                      !(
                        (this.state.userId === questao.usuario_id ||
                          this.state.userType === 1) &&
                        questao.status === 0
                      )
                    }
                    onClick={(e) => this.openModal(questao.id, index)}
                    title='Excluir questão'
                  >
                    <i className='fa fa-trash'></i>
                  </button>
                </React.Fragment>
              ) : null}
            </td>
          </tr>
        );
      }
    });
    let listQuestions = (
      <div className='container-question-manager'>
        <div className='table-responsive'>
          <div className='table-wrapper'>
            <div className='table-title'>
              <div className='row'>
                <div className='col-sm-7'>
                  <h2>
                    Gerenciador de <b>Questões</b>
                  </h2>
                </div>
                <div className='col-sm-5'>
                  <div className='bs-bars float-right'>
                    <div className='toolbar'>
                      <Link
                        to='/questoes/cadastrar'
                        className='btn btn-success newquestion'
                      >
                        <i className='fas fa-plus'></i> Nova Questão
                      </Link>
                      <Link
                        to='/questoes/cadastrarConceito'
                        className='btn btn-success newconcept'
                      >
                        <i className='fas fa-plus'></i> Novo Conceito
                      </Link>
                      <Link
                        to='/questoes/mudarOrdem'
                        className='btn btn-success neworder'
                      >
                        <i className='fas fa-plus'></i> Nova Ordem
                      </Link>
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
                    {this.state.userType === 1 ? <th>Status</th> : null}
                    <th>Titulo</th>
                    <th>Curso</th>
                    <th>Criador</th>
                    <th>Dificuldade</th>
                    <th>Data de Modificação</th>
                    <th className='actions'>Ações</th>
                  </tr>
                </thead>
                <tbody>{dataTable}</tbody>
              </table>
            </div>
          </div>
        </div>
        <GoBackButton/>

        <Modal
          show={this.state.showModal}
          onHide={() => this.closeModal()}
        >
          <Modal.Header closeButton>
            <Modal.Title>Excluir Questão</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Deseja realmente excluir esta questão permanentemente?
          </Modal.Body>
          <Modal.Footer>
            <button
              type='button'
              onClick={(e) => this.deleteQuestion(e)}
              className='btn btn-primary'
            >
              Sim
            </button>
            <button
              type='button'
              onClick={(e) => this.closeModal()}
              className='btn btn-default'
            >
              Não
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    );

    return (
      <React.Fragment>
        <Navbar />
        <div className='app-body'>
          <div className='fundo-bg fundo-gray' />
          {listQuestions}
        </div>
        {this.state.alerts.length > 0 ? this.state.alerts[0] : null}
      </React.Fragment>
    );
  }
}
