import React, { Component, useEffect, useState, useRef } from 'react';
import '../css/TheoryManager.css';
import Spinner from './components/Spinner';
import api from '../services/api';
import Navbar from './components/Navbar';
import { Link } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { Modal } from 'react-bootstrap';
import Alert from './components/Alert';
import GoBackButton from './components/BotaoVoltar';

const jwt = require('jsonwebtoken');


export default class TheoryManager extends Component {

  constructor() {
    super();
    this.state = {
      idQuest: undefined,
      loading: true,
      cursos: [],
      conceitos: [],
      conteudos: [],
      curso: '',
      conceito: '',
      descricao: '',
	  itemSelected: '',
      validation: {
        curso: { wasValidated: false },
        conceito: { wasValidated: false },
      },
      alerts: [],
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.getUserId = this.getUserId.bind(this);
    this.showAlert = this.showAlert.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
  }
  
  handleGoBackButton(e) {
    e.preventDefault();
    console.log('read');
	this.setState({ action: 'read' });
  }
  
  validateField(name, value) {
    let validation = { ...this.state.validation };

    switch (name) {
      case 'curso':
        if (value === '' || !value) {
          validation.curso = {
            hasError: true,
            errorCode: 'EST001',
            errorMessage: "O campo 'curso' deve ser selecionado.",
          };
        } else {
          validation.curso = {
            hasError: false,
          };
        }
        validation.curso.wasValidated = true;
        this.setState((prevState) => ({
          validation: { ...prevState.validation, curso: validation.curso },
        }));
        break;
      case 'conceito':
        //console.log(value)
        if (value === '' || !value) {
          validation.conceito = {
            hasError: true,
            errorCode: 'EST001',
            errorMessage: "O campo 'conceito' deve ser selecionado.",
          };
        } else {
          validation.conceito = {
            hasError: false,
          };
        }
        validation.conceito.wasValidated = true;
        this.setState((prevState) => ({
          validation: {
            ...prevState.validation,
            conceito: validation.conceito,
          },
        }));
        break;
      default:
        break;
    }
  }

	validate() {
		let validation = { ...this.state.validation };

		let wasValidated = true;

		for (var key in validation) {
			if (!validation[key].wasValidated) {
				this.validateField(key, this.state[key]);
				wasValidated = false;
			}
		}

		if (!wasValidated) return false;

		validation = { ...this.state.validation };

		return !(validation.curso.hasError || validation.conceito.hasError);
	}
  
	onChange(e) {
		//e.preventDefault()
		const { name, value } = e.target;

		this.setState({ [name]: value }, () => {
			this.validateField(name, value);
		});
	}

	onSubmit(e) {
		e.preventDefault();

		this.setState({ loading: true });
		if (this.validate()) {
			let formData = new FormData();
			formData.append('user', this.getUserId());
			formData.append('curso', this.state.curso);
			formData.append('conceito', this.state.conceito);
			formData.append('conceito', this.state.descricao);
			formData.append('conteudo', this.state.conteudo);

			this.setState((state, props) => {
				return {
					descricao: formData.append('conceito', this.state.descricao),
				};
			});
			
			this.createConcept(formData);


		} else {
			this.setState({ loading: false });
		}
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
		const user = this.getUserId();
		this.setState({ userId: user.id});

		this.setState({ loading: false });

		api
		.get('/courses')
		.then((response) => {
			return response.data.map((curso) => ({
				id_curso: `${curso.id}`,
				nome_curso: `${curso.nome}`,
			}));
		})
		.then((cursos) => {
			this.setState({
				cursos: cursos,
				loading: false,
			});
		})
		.catch((err) => {
			this.showAlert('Erro ao carregar cursos', 'error');
		});

		api
		.get('/concepts')
		.then((response) => {
			return response.data.map((conceito) => ({
				id_conceito: `${conceito.id}`,
				nome_conceito: `${conceito.descricao}`,
			}));
		})
		.then((conceitos) => {
			this.setState({
				conceitos: conceitos,
				loading: false,
			});
		})
		.catch((err) => {
			this.showAlert('Erro ao carregar conceitos', 'error');
		});

        let cursosId = [];
        cursosId.push(1);
		
    api
      .get('/theory_manager')
      .then((res) => {
        const conteudos = res.data;
        this.setState({ conteudos, loading: false });
      })
      .catch((err) => {
        console.log(err)
        this.showAlert('Erro ao carregar dados de conteúdos teóricos.', 'error');
      });
	}


	getUserId() {
		const token = localStorage.usertoken;
		const decoded = jwt_decode(token);
		return decoded.id;
	}

  closeModal() {
    this.setState({ showModal: false });
  }

  openModal(id, index) {
    const itemSelected = {
      id,
      index,
    };
    this.setState({ showModal: true, itemSelected });
  }

  readItem(e, id) {
    e.preventDefault();

    //let data = jwt.sign(id, localStorage.usertoken);
    
    this.props.history.push(`/theory-detail/${id}`);
  }

  updateItem(e, id) {
    e.preventDefault();

    //let data = jwt.sign(id, localStorage.usertoken);

    this.props.history.push(`/theory-edit/${id}`);
  }

  addItem(e) {
    //e.preventDefault();

   // let data = jwt.sign(id, localStorage.usertoken);

    this.props.history.push(`/theory-add`);
  }

  deleteItem(e) {
    e.preventDefault();

    api
      .delete(`/theory_manager/${this.state.itemSelected.id}`)
      .then((res) => {
        if (res.data.status) {

          this.showAlert('Conteúdo excluído com sucesso.', 'success');

          let conteudos_aux = this.state.conteudos;

          conteudos_aux[this.state.itemSelected.index].status = 1;

          this.setState({ conteudos: conteudos_aux });
          this.closeModal();
        } else {
          this.showAlert(
            'Não foi possível excluir o conteúdo teórico selecionado. Por favor, entre em contato com o administrador do sistema.',
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

    const { validation } = this.state;

    let dataTable = [];
    if(this.state.conteudos instanceof Array){
    this.state.conteudos.forEach((conteudo, index) => {
      let data = new Date(conteudo.updated_at || conteudo.created_at);
      const dia = data.getDate() < 10 ? '0' + data.getDate() : data.getDate();
      const mes =
        data.getMonth() + 1 < 10
          ? '0' + (data.getMonth() + 1).toString()
          : (data.getMonth() + 1).toString();
      const ano = data.getFullYear();
      const dataFormat = dia + '/' + mes + '/' + ano;

      if (conteudo.status === 0 || this.state.userType === 1) {
        dataTable.push(
          <tr key={index}>
            {this.state.userType === 1 ? (
              conteudo.status === 0 ? (
                <td>Ativo</td>
              ) : (
                <td>Inativo</td>
              )
            ) : null}
            <td>{conteudo.curso}</td>
            <td>{conteudo.conceito}</td>
            <td>{conteudo.usuario}</td>
            <td>{dataFormat}</td>
            <td>
              <button
                className='view_action'
                onClick={(e) => this.readItem(e, conteudo.id)}
                title='Visualizar o item selecionado.'
              >
                <i className='fas fa-eye'></i>
              </button>
                  <button
                    className='edit_action'
                    onClick={(e) => this.updateItem(e, conteudo.id)}
                    title='Editar o item selecionado.'
                  >
                    <i className='fas fa-pencil-alt'></i>
                  </button>
                  <button
                    className='delete_action'
                    onClick={(e) => this.openModal(conteudo.id, index)}
                    title='Excluir o item selecionado.'
                  >
                    <i className='fa fa-trash'></i>
                  </button>
            </td>
          </tr>
        );
      }
    });
  }
    let listContents = (
	  <React.Fragment>
		<div className='fundo-bg fundo-gray' />

		<section className='jumbotron text-left item-hero'>
		  <div className='container'>
			<div className='row'>
			  <div className='col'>
				<React.Fragment>
				  <h1>Gerenciar Conteúdo</h1>
				  <h6>
					Possibilita a criação de um conteúdo teórico a um determinado conceito.
				  </h6>
				</React.Fragment>
			  </div>
			</div>
		  </div>
		</section>

		<section className='cosmo-hero'>
			  <div className='container wrapper'>
				<div className='table-responsive'>
				  <div className='table-wrapper'>
					<div className='table-title'>
					  <div className='row'>
						<div className='col-12'>
                <button
					  type='button'
					  onClick={(e) => this.addItem()}
					  className='btn btn-success float-right'
					>   <i className='fas fa-plus'></i> Novo Conteúdo </button>

						</div>

					  </div>


					</div>

					<div className='body-table-item-manager'>
					  <table
						className='table table-striped table-hover table-item-manager'
						cellSpacing='0'
						cellPadding='0'
					  >
						<thead>
						  <tr>
							{this.state.userType === 1 ? <th>Status</th> : null}
							<th>Curso</th>
							<th>Conceito</th>
							<th>Criador</th>
							<th>Data de Criação/Alteração</th>
							<th className='actions'>Ações</th>
						  </tr>
						</thead>
						<tbody>{dataTable}</tbody>
					  </table>
					</div>

          <div className='row'>
						<div className='col-12'>
              <button
              type='button'
              onClick={() => this.props.history.goBack()}
              className='btn btn-danger btn-goback float-right'>
                Voltar
              </button>
					</div>
				</div>
				  </div>
				</div>


				<Modal
				  show={this.state.showModal}
				  onHide={() => this.closeModal()}
				>
				  <Modal.Header closeButton>
					<Modal.Title>Excluir Conteúdo</Modal.Title>
				  </Modal.Header>
				  <Modal.Body>
					Deseja realmente excluir este conteúdo permanentemente?
				  </Modal.Body>
				  <Modal.Footer>
					<button
					  type='button'
					  onClick={(e) => this.deleteItem(e)}
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
		</section>
      </React.Fragment>
    );

    return (
      <React.Fragment>
        <Navbar />
        <div className='app-body'>
          <div className='fundo-bg fundo-gray' />
          {listContents}
        </div>
        {this.state.alerts.length > 0 ? this.state.alerts[0] : null}
      </React.Fragment>
    );
  }
}
