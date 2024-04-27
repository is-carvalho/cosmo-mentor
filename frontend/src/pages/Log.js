import React, { Component } from 'react';
import '../css/Log.css';
import Spinner from './components/Spinner';
import api from '../services/api';
import Navbar from './components/Navbar';
import jwt_decode from 'jwt-decode';
import Alert from './components/Alert';
import GoBackButton from './components/BotaoVoltar';

export default class Log extends Component {
  state = {
    userId: 0,
    userType: 0,
    turmas: [],
    turma: 0,
    searchList: [
      {
        descricao: 'Alunos',
        colunas: [
          'ID',
          'Nome',
          'Pontos de Experiência',
          'Respostas Corretas',
          'Respostas com Erro de Compilação',
          'Respostas com Erro de Execução',
          'Respostas com Tempo Excedido',
          'Total de Tentativas',
        ],
      },
      {
        descricao: 'Questões',
        colunas: [
          'ID',
          'Status',
          'Título',
          'Criador',
          'Pontos de Experiência',
          'Dificuldade',
          'Categoria',
          'Conceito',
          'Alunos que Acertaram',
          'Alunos com Erro de Compilação',
          'Alunos com Erro de Execução',
          'Alunos com Tempo Excedido',
          'Total de Submissões',
        ],
      },
    ],
    search: 0,
    table: [],
    columns: [],

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
      .get(`/log/allClassByUser`, {
        headers: {
          user: user.id,
        },
      })
      .then((res) => {
        const turmas = res.data;
        //console.log("turmas:" , res.data, user.id)

        let cursosId = [];
        turmas.forEach((turma) => {
          cursosId.push(turma.curso_id);
        });

        this.setState({ turmas, loading: false });

        if (this.state.turmas.length > 0) {
          this.setState({ turma: this.state.turmas[0].id });
          //this.getLogStudents();
        }
      })
      .catch((err) => {
        this.setState({ loading: false });
        this.showAlert('Erro ao carregar dados da turma', 'error');
      });
  }

  getUserData() {
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);
    return { id: decoded.id, type: decoded.tipo };
  }

  onChange(e) {
    //console.log({[e.target.name]: e.target.value})
    this.setState({ [e.target.name]: e.target.value });
  }

  getLogStudents() {
    this.setState({ loading: true });
    api
      .get('/logStudents', {
        headers: {
          turma: this.state.turma,
        },
      })
      .then((res) => {
        this.setState({ loading: false });

        if (res.data.status) {
          this.setState({ table: res.data.result });
        }
      })
      .catch((err) => {
        this.setState({ loading: false });
        this.showAlert('Erro ao carregar dados da tabela', 'error');
      });
  }

  getLogQuestions() {
    this.setState({ loading: true });
    api
      .get('/logQuestions', {
        headers: {
          turma: this.state.turma,
        },
      })
      .then((res) => {
        this.setState({ loading: false });

        if (res.data.status) {
          this.setState({ table: res.data.result });
        }
      })
      .catch((err) => {
        this.setState({ loading: false });
        this.showAlert('Erro ao carregar dados da tabela', 'error');
      });
  }

  search(e) {
    e.preventDefault();
    const columns = this.state.searchList[this.state.search].colunas;
    this.setState({ table: [], columns });

    //console.log(this.state)
    if (this.state.search + '' === '0') {
      this.getLogStudents();
    } else if (this.state.search + '' === '1') {
      this.getLogQuestions();
    }
  }

  getHTMLTable() {
    let nomeCurso = this.state.turmas.find((t) => {
      return t.id + '' === this.state.turma + '';
    });

    let retorno = (
      <React.Fragment>
        <div className='container-log'>
          <div className='table-responsive'>
            <div className='table-wrapper'>
              <div className='table-title'>
                <div className='row'>
                  <div className='col-sm-4'>
                    <h2>
                      Log <b>Turma</b>
                    </h2>
                  </div>
                  {/*<div className="col-sm-8">						
										<a href="#" className="btn btn-primary"><i className="material-icons">&#xE863;</i> <span>Refresh List</span></a>
										<a href="#" className="btn btn-secondary"><i className="material-icons">&#xE24D;</i> <span>Export to Excel</span></a>
									</div>*/}
                </div>
              </div>
              <div className='table-filter-log'>
                <div className='row'>
                  <div className='col-sm-6'>
                    <div className='show-entries-log'>
                      <span>Turma </span>
                      <select
                        id='select-log-turma'
                        className='form-control'
                        name='turma'
                        placeholder='Turma'
                        value={this.state.turma}
                        aria-label='Turma'
                        onChange={(e) => this.onChange(e)}
                      >
                        {this.state.turmas.map(function (turma) {
                          return (
                            <option
                              key={'turma_' + turma.id}
                              value={turma.id}
                            >
                              {turma.nome}
                            </option>
                          );
                        })}
                      </select>
                      <span>Curso: {nomeCurso ? nomeCurso.curso : null}</span>
                    </div>
                  </div>
                  <div className='col-sm-6'>
                    <button
                      type='button'
                      onClick={(e) => this.search(e)}
                      className='btn btn-primary'
                    >
                      <i className='fa fa-search'></i>
                    </button>

                    <div className='filter-group-log'>
                      <label>Buscar por </label>
                      <select
                        id='select-log-search'
                        className='form-control'
                        name='search'
                        placeholder='Search'
                        value={this.state.search}
                        aria-label='Search'
                        onChange={(e) => this.onChange(e)}
                      >
                        {this.state.searchList.map(function (search, index) {
                          return (
                            <option
                              key={'search_' + index}
                              value={index}
                            >
                              {search.descricao}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <span className='filter-icon-log'>
                      <i className='fa fa-filter'></i>
                    </span>
                  </div>
                </div>
              </div>
              <div className='body-table-log'>
                <table className='table table-striped table-hover table-log'>
                  <thead>
                    <tr>
                      {this.state.columns.map(function (coluna, index) {
                        return <th key={'column_' + index}>{coluna}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.table.map(function (t) {
                      let auxRows = [];
                      for (let [key, value] of Object.entries(t)) {
                        auxRows.push(<td key={t.id + '_' + key}>{value}</td>); //console.log(key + ' ' + value);
                      }
                      return <tr key={'table_' + t.id}>{auxRows}</tr>;
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <GoBackButton />
        </div>
      </React.Fragment>
    );

    return retorno;
  }

  render() {
    if (this.state.loading) {
      return <Spinner />;
    }
    /*
		const ret = (
			<React.Fragment>
				<Navbar/>
				<div id="main" className="app-body container-fluid">
					<div className="bootstrap-table bootstrap4">
					</div>
				</div>
				{this.state.alerts.length > 0 ? this.state.alerts[0] : null}
			</React.Fragment>
		)
		*/
    return (
      <React.Fragment>
        <Navbar></Navbar>
        <div className='app-body main-log'>
          <div className='fundo-bg fundo-gray' />
          {this.getHTMLTable()}
        </div>
      </React.Fragment>
    );
  }
}
