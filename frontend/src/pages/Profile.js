import api from '../services/api'
import React, { Component, useEffect, useContext } from 'react'
import jwt_decode from 'jwt-decode'
import imgPreview from '../images/avatar.png'
import Spinner from './components/Spinner'
import Navbar from './components/Navbar'
import Alert from './components/Alert'
import '../css/Profile.css'
import { BsTrophy} from "react-icons/bs"
import { GrAchievement } from "react-icons/gr"

import iconAchievement from "../images/trophy.png"

import { useLocation, useHistory } from "react-router-dom";

class Profile extends Component {
	constructor() {
		super()

		this.imagePreviewUrl = imgPreview

		this.state = {
			email: '',
			nome: '',
			userName: '',
			nascimento: '',
			estado: '',
			municipio: '',
			foto: '',
			file: '',
			estados: [],
			municipios: [],
			sexo: '',
			xp: 0,
			titulo_id: 0,
			alerts: [],
			modificou: false,
			loading: true,
			porcentagemProgresso: 0,
			xpRestante: 0,
			proximoTitulo: '',
			conquistas: /*useContext(useLocation().context)*/[],
		}

		this.changeEstado = this.changeEstado.bind(this)
		this.setMunicipios = this.setMunicipios.bind(this)
		this.onChange = this.onChange.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
		this.wrapImage = this.wrapImage.bind(this)
		this.loadAvatar = this.loadAvatar.bind(this)
		this.showAlert = this.showAlert.bind(this)
		this.closeAlert = this.closeAlert.bind(this)
		this.calcularProgressoNiveis = this.calcularProgressoNiveis.bind(this)
	}

	calcularProgressoNiveis(xp) {
		if (xp < 26) {

			this.setState({
				xpRestante: 26-xp,
				proximoTitulo: 'Escudeiro(a)'
			});
			return (xp / 25) * 100;

		} else if (xp >= 26 && xp <= 50) {

			this.setState({
				xpRestante: 51-xp,
				proximoTitulo: 'Barão/Baronesa'
			});
			return 100 - ( ( (51-xp) / 25 ) * 100 );

		} else if (xp >= 51 && xp <= 75) {

			this.setState({
				xpRestante: 76-xp,
				proximoTitulo: 'Visconde/Viscodessa'
			});
			return 100 - (((76-xp) / 25) * 100);

		} else if (xp >= 76 && xp <= 100) {

			this.setState({
				xpRestante: 101-xp,
				proximoTitulo: 'Conde/Condessa'
			});
			return 100 - (((101-xp) / 25) * 100);

		} else if (xp >= 101 && xp <= 125) {

			this.setState({
				xpRestante: 126-xp,
				proximoTitulo: 'Marquês/Marquesa'
			});
			return 100 - (((126-xp) / 25) * 100);

		} else if (xp >= 126 && xp <= 150) {

			this.setState({
				xpRestante: 151-xp,
				proximoTitulo: 'Duque/Duquesa'
			});
			return 100 - (((151-xp) / 25) * 100);

		} else if (xp >= 151 && xp <= 175) {

			this.setState({
				xpRestante: 176-xp,
				proximoTitulo: 'Grã-Duque/Grã-Duquesa'
			});
			return 100 - (((176-xp) / 25) * 100);

		} else if (xp >= 176 && xp <= 200) {

			this.setState({
				xpRestante: 201-xp,
				proximoTitulo: 'Imperador(a)'
			});
			return 100 - (((201-xp) / 25) * 100);

		} else if (xp >= 201 && xp <= 225) {

			this.setState({
				xpRestante: 226-xp,
				proximoTitulo: 'Herdeiro(a) de Turing'
			});
			return 100 - (((226-xp) / 25) * 100);

		} else if (xp >= 226) {

			this.setState({
				xpRestante: 0,
				proximoTitulo: '---'
			});
			return 100;
		}
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
		const token = localStorage.usertoken
		const decoded = jwt_decode(token)
		// console.log(decoded)
		const idUser = decoded.id

		api
		  .get(`/achievement`)
		  .then((result) => {
			console.log(result.data)
		  
			this.setState({conquistas: result.data.data})
		  })

		api.get(`/user/${idUser}`)
			.then(response => {
				return response.data;
			})
			.then(usuario => {

				//console.log(usuario)
				this.setMunicipios(usuario.estado)
				this.setState({
					id: usuario.id,
					userName: usuario.userName,
					email: usuario.email,
					nome: usuario.nome,
					nascimento: usuario.nascimento,
					estado: usuario.estado,
					municipio: usuario.municipio,
					sexo: usuario.sexo,
					xp: usuario.xp,
					saldo_moedas: usuario.saldo_moedas,
					moedas_acumuladas: usuario.moedas_acumuladas,
					moedas_utilizadas: usuario.moedas_utilizadas,
					questoes_respondidas: usuario.questoes_respondidas,
					titulo: usuario.titulo,
					titulo_id: usuario.titulo_id,
					foto: usuario.foto,
					porcentagemProgresso: this.calcularProgressoNiveis(usuario.xp),
				});
				//console.log(usuario);
				const auxTitle = {
					user: usuario.id,
					titleId: usuario.titulo_id,
					xp: usuario.xp
				}
				//console.log(auxTitle)
				api.put(`/title`, auxTitle)
					.then(response3 => {
						this.setState({ loading: false })
						//console.log(response3)
						if (response3.data.status) {
							if (response3.data.result) {
								this.setState({ titulo: response3.data.result })
								console.log("Título atualizado com sucesso")
							}
						} else {
							console.log("Erro ao atualizar título do usuário")
						}
					})
					.catch(err => {
						this.setState({ loading: false })
						this.showAlert("Erro ao atualizar dados do usuário", "error")
					})

			})
			.catch(err => {
				this.setState({ loading: false })
				this.showAlert("Erro ao carregar dados do usuário", "error")
			})


		api.get(`/states`).then(response => {
			return response.data.map(estado => ({
				id_estado: `${estado.id}`,
				nome_estado: `${estado.nome}`
			}));
		})
			.then(estados => {
				this.setState({
					estados
				});
			})
			.catch(err => {
				this.showAlert("Erro ao carregar estados", "error")
			})

		api.get(`/achievement`)
			.then(response => {
				console.log(response.data.data)
			})
	}

	validate = () => {

		let isError = false;
		const errors = {};
		if (this.state.nome === '') {
			isError = true;
			errors.name = 'Você deve preencher o campo nome completo.';
		}

		if (this.state.email === '') {
			isError = true;
			errors.email = 'Você deve preencher o campo e-mail';
		}

		if (this.state.testFile === null) {
			isError = true;
			errors.file = 'Você deve selecionar um avatar';
		}

		if (isError) {
			this.setState({
				...this.state,
				...errors
			})
		}

		return isError;
	}

	wrapImage(e) {
		document.getElementById("input-frmuser-fileupload").click();
	}

	loadAvatar(e) {

		e.preventDefault();

		let reader = new FileReader();
		let file = e.target.files[0];

		if (e.target.files.length === 0) {
			//console.log("Erro - Nenhuma imagem foi selecionada.");
			return;
		}

		if (!/^(?:image\/bmp|image\/cis-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x-cmu-raster|image\/x-cmx|image\/x-icon|image\/x-portable-anymap|image\/x-portable-bitmap|image\/x-portable-graymap|image\/x-portable-pixmap|image\/x-rgb|image\/x-xbitmap|image\/x-xpixmap|image\/x-xwindowdump)$/i.test(file.type)) {
			this.showAlert("Erro - O tipo da imagem não é válido.", "error");
			return;
		}

		reader.onloadend = () => {
			this.setState({
				file: file,
				foto: reader.result,
				modificou: true
			});
		}

		reader.readAsDataURL(file)
	}

	onChange(e) {
		this.setState({ [e.target.name]: e.target.value, modificou: true })
		//console.log(e.target.name, e.target.value)
	}

	changeEstado(e) {
		this.onChange(e)
		this.setMunicipios(e.target.value, true)
	}

	setMunicipios(estado, valueDefault = false) {
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

				if (valueDefault) {
					//console.log("entrou", municipios[0])
					this.setState({ municipio: municipios[0].id_municipio })
					//console.log(this.state.municipio)
				}
			})
			.catch(err => {
				this.showAlert("Erro ao carregar municípios", "error")
			})
	}

	onSubmit(e) {
		e.preventDefault()

		const err = this.validate();
		//console.log(this.state)
		this.setState({ loading: true })
		if (!err) {
			let formData = new FormData();
			formData.append('email', this.state.email);
			formData.append('nome', this.state.nome);
			formData.append('id', this.state.id);
			formData.append('nascimento', this.state.nascimento);
			formData.append('municipio', this.state.municipio);
			formData.append('sexo', this.state.sexo);
			formData.append('foto', this.state.foto);

			if (this.state.file !== "")
				formData.append('avatar', this.state.file, "avatar.png");

			/*
			const formKeys    = formData.keys();
			const formEntries = formData.entries();
			do {
			  console.log(formEntries.next().value);
			} while (!formKeys.next().done)
			*/

			api.put(`/user/${this.state.id}`, formData)
				.then(res => {
					this.setState({ loading: false })
					//console.log(res)
					if (res.data.status) {
						this.showAlert("Dados atualizados com sucesso", "success")
						this.setState({ modificou: false })
					} else {
						this.showAlert("Erro ao atualizar dados do usuário", "error")
					}
				})
				.catch(err => {
					this.setState({ loading: false })
					this.showAlert("Erro ao atualizar dados do usuário", "error")
				})
		} else {
			this.setState({ loading: false })
			this.showAlert("Erro: preencha todos os campos", "error")
		}
	}

	render() {

		if (this.state.loading) {
			return <Spinner />
		}

		let $imagePreview = null;
		if (this.state.foto === null) {
			$imagePreview = this.imagePreviewUrl
		} else {
			$imagePreview = this.state.foto
		}

		const retorno =
			<React.Fragment>
				{/*<Conquista />*/}
				<div className="fundo-bg fundo-gray" />
				<div className="main-profile main-profile-raised">
					<div className="profile-content">
						<div className="container">
							<div className="row">
								<div className="col-md-6 ml-auto mr-auto header-profile">
									<div className="profile">
										<div className="avatar">
											<img src={$imagePreview} alt="Circle" className="img-raised rounded-circle img-fluid" />
											<input id="input-frmuser-fileupload" type="file" className="d-none" onChange={this.loadAvatar} ref="file" name="avatar" />
											<button type="button" className="btn btn-cosmo-color-1 rounded mr-1" id="btn-alter-image" onClick={this.wrapImage}><i className="fa fa-camera-retro"></i></button>
										</div>

									</div>
								</div>

								<div className="container body-profile">
									<form onSubmit={this.onSubmit} encType="multipart/form-data">
										<div className="row animated bounceInUp profile-data">
										<div className="col-md-8" id="user-form">
												<div className="card mb-4">
													<div className="card-header">
														<h5 className="card-title mb-0 text-center">
															Dados Pessoais
														</h5>
													</div>
													<div className="card-body">
														<div className="form-group">
															<label htmlFor="input-frmuser-name-group">Nome completo</label>
															<div className="input-group" id="input-frmuser-name-group">
																<div className="input-group-prepend">
																	<span className="input-group-text bg-light"><i className="fas fa-user"></i></span>
																</div>
																<input id="input-frmuser-name" type="text" className="form-control" name="nome" placeholder="Nome completo" value={this.state.nome} onChange={this.onChange} />
															</div>
														</div>

														<div className="form-group">
															<label htmlFor="input-frmuser-sexo-group">Gênero</label>
															<div className="input-group " id="input-frmuser-sexo-group">
																<div className="form-check form-check-inline">
																	<label className="form-check-label pr-1" htmlFor="input-frmuser-sexo-male"> Masculino </label>
																	<input className="form-check-input mt-1" type="radio" id="input-frmuser-sexo-male" name="sexo" value="M" checked={this.state.sexo === "M"} onChange={this.onChange} />
																</div>
																<div className="form-check form-check-inline">
																	<label className="form-check-label pr-1" htmlFor="input-frmuser-sexo-female"> Feminino</label>
																	<input className="form-check-input mt-1" type="radio" id="input-frmuser-sexo-female" name="sexo" value="F" checked={this.state.sexo === "F"} onChange={this.onChange} />
																</div>
															</div>
														</div>


														<div className="form-group">
															<label htmlFor="input-frmuser-email">Email</label>
															<div className="input-group" id="input-frmuser-email-group">
																<div className="input-group-prepend">
																	<span className="input-group-text bg-light"><i className="fas fa-envelope"></i></span>
																</div>
																<input id="input-frmuser-email" disabled type="text" className="form-control" name="email" placeholder="Email" value={this.state.email} />
															</div>
														</div>

														<div className="form-group">
															<label htmlFor="input-frmuser-state-group">Estado</label>
															<div className="input-group" id="input-frmuser-state-group">
																<div className="input-group-prepend">
																	<span className="input-group-text bg-light"><i className="fas fa-globe-americas"></i></span>
																</div>
																<select id="select-frmuser-state" className="form-control" name="estado" placeholder="Estado" value={this.state.estado} aria-label="Estado" onChange={this.changeEstado}>
																	{
																		this.state.estados.map(function (estado) {
																			return <option key={estado.id_estado} value={estado.id_estado}>{estado.nome_estado}</option>;
																		})
																	}
																</select>
															</div>
														</div>

														<div className="form-group">
															<label htmlFor="input-frmuser-birthday-group">Município</label>
															<div className="input-group" id="input-frmuser-birthday-group">
																<div className="input-group-prepend">
																	<span className="input-group-text bg-light"><i className="fas fa-city"></i></span>
																</div>
																<select id="select-frmuser-city" className="form-control" name="municipio" placeholder="municipio" value={this.state.municipio} aria-label="Município" onChange={this.onChange}>
																	{
																		this.state.municipios.map(function (municipio) {
																			return <option key={municipio.id_municipio} value={municipio.id_municipio}>{municipio.nome_municipio}</option>;
																		})
																	}
																</select>
															</div>
														</div>

														<div className="form-group">
															<label htmlFor="input-frmuser-birthday-group">Data de nascimento</label>
															<div className="input-group" id="input-frmuser-birthday-group">
																<div className="input-group-prepend">
																	<span className="input-group-text bg-light"><i className="fas fa-calendar"></i></span>
																</div>
																<input id="input-frmuser-birthday" type="date" className="form-control" name="nascimento" placeholder="Data de nascimento" value={this.state.nascimento} aria-label="Data de nascimento" onChange={this.onChange}></input>
															</div>
														</div>
													</div>



												</div>
											</div>

											<div className="col-md-8">
												<div className="card p-card">
													<div className="card-header">
														<h5 className="card-title mb-0 text-center">Dados Gerais</h5>
													</div>

													<div className="card-body">
														<div className="row dados-gerais">
															<div className="d-flex justify-content-center">
																<span className="p-1">
																	<i className="fas fa-scroll fa-lg text-cosmo-color-1 pr-1"></i>
																	<span>Título:</span> {this.state.titulo} {`-->`} <span>Próximo Título:</span> {this.state.proximoTitulo}
																	<div
          															  className="progress"
          															  style={{ width: "100%", marginRight: "5vw" }}
          															>
          															  <div
          															    className="progress-bar"
          															    role="progressbar"
          															    style={{ width: `${this.state.porcentagemProgresso}%` }}
          															    aria-valuenow="0"
          															    aria-valuemin="0"
          															    aria-valuemax="100"
          															  >
          															    {this.state.porcentagemProgresso > 0 ? `${this.state.porcentagemProgresso}%` : <></>}
          															  </div>
          															</div>
																	<div className="xp-atual">
																		<span>XP Atual:</span> {this.state.xp}pts {`-->`} <span>XP para Próximo Nível:</span> {this.state.xpRestante}pts
																	</div>
																</span>
															</div>
														</div>
														<div className="row">
															<div className="d-flex justify-content-center">
																<span className="p-1"><i className="fas fa-brain fa-lg text-cosmo-color-1 pr-1"></i> Pontos de Experiência: {this.state.xp}</span>
															</div>
														</div>
														<div className="row">
															<div className="d-flex justify-content-center">
																<span className="p-1"><i className="fas fa-check-circle fa-lg text-cosmo-color-1 pr-1"></i>Respostas Corretas: {this.state.questoes_respondidas}</span>
															</div>
														</div>
													</div>

												</div>
											</div>

											<div className="col-md-8">
												<div className="card p-card">
													<div className="card-header">
														<h5 className="card-title mb-0 text-center">Conquistas</h5>
													</div>

													<div className="card-body">
														<div className="row dados-gerais">
															<div className="d-flex justify-content-center">
																<span className="p-1">
																	<i className="fas fa-scroll fa-lg text-cosmo-color-1 pr-1"></i>
																	<span>Título:</span> {this.state.titulo} {`-->`} <span>Próximo Título:</span> {this.state.proximoTitulo}
																	{
																		this.state.conquistas.map( conquista => {
																			return (
																				<div className="individual-achievement" key={conquista.id_conquista}>
																					<iconAchievement />
																					{/*<BsTrophy />
																					<GrAchievement />*/}
																					{conquista.nome}
																				</div>
																			);
																		})
																	}
																</span>
															</div>
														</div>
													</div>

												</div>
											</div>

										</div>
										<div className="text-center">
											<input id="input-hidden-id" type="hidden" value="5e42943c60f8a538e0130fcc" />
											<button id="btn-update-profile" disabled={!this.state.modificou} type="submit" className="btn btn-cosmo-color-2"><i className="fas fa-save"></i> Salvar</button>
											<div className="float-right">
												<button type="button" onClick={() => this.props.history.goBack()} className="btn btn-danger cosmo-color-1">Voltar</button>
											</div>
										</div>
									</form>

								</div>
							</div>
						</div>
					</div>
				</div>
			</React.Fragment>

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

export default Profile
