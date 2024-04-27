import React, { Component } from 'react'
import Wallpaper from "../images/wallpaper.jpg"
import '../css/Register.css'
import Spinner from './components/Spinner'
import api from '../services/api'
import Alert from './components/Alert'
import GoogleLogin from "react-google-login";

class RegisterUser extends Component {
	constructor() {
		super()
		this.state = {
			loading: true,
			email: '',
			senha: '',
			nome: '',
			userName: '',
			nascimento: '',
			estado: '',
			municipio: '',
			municipios: [],
			estados: [],
			sexo: '',
			validation: {
				email: { wasValidated: false },
				senha: { wasValidated: false },
				nome: { wasValidated: false },
				userName: { wasValidated: false },
				nascimento: { wasValidated: false },
				estado: { wasValidated: false },
				municipio: { wasValidated: false },
				sexo: { wasValidated: false }
			},
			alerts: []
		}
		this.changeEstado = this.changeEstado.bind(this)
		this.setMunicipios = this.setMunicipios.bind(this)
		this.onChange = this.onChange.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
		this.showAlert = this.showAlert.bind(this)
		this.closeAlert = this.closeAlert.bind(this)
	}

	responseGoogle = (response) => {
		this.setState((state, props) => {
			return {
				userName: response.getBasicProfile().getId(),
				nome: response.getBasicProfile().getName(),
				senha: "$2a$10$g1P8vi9LFP5sGjXMySQReO1EDTUzEdhEMpHpqo0dWRPZvHoRBF5Nm",
				email: response.getBasicProfile().getEmail(),
			};
		});
	};

	componentDidMount() {
		api.get('/states').then(response => {
			return response.data.map(estado => ({
				id_estado: `${estado.id}`,
				nome_estado: `${estado.nome}`
			}));
		})
			.then(estados => {
				this.setState({
					estados: estados,
					loading: false
				});
			})
			.catch(err => {
				this.showAlert("Erro ao carregar estados", "error")
			})
	}

	showAlert(msg, status) {
		let alerts = this.state.alerts
		alerts.push(<Alert msg={msg} status={status} hide={this.closeAlert.bind(this)} />)
		this.setState({ alerts: alerts })
	}

	closeAlert() {
		let alerts = this.state.alerts
		alerts.shift()
		//console.log(alerts)
		this.setState({ alerts: alerts })
	}

	validateField(name, value) {

		let validation = { ...this.state.validation };

		switch (name) {

			case "nome":
				if (!value || value.length < 5) {
					validation.nome = {
						hasError: true,
						errorCode: 'NOM001',
						errorMessage: "Você deve entrar com sua conta Google para que o cadastro seja efetuado."
						// errorMessage: "O campo 'nome completo' deve possuir pelo menos 5 (cinco) caracteres."
					}
				} else {
					validation.nome = {
						hasError: false
					}
				}
				validation.nome.wasValidated = true
				this.setState(prevState => ({ validation: { ...prevState.validation, nome: validation.nome } }))
				break;
			case "sexo":
				//console.log(value)
				//console.log(value.length)
				if (!value || !(value === "M" || value === "F")) {
					validation.sexo = {
						// hasError: true,
						hasError: false,
						errorCode: 'NOM001',
						errorMessage: "O campo 'sexo' deve ser selecionado."
					}
				} else {
					validation.sexo = {
						hasError: false
					}
				}
				validation.sexo.wasValidated = true
				this.setState(prevState => ({ validation: { ...prevState.validation, sexo: validation.sexo } }))
				break;
			case "userName":
				if (!value || value.length < 5) {
					validation.userName = {
						hasError: true,
						errorCode: 'USN001',
						// errorMessage: "O campo 'nome de usuário' deve possuir pelo menos 5 (cinco) caracteres."
					}
				} else {
					validation.userName = {
						hasError: false
					}
				}
				validation.userName.wasValidated = true
				this.setState(prevState => ({ validation: { ...prevState.validation, userName: validation.userName } }))
				break;
			case "email":
				const emailRegExp = RegExp(/^([\w+-]+\.)*[\w+-]+@([\w+-]+\.)*[\w+-]+\.[a-zA-Z]{2,4}$/)

				if (!emailRegExp.test(value)) {
					validation.email = {
						hasError: true,
						errorCode: 'EMA001',
						// errorMessage: "O campo 'email' deve possuir um formato válido."
					}
				} else {
					validation.email = {
						hasError: false
					}
				}
				validation.email.wasValidated = true
				this.setState(prevState => ({ validation: { ...prevState.validation, email: validation.email } }))
				break;
			case "senha":
				const passwordRegExp = RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)

				if (!passwordRegExp || passwordRegExp.length < 5) {
					validation.senha = {
						hasError: true,
						errorCode: 'EMA001',
						errorMessage: "O campo 'senha' deve possuir 8 caracteres, sendo, no mínimo, uma letra maiúscula, uma letra minúscula e um número."
					}
				} else {
					validation.senha = {
						hasError: false
					}
				}
				validation.senha.wasValidated = true
				this.setState(prevState => ({ validation: { ...prevState.validation, senha: validation.senha } }))
				break;
			case "estado":
				//console.log(value)
				if (value === "" || !value) {
					validation.estado = {
						// hasError: true,
						hasError: false,
						errorCode: 'EST001',
						errorMessage: "O campo 'estado' deve ser selecionado."
					}
				} else {
					validation.estado = {
						hasError: false
					}
				}
				validation.estado.wasValidated = true
				this.setState(prevState => ({ validation: { ...prevState.validation, estado: validation.estado } }))
				break;
			case "municipio":
				if (value === "" || !value) {
					validation.municipio = {
						// hasError: true,
						hasError: false,
						errorCode: 'MUN001',
						errorMessage: "O campo 'município' deve ser selecionado."
					}
				} else {
					validation.municipio = {
						hasError: false
					}
				}
				validation.municipio.wasValidated = true
				this.setState(prevState => ({ validation: { ...prevState.validation, municipio: validation.municipio } }))
				break;
			case "nascimento":
				const birthdayRegExp = RegExp(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/)

				if (!birthdayRegExp.test(value)) {
					validation.nascimento = {
						// hasError: true,
						hasError: false,
						errorCode: 'NAS001',
						errorMessage: "O campo 'nascimento' deve possuir um formato válido."
					}
				} else {
					validation.nascimento = {
						hasError: false
					}
				}
				validation.nascimento.wasValidated = true
				this.setState(prevState => ({ validation: { ...prevState.validation, nascimento: validation.nascimento } }))
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
			} /*else if(validation[key].wasValidated && key ==="email") {
				this.checkEmail(key, this.state[key])
			} else if(validation[key].wasValidated && key ==="userName") {
				this.checkEmail(key, this.state[key])
			}*/
		}

		if (!wasValidated) return false;

		validation = { ...this.state.validation };

		return !(validation.nome.hasError ||
			validation.userName.hasError ||
			validation.sexo.hasError ||
			validation.email.hasError ||
			validation.senha.hasError ||
			validation.estado.hasError ||
			validation.municipio.hasError ||
			validation.nascimento.hasError)

	}

	onChange(e) {
		//e.preventDefault()

		const { name, value } = e.target

		this.setState(
			{ [name]: value },
			() => { this.validateField(name, value) }
		)
	}

	changeEstado(e) {
		this.onChange(e)
		this.setState(prevState => ({
			...prevState,
			municipio: '',
			validation: {
				...prevState.validation,
				municipio: {
					wasValidated: false,
					hasError: null
				}
			}
		}))
		this.setMunicipios(e.target.value)
	}

	setMunicipios(estado) {
		if (estado !== "") {
			api.get('/cities', {
				headers: {
					state: estado
				}
			}).then(response => {
				return response.data.map(municipio => ({
					id_municipio: `${municipio.id}`,
					nome_municipio: `${municipio.nome}`
				}));
			})
				.then(municipios => {
					this.setState({
						municipios
					});
				})
				.catch(err => {
					this.showAlert("Erro ao carregar municípios", "error")
				})

		} else {
			this.setState({
				municipios: []
			});
		}

	}


	onSubmit(e) {
		e.preventDefault()
		this.setState({ loading: true })
		if (this.validate()) {

			const user = {
				email: this.state.email,
				senha: this.state.senha,
				nome: this.state.nome,
				userName: this.state.userName,
				sexo: this.state.sexo,
				nascimento: this.state.nascimento,
				municipio: this.state.municipio,
			}
			// console.log(user)
			api.post('/checkEmail', { email: user.email })
				.then(res => {
					if (res.data.status) {
						this.setState({ emailDuplicated: false });

						api.post('/checkUserName', { userName: user.userName })
							.then(res => {
								if (res.data.status) {
									this.setState({ userNameDuplicated: false });

									api.post('/user', user)
										.then(res => {
											// console.log(res)
											if (res.data.status) {
												// window.alert("Usuário cadastrado com sucesso.")
												this.showAlert("Usuário cadastrado com sucesso.", "success");
												setTimeout(() => {
													this.props.history.push(`/`)
												}, 5000);
												// this.props.history.push(`/`)
											} else {
												// console.log(res.data)
												// console.log(user)
												this.setState({ loading: false });
												this.showAlert("Não foi possível cadastrar o usuário. Por favor, entre em contato com o administrador do sistema.", "error")
											}
										})
										.catch(error => {
											this.setState({ loading: false });
											this.showAlert("Ocorreu um erro inesperado. Por favor, entre em contato com o administrador do sistema.", "error")
										})

								} else {
									this.setState({ userNameDuplicated: true });
								}
							})
							.catch(error => {
								this.setState({ loading: false });
								//console.log(error.response.data.message);
								this.showAlert("Ocorreu um erro inesperado. Por favor, entre em contato com o administrador do sistema.", "error")
							})

					} else {
						this.setState({ emailDuplicated: true });
					}
				})
				.catch(error => {
					this.setState({ loading: false });
					this.showAlert("Ocorreu um erro inesperado. Por favor, entre em contato com o administrador do sistema.", "error")
				})
				.finally(() => {
					this.setState({ loading: false });
				})
		} else
			this.setState({ loading: false })
	}

	render() {
		if (this.state.loading) {
			return <Spinner />
		}
		const { validation } = this.state;

		return (
			<React.Fragment>

				<div className="bg-color main-register">
					<img src={Wallpaper} alt="Cosmo Wallpaper" className="fundo-register-bg" />
					<div className="container wrapper">
						<form onSubmit={this.onSubmit} encType="multipart/form-data" noValidate>

							<div className="d-flex justify-content-center align-items-center" id="user-form">
								<div className="card register-body">
									<div className="card-header">
										<h5 className="card-title mb-0 text-center">
											Crie sua conta
										</h5>
									</div>

									<div className="card-body">
										<div className="form-group">
											{/* <label htmlFor="input-frmuser-name-group">Nome completo</label> */}
											<div id="input-frmuser-name-group" className={!validation.nome.wasValidated ? "input-group" : validation.nome.hasError ? "is-invalid input-group" : "is-valid input-group"}>
												<div className="input-group-prepend">
													{/* <span className="input-group-text bg-light"><i className="fas fa-user"></i></span> */}
													<GoogleLogin
														clientId="569678044740-ebouaf4nnf7henes2e9bjm72thosblm6.apps.googleusercontent.com"
														buttonText="Cadastrar com o Google"
														onSuccess={this.responseGoogle}
														onFailure={this.responseGoogle}
														onSubmit={this.onSubmit}
														isSignedIn={true}
														cookiePolicy={"single_host_origin"}
													/>
												</div>
												{/* <input id="input-frmuser-name" type="text" className={!validation.nome.wasValidated ? "form-control" : validation.nome.hasError ? "is-invalid form-control" : "is-valid form-control"} name="nome" placeholder="Nome completo" value={this.state.nome} onChange={this.onChange} /> */}
											</div>
											{validation.nome.hasError && (<span className="invalid-feedback">{validation.nome.errorMessage}</span>)}
										</div>

										<div className="form-group">
											{/* <label htmlFor="input-frmuser-nickname-group">Nome de usuário</label> */}
											<div id="input-frmuser-nickname-group" className={!validation.userName.wasValidated ? "input-group" : (validation.userName.hasError || this.state.userNameDuplicated) ? "is-invalid input-group" : "is-valid input-group"}>
												<div className="input-group-prepend">
													{/* <span className="input-group-text bg-light"><i className="fas fa-at"></i></span> */}
												</div>
												{/* <input id="input-frmuser-nickname" type="text" className={!validation.userName.wasValidated ? "form-control" : (validation.userName.hasError || this.state.userNameDuplicated) ? "is-invalid form-control" : "is-valid form-control"} name="userName" placeholder="Nome de usuário" value={this.state.userName} onChange={this.onChange} aria-label="Nome de Usuário" /> */}
											</div>
											{validation.userName.hasError && (<span className="invalid-feedback">{validation.userName.errorMessage}</span>)}
											{this.state.userNameDuplicated && (<span className="invalid-feedback">O nome de usuário informado já se encontra em uso.</span>)}
										</div>

										<div className="form-group">
											<label htmlFor="input-frmuser-sexo-group">Sexo</label>
											<div id="input-frmuser-sexo-group" className={!validation.sexo.wasValidated ? "input-group" : validation.sexo.hasError ? "is-invalid input-group" : "is-valid input-group"}>
												<div className="form-check form-check-inline">
													<label className="form-check-label pr-1" htmlFor="input-frmuser-sexo-male"> Masculino </label>
													<input className="form-check-input mt-1" type="radio" id="input-frmuser-sexo-male" name="sexo" value="M" onChange={this.onChange} />
												</div>
												<div className="form-check form-check-inline">
													<label className="form-check-label pr-1" htmlFor="input-frmuser-sexo-female"> Feminino</label>
													<input className="form-check-input mt-1" type="radio" id="input-frmuser-sexo-female" name="sexo" value="F" checked={this.state.sexo === "F"} onChange={this.onChange} />
												</div>
											</div>
											{validation.sexo.hasError && (<span className="invalid-feedback">{validation.sexo.errorMessage}</span>)}
										</div>

										<div className="form-group">
											{/* <label htmlFor="input-frmuser-email">Email</label> */}
											<div id="input-frmuser-email-group" className={!validation.email.wasValidated ? "input-group" : (validation.email.hasError || this.state.emailDuplicated) ? "is-invalid input-group" : "is-valid input-group"}>
												<div className="input-group-prepend">
													{/* <span className="input-group-text bg-light"><i className="fas fa-envelope"></i></span> */}
												</div>
												{/* <input id="input-frmuser-email" type="email" className={!validation.email.wasValidated ? "form-control" : (validation.email.hasError || this.state.emailDuplicated) ? "is-invalid form-control" : "is-valid form-control"} name="email" placeholder="Email" value={this.state.email} onChange={this.onChange} /> */}
											</div>
											{validation.email.hasError && (<span className="invalid-feedback">{validation.email.errorMessage}</span>)}
											{this.state.emailDuplicated && (<span className="invalid-feedback">O email informado já se encontra em uso.</span>)}
										</div>
										<div className="form-group">
											{/* <label htmlFor="input-frmuser-email">Senha</label> */}
											<div id="input-frmuser-senha-group" className={!validation.senha.wasValidated ? "input-group" : validation.senha.hasError ? "is-invalid input-group" : "is-valid input-group"}>
												<div className="input-group-prepend">
													{/* <span className="input-group-text bg-light"><i className="fas fa-key"></i></span> */}
												</div>
												{/* <input id="input-frmuser-senha" type="password" className={!validation.senha.wasValidated ? "form-control" : validation.senha.hasError ? "is-invalid form-control" : "is-valid form-control"} name="senha" placeholder="Senha" value={this.state.senha} onChange={this.onChange} /> */}
											</div>
											{validation.senha.hasError && (<span className="invalid-feedback">{validation.senha.errorMessage}</span>)}
										</div>

										<div className="form-group">
											<label htmlFor="input-frmuser-state-group">Estado</label>
											<div id="input-frmuser-state-group" className={!validation.estado.wasValidated ? "input-group" : validation.estado.hasError ? "is-invalid input-group" : "is-valid input-group"}>
												<div className="input-group-prepend">
													<span className="input-group-text bg-light"><i className="fas fa-globe-americas"></i></span>
												</div>
												<select id="select-frmuser-state" className={!validation.estado.wasValidated ? "form-control" : validation.estado.hasError ? "is-invalid form-control" : "is-valid form-control"} name="estado" placeholder="Estado" value={this.state.estado} aria-label="Estado" onChange={this.changeEstado} >
													<option value=''>--- Selecione um estado ---</option>
													{
														this.state.estados.map(function (estado) {
															return <option key={estado.id_estado} value={estado.id_estado}>{estado.nome_estado}</option>;
														})
													}
												</select>
											</div>
											{validation.estado.hasError && (<span className="invalid-feedback">{validation.estado.errorMessage}</span>)}
										</div>

										<div className="form-group">
											<label htmlFor="input-frmuser-birthday-group">Município</label>
											<div id="input-frmuser-birthday-group" className={!validation.municipio.wasValidated ? "input-group" : validation.municipio.hasError ? "is-invalid input-group" : "is-valid input-group"}>
												<div className="input-group-prepend">
													<span className="input-group-text bg-light"><i className="fas fa-city"></i></span>
												</div>
												<select id="select-frmuser-city" className={!validation.municipio.wasValidated ? "form-control" : validation.municipio.hasError ? "is-invalid form-control" : "is-valid form-control"} name="municipio" placeholder="Municipio" value={this.state.municipio} aria-label="Município" onChange={this.onChange} >
													<option value=''>--- Selecione um municipio ---</option>
													{
														this.state.municipios.map(function (municipio) {
															return <option key={municipio.id_municipio} value={municipio.id_municipio}>{municipio.nome_municipio}</option>;
														})
													}
												</select>
											</div>
											{validation.municipio.hasError && (<span className="invalid-feedback">{validation.municipio.errorMessage}</span>)}
										</div>

										<div className="form-group">
											<label htmlFor="input-frmuser-birthday-group">Data de nascimento</label>
											<div id="input-frmuser-birthday-group" className={!validation.nascimento.wasValidated ? "input-group" : validation.nascimento.hasError ? "is-invalid input-group" : "is-valid input-group"}>
												<div className="input-group-prepend">
													<span className="input-group-text bg-light"><i className="fas fa-calendar"></i></span>
												</div>
												<input id="input-frmuser-birthday" type="date" className={!validation.nascimento.wasValidated ? "form-control" : validation.nascimento.hasError ? "is-invalid form-control" : "is-valid form-control"} name="nascimento" placeholder="Data de nascimento" value={this.state.nascimento} aria-label="Data de nascimento" onChange={this.onChange} />
											</div>
											{validation.nascimento.hasError && (<span className="invalid-feedback">{validation.nascimento.errorMessage}</span>)}
										</div>
									</div>

									<div className="card-footer text-center">
										<input id="input-hidden-id" type="hidden" value="5e42943c60f8a538e0130fcc" />
										<button id="btn-update-register" type="submit" className="btn btn-cadastrar-color-1"><i className="fas fa-save"></i> Criar conta</button>
										<button id="btn-voltar" type="button" className="btn btn-voltar-color-1 float-right" onClick={() => this.props.history.goBack()}>Voltar</button>
									</div>
								</div>
							</div>

						</form>

					</div>
				</div>

				{this.state.alerts.length > 0 ? this.state.alerts[0] : null}
			</React.Fragment>

		)

	}
}

export default RegisterUser

