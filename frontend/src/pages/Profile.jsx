import api from '../services/api'
import React, { Component, useEffect, useState, useRef } from 'react'
import jwt_decode from 'jwt-decode'
import imgPreview from '../images/avatar.png'
import Spinner from './components/Spinner'
import Navbar from './components/Navbar'
import Alert from './components/Alert.jsx'
import '../css/Profile.css'
import { BsTrophy} from "react-icons/bs"
//import { GrAchievement } from "react-icons/gr"
import { AiOutlineCheckCircle } from "react-icons/ai"
import { AiOutlineCloseCircle } from "react-icons/ai"
import { getNivel } from './components/Nivel.jsx';

//import { getConquistas } from './components/Conquista' //CONQUISTAS!!!!!!!!!!!!!!

import trofeu from "../images/trophy.png"

export default function Profile(props) {
	const refContainer = useRef(null);

	let imagePreviewUrl = imgPreview

	const [email, setEmail] = useState('')
	const [nome, setNome] = useState('')
	const [userName, setUserName] = useState('')
	const [nascimento, setNascimento] = useState('')
	const [estado, setEstado] = useState('')
	const [municipio, setMunicipio] = useState('')
	const [foto, setFoto] = useState('')
	const [file, setFile] = useState('')
	const [estados, setEstados] = useState([])
	const [municipios, setMunicipios] = useState([])
	const [sexo, setSexo] = useState('')
	const [xp, setXp] = useState(0)
	const [titulo_id, setTituloId] = useState(0)
	const [alerts, setAlerts] = useState([])
	const [modificou, setModificou] = useState(false)
	const [loading, setLoading] = useState(true)
	const [porcentagemProgresso, setPorcentagemProgresso] = useState(0)
	const [xpNecessario, setXpNecessario] = useState(0)
	const [proximoTitulo, setProximoTitulo] = useState('')

	const [id, setId] = useState('')
	const [name, setName] = useState('')
	const [testFile, setTestFile] = useState(null)
	const [saldo_moedas, setSaldo_moedas] = useState(0)
	const [moedas_acumuladas, setMoedas_acumuladas] = useState(0)
	const [moedas_utilizadas, setMoedas_utilizadas] = useState(0)
	const [titulo, setTitulo] = useState('')
	const [questoes_respondidas, setQuestoes_respondidas] = useState('')
	
	/*const [conquistas, setConquistas] = useState([])
	const [conquistasClass, setConquistasClass] = useState({})*/ //CONQUISTAS!!!!!!!

	const closeAlert = () => {
		let alertsList = alerts
		alertsList.shift()
		setAlerts(alertsList)
	}

	const showAlert = (msg, status) => {
		let alertsList = alerts
		alertsList.push(<Alert msg={msg} status={status} hide={closeAlert} />)
		setAlerts(alertsList)
	}

	useEffect(() => {
		let array = getNivel(xp)
		
		setProximoTitulo(array[4])
		setXpNecessario(array[2])
		setPorcentagemProgresso(array[1])
		setTitulo(array[0])
	}, [xp])

	useEffect(() => {		
		const token = localStorage.usertoken
		const decoded = jwt_decode(token)
		// console.log(decoded)
		const idUser = decoded.id

		api.get(`/user/${idUser}`)
			.then(response => {
				return response.data;
			})
			.then(usuario => {

				getMunicipios(usuario.estado)

				setId(usuario.id)
				setUserName(usuario.userName)
				setEmail(usuario.email)
				setNome(usuario.nome)
				setNascimento(usuario.nascimento)
				setEstado(usuario.estado)
				setMunicipio(usuario.municipio)
				setSexo(usuario.sexo)
				setXp(usuario.xp)
				setSaldo_moedas(usuario.saldo_moedas)
				setMoedas_acumuladas(usuario.moedas_acumuladas)
				setMoedas_utilizadas(usuario.moedas_utilizadas)
				setQuestoes_respondidas(usuario.questoes_respondidas)
				setTitulo(usuario.titulo)
				setTituloId(usuario.titulo_id)
				setFoto(usuario.foto)
				setLoading(false)
			})
			.catch(err => {
				setLoading(false)
				showAlert("Erro ao carregar dados do usuário", "error")
			})


		api.get(`/states`).then(response => {
			return response.data.map(estado => ({
				id_estado: `${estado.id}`,
				nome_estado: `${estado.nome}`
			}));
		})
			.then(estados => {
				setEstados(estados)
				/*this.setState({
					estados
				});*/
			})
			.catch(err => {
				showAlert("Erro ao carregar estados", "error")
			})

		/*api.get(`/achievement`) //CONQUISTAS!!!!!!!!
			.then(response => {
				console.log(response.data.data)

				api
          		  .get(`/statsUser/${parseInt(decoded.id)}`)
          		  .then((response2) => {
          		    // sessionStorage.setItem('stats', JSON.stringify(response.data.data[0]))
          		    const stats = response2.data.data[0]
					// console.log(getConquistas(response.data.data, stats).getAchievements())
					let conqs = getConquistas(response.data.data, stats).getAchievements()
					for(let i = 0; i < conqs.length; i++) {
						conqs[i] = {
							...conqs[i],
							descricao: response.data.data[i].descricao
						}
					}
					setConquistasClass(getConquistas(response.data.data, stats))
          		    setConquistas(conqs)
          		    console.log(conqs)
          		  })

			})*/
	}, [])

	const validate = () => {

		let isError = false;
		const errors = {};
		if (nome === '') {
			isError = true;
			errors.name = 'Você deve preencher o campo nome completo.';
		}

		if (email === '') {
			isError = true;
			errors.email = 'Você deve preencher o campo e-mail';
		}

		if (testFile === null) {
			isError = true;
			errors.file = 'Você deve selecionar um avatar';
		}

		if (isError) {

			setName(errors.name)
			setEmail(errors.email)
			setFile(errors.file)

			/*this.setState({
				...this.state,
				...errors
			})*/
		}

		return isError;
	}

	const wrapImage = (e) => {
		document.getElementById("input-frmuser-fileupload").click();
	}

	const loadAvatar = (e) => {

		e.preventDefault();

		let reader = new FileReader();
		let targetFile = e.target.files[0];

		if (e.target.files.length === 0) {
			//console.log("Erro - Nenhuma imagem foi selecionada.");
			return;
		}

		if (!/^(?:image\/bmp|image\/cis-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x-cmu-raster|image\/x-cmx|image\/x-icon|image\/x-portable-anymap|image\/x-portable-bitmap|image\/x-portable-graymap|image\/x-portable-pixmap|image\/x-rgb|image\/x-xbitmap|image\/x-xpixmap|image\/x-xwindowdump)$/i.test(targetFile.type)) {
			showAlert("Erro - O tipo da imagem não é válido.", "error");
			return;
		}

		reader.onloadend = () => {
			setFile(targetFile)
			setFoto(reader.result)
			setModificou(true)
		}

		reader.readAsDataURL(targetFile)
	}

	const onChange = (e) => { // ADAPTAR!!!!!
		this.setState({ [e.target.name]: e.target.value, modificou: true })
		//console.log(e.target.name, e.target.value)
	}

	const getMunicipios = (estado, valueDefault = false) => {
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
				setMunicipios(municipios)

				if (valueDefault) {
					//console.log("entrou", municipios[0])
					setMunicipio(municipios[0].id_municipio)
					//console.log(this.state.municipio)
				}
			})
			.catch(err => {
				showAlert("Erro ao carregar municípios", "error")
			})
	}

	const changeEstado = (e) => {
		onChange(e)
		getMunicipios(e.target.value, true)
	}

	const onSubmit = (e) => {
		e.preventDefault()

		const err = validate();
		//console.log(this.state)
		setLoading(true)
		if (!err) {
			let formData = new FormData();
			formData.append('email', email);
			formData.append('nome', nome);
			formData.append('id', id);
			formData.append('nascimento', nascimento);
			formData.append('municipio', municipio);
			formData.append('sexo', sexo);
			formData.append('foto', foto);

			if (file !== "")
				formData.append('avatar', file, "avatar.png");

			/*
			const formKeys    = formData.keys();
			const formEntries = formData.entries();
			do {
			  console.log(formEntries.next().value);
			} while (!formKeys.next().done)
			*/

			api.put(`/user/${id}`, formData)
				.then(res => {
					setLoading(false)
					//console.log(res)
					if (res.data.status) {
						showAlert("Dados atualizados com sucesso", "success")
						setModificou(false)
					} else {
						showAlert("Erro ao atualizar dados do usuário", "error")
					}
				})
				.catch(err => {
					setLoading(false)
					showAlert("Erro ao atualizar dados do usuário", "error")
				})
		} else {
			setLoading(false)
			showAlert("Erro: preencha todos os campos", "error")
		}
	}

	if (loading) {
		return <Spinner />
	}

	let $imagePreview = null;
	if (foto === null) {
		$imagePreview = imagePreviewUrl
	} else {
		$imagePreview = foto
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
										<input id="input-frmuser-fileupload" type="file" className="d-none" onChange={loadAvatar} /*ref="file"*/ref={refContainer} name="avatar" />
										<button type="button" className="btn btn-cosmo-color-1 rounded mr-1" id="btn-alter-image" onClick={wrapImage}><i className="fa fa-camera-retro"></i></button>
									</div>

								</div>
							</div>

							<div className="container body-profile">
								<form onSubmit={onSubmit} encType="multipart/form-data">
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
															<input id="input-frmuser-name" type="text" className="form-control" name="nome" placeholder="Nome completo" value={nome} onChange={onChange} />
														</div>
													</div>

													<div className="form-group">
														<label htmlFor="input-frmuser-sexo-group">Gênero</label>
														<div className="input-group " id="input-frmuser-sexo-group">
															<div className="form-check form-check-inline">
																<label className="form-check-label pr-1" htmlFor="input-frmuser-sexo-male"> Masculino </label>
																<input className="form-check-input mt-1" type="radio" id="input-frmuser-sexo-male" name="sexo" value="M" checked={sexo === "M"} onChange={onChange} />
															</div>
															<div className="form-check form-check-inline">
																<label className="form-check-label pr-1" htmlFor="input-frmuser-sexo-female"> Feminino</label>
																<input className="form-check-input mt-1" type="radio" id="input-frmuser-sexo-female" name="sexo" value="F" checked={sexo === "F"} onChange={onChange} />
															</div>
														</div>
													</div>


													<div className="form-group">
														<label htmlFor="input-frmuser-email">Email</label>
														<div className="input-group" id="input-frmuser-email-group">
															<div className="input-group-prepend">
																<span className="input-group-text bg-light"><i className="fas fa-envelope"></i></span>
															</div>
															<input id="input-frmuser-email" disabled type="text" className="form-control" name="email" placeholder="Email" value={email} />
														</div>
													</div>

													<div className="form-group">
														<label htmlFor="input-frmuser-state-group">Estado</label>
														<div className="input-group" id="input-frmuser-state-group">
															<div className="input-group-prepend">
																<span className="input-group-text bg-light"><i className="fas fa-globe-americas"></i></span>
															</div>
															<select id="select-frmuser-state" className="form-control" name="estado" placeholder="Estado" value={estado} aria-label="Estado" onChange={changeEstado}>
																{
																	estados.map(function (estado) {
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
															<select id="select-frmuser-city" className="form-control" name="municipio" placeholder="municipio" value={municipio} aria-label="Município" onChange={onChange}>
																{
																	municipios?.map(function (municipio) {
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
															<input id="input-frmuser-birthday" type="date" className="form-control" name="nascimento" placeholder="Data de nascimento" value={nascimento} aria-label="Data de nascimento" onChange={onChange}></input>
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
																<span>Título:</span> {titulo} {`-->`} <span>Próximo Título:</span> {proximoTitulo}
																<div
          	  	    											  className="progress"
          	  	    											  style={{ width: "100%", marginRight: "5vw" }}
          	  	    											>
          	  	    											    <div
          	  	    											      className="progress-bar"
          	  	    											      role="progressbar"
          	  	    											      style={{ width: `${porcentagemProgresso}%` }}
          	  	    											      aria-valuenow="0"
          	  	    											      aria-valuemin="0"
          	  	    											      aria-valuemax="100"
          	  	    											    >
          	  	    											    </div>
                    											    <div className="xp">
                    											      {`${xp}/${xpNecessario} XP`}
                    											    </div>
          	  	    											</div>
																<div className="xp-atual">
																	<span>XP Atual:</span> {xp}pts {`-->`} <span>XP para Próximo Nível:</span> {xpNecessario}pts
																</div>
															</span>
														</div>
													</div>
													<div className="row">
														<div className="d-flex justify-content-center">
															<span className="p-1"><i className="fas fa-brain fa-lg text-cosmo-color-1 pr-1"></i> Pontos de Experiência: {xp}</span>
														</div>
													</div>
													<div className="row">
														<div className="d-flex justify-content-center">
															<span className="p-1"><i className="fas fa-check-circle fa-lg text-cosmo-color-1 pr-1"></i>Respostas Corretas: {questoes_respondidas}</span>
														</div>
													</div>
												</div>

											</div>
										</div>

										{/*<div className="col-md-8"> //CONQUISTAS!!!!!!!!!!!!
											<div className="card p-card">
												<div className="card-header">
													<h5 className="card-title mb-0 text-center">Conquistas</h5>
												</div>

												<div className="card-body">
													<div className="row dados-gerais">
														<div className="d-flex justify-content-center">
															<span className="p-1">
																<div className="achievements">
																	<div className="center">
																	{
																		conquistas?.map( conquista => {
																			let stats = {
																				nivel_atual: "Nível Atual",
																				total_moedas: "Moedas Acumuladas",
																			};
																			let iconeClass = 'imgGray'
																			let nomeConq = conquista.name
																			if (conquista.unlocked) {
																				iconeClass = `img`
																				nomeConq = `${conquista.name}`
																			}

																			return (
																				<div className="individual-achievement" key={conquista.id_conquista}>
																					<img src={trofeu} alt="" className={iconeClass} />
																					{nomeConq}
																					<div className="achDesc">
																						{conquista.descricao}
																					</div>
																					<div className="progressEncap" style={{width: "100%",}}>
																						<span>PROGRESSO</span>
																						<div
          	    																		  className="progress"
          	    																		  style={{ width: "100%", marginRight: "0vw" }}
          	    																		>
          	    																			<div
          	    																				className="progress-bar"
          	    																				role="progressbar"
          	    																				style={{ width: `${conquista.progress}%` }}
          	    																				aria-valuenow="0"
          	    																				aria-valuemin="0"
          	    																				aria-valuemax="100"
          	    																			>
          	    																			</div>

                    																		<div className="xp">
                    																			{`${conquista.progress}/100%`}
                    																		</div>
          	    																		</div>
																					</div>

																					<div className="props">
																						<span>REQUISITOS:</span>
																						<br/>
																						{conquista.props?.map((propAtual) => {
																							let iconStyle = {
																								color: 'red',
																								fontSize: '25px'
																							}
																							let statAtual = stats[propAtual.propName]
																							let indicacao = <AiOutlineCloseCircle style={iconStyle} />

																							if(propAtual.isActive) {
																								iconStyle = {
																									color: '#55f495',
																									fontSize: '25px'
																								}
																								indicacao = <AiOutlineCheckCircle style={iconStyle} />
																							}

																							return (
																								<div>
																									{statAtual}: {propAtual.activationValue} {indicacao}
																								</div>
																							);
																						})}
																					</div>
																				</div>
																			);
																		})
																	}
																	</div>
																</div>
															</span>
														</div>
													</div>
												</div>

											</div>
										</div>*/}

									</div>
									<div className="text-center">
										<input id="input-hidden-id" type="hidden" value="5e42943c60f8a538e0130fcc" />
										<button id="btn-update-profile" disabled={!modificou} type="submit" className="btn btn-cosmo-color-2"><i className="fas fa-save"></i> Salvar</button>
										<div className="float-right">
											<button type="button" onClick={() => props.history.goBack()} className="btn btn-danger cosmo-color-1">Voltar</button>
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
				{alerts.length > 0 ? alerts[0] : null}
			</React.Fragment>
		)


	
}
