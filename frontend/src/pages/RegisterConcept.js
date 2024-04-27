import React, { Component } from 'react'
//import Wallpaper from "../images/wallpaper.jpg"
import '../css/RegisterQuestion.css'
import Spinner from './components/Spinner'
import Navbar from './components/Navbar'
import api from '../services/api'
import jwt_decode from 'jwt-decode'
import Alert from './components/Alert'


class RegisterConcept extends Component {
	constructor() {
		super();
		this.state = {
			idQuest: undefined,
			loading: true,
			cursos: [],
			conceitos: [],
			curso: '',
			conceito: '',
			descricao: '',
			validation: {
				curso: { wasValidated: false },
				conceito: { wasValidated: false },
			},
			alerts: []
		}
		this.onChange = this.onChange.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
		this.getUserId = this.getUserId.bind(this)
		this.createConcept = this.createConcept.bind(this)
		this.showAlert = this.showAlert.bind(this)
		this.closeAlert = this.closeAlert.bind(this)
	}

	showAlert(msg, status) {
		let alerts = this.state.alerts
		alerts.push(<Alert msg={msg} status={status} hide={this.closeAlert.bind(this)} />)
		this.setState({ alerts: alerts })
	}

	closeAlert() {
		let alerts = this.state.alerts
		alerts.shift()
		this.setState({ alerts: alerts })
	}


	componentDidMount() {
		// let idQuest = this.props.match.params.idQuest

		api.get('/courses').then(response => {
			return response.data.map(curso => ({
				id_curso: `${curso.id}`,
				nome_curso: `${curso.nome}`
			}));
		})
			.then(cursos => {
				this.setState({
					cursos: cursos,
					loading: false
				});
			})
			.catch(err => {
				this.showAlert("Erro ao carregar cursos", "error")
			})

		api.get('/concepts').then(response => {
			return response.data.map(conceito => ({
				id_conceito: `${conceito.id}`,
				nome_conceito: `${conceito.descricao}`
			}));
		})
			.then(conceitos => {
				this.setState({
					conceitos: conceitos,
					loading: false
				});
			})
			.catch(err => {
				this.showAlert("Erro ao carregar conceitos", "error")
			})

	}

	validateField(name, value) {

		let validation = { ...this.state.validation };

		switch (name) {

			case "curso":
				//console.log(value)
				if (value === "" || !value) {
					validation.curso = {
						hasError: true,
						errorCode: 'EST001',
						errorMessage: "O campo 'curso' deve ser selecionado."
					}
				} else {
					validation.curso = {
						hasError: false
					}
				}
				validation.curso.wasValidated = true
				this.setState(prevState => ({ validation: { ...prevState.validation, curso: validation.curso } }))
				break;
			case "conceito":
				//console.log(value)
				if (value === "" || !value) {
					validation.conceito = {
						hasError: true,
						errorCode: 'EST001',
						errorMessage: "O campo 'conceito' deve ser selecionado."
					}
				} else {
					validation.conceito = {
						hasError: false
					}
				}
				validation.conceito.wasValidated = true
				this.setState(prevState => ({ validation: { ...prevState.validation, conceito: validation.conceito } }))
				break;
			default:
				break;
		}

	}

	validate() {

		let validation = { ...this.state.validation };

		let wasValidated = true
		//console.log(validation)
		for (var key in validation) {
			if (!validation[key].wasValidated) {
				this.validateField(key, this.state[key])
				wasValidated = false;
			}
		}

		if (!wasValidated) return false;

		validation = { ...this.state.validation };

		return !(validation.curso.hasError ||
			validation.conceito.hasError)

	}

	onChange(e) {
		//e.preventDefault()

		const { name, value } = e.target

		this.setState(
			{ [name]: value },
			() => { this.validateField(name, value) }
		)
	}

	getUserId() {
		const token = localStorage.usertoken
		const decoded = jwt_decode(token)
		//console.log("decoded.id: ", decoded.id)
		return decoded.id
	}

	createConcept() {
		const concept = {
			curso_id: 1,
			descricao: this.state.conceito,
		}
		api.post('/conceptCreate', concept)
			.then((response) => {
				// console.log(this.state.conceito)
				this.setState({ loading: false });
				// console.log(response.data)
				if (response.data.status) {
					// console.log("res:", response.data.conceito)
					this.showAlert("Conceito cadastrado com sucesso.", "success")
				} else {
					console.log("res:", response.data.conceito)
					this.showAlert("Não foi possível cadastrar o conceito. Por favor, entre em contato com o administrador do sistema.", "error")
				}
			})
			.catch(error => {
				this.setState({ loading: false });
				this.showAlert("Ocorreu um erro inesperado. Por favor, entre em contato com o administrador do sistema.", "error")
			})
	}

	onSubmit(e) {
		e.preventDefault()
		//console.log(this.validate())
		this.setState({ loading: true })
		if (this.validate()) {
			let formData = new FormData();
			formData.append('user', this.getUserId());
			formData.append('curso', this.state.curso);
			formData.append('conceito', this.state.conceito);
			formData.append('conceito', this.state.descricao);
			// console.log(this.state)
			this.setState((state, props) => {
				return {
					descricao: formData.append('conceito', this.state.descricao),
				};
			})

			if (true) {
				this.createConcept(formData)
			}
		} else {
			this.setState({ loading: false })
		}
	}

	render() {
		if (this.state.loading) {
			return <Spinner />
		}
		const { validation } = this.state;

		const retorno = (
			<React.Fragment>
				<div className="fundo-bg fundo-gray" />

				<section className="jumbotron text-left question-hero question-prof">
					<div className="container">
						<div className="row">
							<div className="col">
								<React.Fragment>
									<h1>Cadastrar Conceito</h1>
									<h6>Ao cadastrar, o conceito ficará disponível para ter questões adicionadas a ele.</h6>
								</React.Fragment>
							</div>
						</div>
					</div>
				</section>

				<section className="cosmo-hero">
					<div className="container wrapper">
						<form onSubmit={this.onSubmit} className="form-question" encType="multipart/form-data" noValidate>
							<div className="row">
								<div className="col-md-12">
									<p className="text-muted"><strong className="campo-obrigatorio">*</strong> Campo Obrigatório</p>
								</div>
							</div>
							<div className="controls">

								<div className="row">
									<div className="col-sm-3">
										<div className="form-group">
											<label htmlFor="input-frmquest-course-group">Curso <strong className="campo-obrigatorio">*</strong></label>
											<div id="input-frmquest-course-group" className={!validation.curso.wasValidated ? "input-group" : validation.curso.hasError ? "is-invalid input-group" : "is-valid input-group"}>
												<div className="input-group-prepend">
													<span className="input-group-text bg-light"><i className="fas fa-globe-americas"></i></span>
												</div>
												<select id="select-frmquest-course" className={!validation.curso.wasValidated ? "form-control" : validation.curso.hasError ? "is-invalid form-control" : "is-valid form-control"}
													name="curso" placeholder="Curso" value={this.state.curso} aria-label="Curso" onChange={this.onChange} >
													<option value=''> </option>
													{
														this.state.cursos.map(function (curso) {
															return <option key={curso.id_curso} value={curso.id_curso}>{curso.nome_curso}</option>;
														})
													}
												</select>
											</div>
											{validation.curso.hasError && (<span className="invalid-feedback">{validation.curso.errorMessage}</span>)}
										</div>
									</div>
								</div>

								<div className="row">
									<div className="col-md-12">
										<div className="fomr-group">
											<label htmlFor="input-frmquest-title-group">Conceito <strong className="campo-obrigatorio">*</strong></label>
											<div id="input-frmquest-title-group" className={!validation.conceito.wasValidated ? "input-group" : validation.conceito.hasError ? "is-invalid input-group" : "is-valid input-group"}>
												<div className="input-group-prepend">
													<span className="input-group-text bg-light"><i className="fas fa-user"></i></span>
												</div>
												<input id="input-frmquest-title" type="text" className={!validation.conceito.wasValidated ? "form-control" : validation.conceito.hasError ? "is-invalid form-control" : "is-valid form-control"}
													name="conceito" placeholder="Conceito" value={this.state.conceito} onChange={this.onChange} />
											</div>
											{validation.conceito.hasError && (<span className="invalid-feedback">{validation.conceito.errorMessage}</span>)}
										</div>
									</div>
								</div>
							</div>

							<div className="row">
								<div className="col-md-12 text-center register-quest-footer">
									<button id="btn-question-register" type="submit" className="btn btn-cadastrar-color-1"><i className="fas fa-save"></i> Salvar</button>
									<div className="float-right">
										<button type="button" onClick={() => this.props.history.goBack()} className="btn btn-danger cosmo-color-1">Voltar</button>
									</div>
								</div>
							</div>

						</form>
					</div>
				</section>
			</React.Fragment>
		)

		return (
			<React.Fragment>
				<Navbar />
				<div className="app-body">
					{retorno}
				</div>
				{this.state.alerts.length > 0 ? this.state.alerts[0] : null}
			</React.Fragment>
		)

	}
}
export default RegisterConcept;