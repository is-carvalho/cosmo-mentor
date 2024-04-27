import React, { Component } from 'react'
//import Wallpaper from "../images/wallpaper.jpg"
//import '../css/Register.css'
import Spinner from './Spinner'
import api from '../../services/api'
import Alert from './components/Alert'

class RegisterQuestion extends Component {
    constructor(){
        super();
        this.state = {
			loading: true,
			testeEntrada: '',
			testeSaida: '',
			casosTeste: [],
			cursos: [],
			dificuldades: [],
			categorias: [],
			conceitos: [],
			curso: '',
			dificuldade: '',
			categoria: '',
			conceito: '',
			titulo: '',
			enunciado: '',
			descEntrada: '',
			descSaida: '',
			resumo: '',
			validation: {
				curso: {wasValidated: false},
				dificuldade: {wasValidated: false},
				categoria: {wasValidated: false},
				conceito: {wasValidated: false},
				titulo: {wasValidated: false},
				enunciado: {wasValidated: false},
				descEntrada: {wasValidated: false},
				descSaida: {wasValidated: false},
				resumo: {wasValidated: false}
			}
        }
        this.onChange = this.onChange.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
		this.newCaseTest = this.newCaseTest.bind(this)
		this.showAlert = this.showAlert.bind(this)
        this.closeAlert = this.closeAlert.bind(this)
    }

	showAlert(msg, status){
        let alerts = this.state.alerts
        alerts.push(<Alert msg={msg} status={status} hide={this.closeAlert.bind(this)}/>)
        this.setState({alerts: alerts})
    }

    closeAlert(){
        let alerts = this.state.alerts
        alerts.shift()
        this.setState({alerts: alerts})
    }

    

    componentDidMount(){
		api.get('courses').then( response => {
			return response.data.map(curso => ({
				id_curso: `${curso.id}`,
				nome_curso: `${curso.nome}`
			}));
		})
		.then( cursos => {
			this.setState({
				cursos: cursos,
				loading: false
			});
		})
		.catch(err => {
			this.showAlert("Erro ao carregar cursos","error")
		})  

		api.get('dificulties').then( response => {
			//console.log(response)
			return response.data.map(dificuldade => ({
				id_dificuldade: `${dificuldade.id}`,
				nome_dificuldade: `${dificuldade.descricao}`
			}));
		})
		.then( dificuldades => {
			
			this.setState({
				dificuldades: dificuldades,
				loading: false
			});
		})
		.catch(err => {
			this.showAlert("Erro ao carregar dificuldades","error")
		})  

		api.get('categories').then( response => {
			return response.data.map(categoria => ({
				id_categoria: `${categoria.id}`,
				nome_categoria: `${categoria.descricao}`
			}));
		})
		.then( categorias => {
			this.setState({
				categorias: categorias,
				loading: false
			});
		})
		.catch(err => {
			this.showAlert("Erro ao carregar categorias","error")
		})  

		api.get('concepts').then( response => {
			return response.data.map(conceito => ({
				id_conceito: `${conceito.id}`,
				nome_conceito: `${conceito.descricao}`
			}));
		})
		.then( conceitos => {
			this.setState({
				conceitos: conceitos,
				loading: false
			});
		})
		.catch(err => {
			this.showAlert("Erro ao carregar conceitos","error")
		})  

		
	}
	
	validateField(name, value) {

		let validation = { ...this.state.validation };

        switch (name) {

            case "curso":
				//console.log(value)
				if(value === "" || !value) {
					validation.curso = {
						hasError: true,
						errorCode:'EST001',
						errorMessage:"O campo 'curso' deve ser selecionado."
					}
				} else {
					validation.curso = {
						hasError: false
					}
				}
				validation.curso.wasValidated = true
				this.setState(prevState => ({ validation: { ...prevState.validation, curso: validation.curso }}))
				break;
			case "dificuldade":
				//console.log(value)
				if(value === "" || !value) {
					validation.dificuldade = {
						hasError: true,
						errorCode:'EST001',
						errorMessage:"O campo 'dificuldade' deve ser selecionado."
					}
				} else {
					validation.dificuldade = {
						hasError: false
					}
				}
				validation.dificuldade.wasValidated = true
				this.setState(prevState => ({ validation: { ...prevState.validation, dificuldade: validation.dificuldade }}))
				break;
			case "categoria":
				//console.log(value)
				if(value === "" || !value) {
					validation.categoria = {
						hasError: true,
						errorCode:'EST001',
						errorMessage:"O campo 'categoria' deve ser selecionado."
					}
				} else {
					validation.categoria = {
						hasError: false
					}
				}
				validation.categoria.wasValidated = true
				this.setState(prevState => ({ validation: { ...prevState.validation, categoria: validation.categoria }}))
				break;
			case "conceito":
				//console.log(value)
				if(value === "" || !value) {
					validation.conceito = {
						hasError: true,
						errorCode:'EST001',
						errorMessage:"O campo 'conceito' deve ser selecionado."
					}
				} else {
					validation.conceito = {
						hasError: false
					}
				}
				validation.conceito.wasValidated = true
				this.setState(prevState => ({ validation: { ...prevState.validation, conceito: validation.conceito }}))
				break;
			case "titulo":
				if(!value || value.length > 100) {
					validation.titulo = {
						hasError: true,
						errorCode:'NOM001',
						errorMessage:"O campo 'titulo' deve possuir no máximo 100 (cem) caracteres."
					}
				} else {
					validation.titulo = {
						hasError: false
					}
				}
				validation.titulo.wasValidated = true
				this.setState(prevState => ({ validation: { ...prevState.validation, titulo: validation.titulo }}))
				break;
			case "enunciado":
				if(!value || value.length > 1024) {
					validation.enunciado = {
						hasError: true,
						errorCode:'NOM001',
						errorMessage:"O campo 'enunciado' deve possuir no máximo 1024 (mil e vinte e quatro) caracteres."
					}
				} else {
					validation.enunciado = {
						hasError: false
					}
				}
				validation.enunciado.wasValidated = true
				this.setState(prevState => ({ validation: { ...prevState.validation, enunciado: validation.enunciado }}))
				break;
			case "descEntrada":
				if(!value || value.length > 100) {
					validation.descEntrada = {
						hasError: true,
						errorCode:'NOM001',
						errorMessage:"O campo 'descrição de entrada' deve possuir no máximo 250 (duzentos e cinquenta) caracteres."
					}
				} else {
					validation.descEntrada = {
						hasError: false
					}
				}
				validation.descEntrada.wasValidated = true
				this.setState(prevState => ({ validation: { ...prevState.validation, descEntrada: validation.descEntrada }}))
				break;
			case "descSaida":
				if(!value || value.length > 100) {
					validation.descSaida = {
						hasError: true,
						errorCode:'NOM001',
						errorMessage:"O campo 'descrição de saída' deve possuir no máximo 250 (duzentos e cinquenta) caracteres."
					}
				} else {
					validation.descSaida = {
						hasError: false
					}
				}
				validation.descSaida.wasValidated = true
				this.setState(prevState => ({ validation: { ...prevState.validation, descSaida: validation.descSaida }}))
				break;
			case "resumo":
				if(!value || value.length > 40) {
					validation.resumo = {
						hasError: true,
						errorCode:'NOM001',
						errorMessage:"O campo 'resumo' deve possuir no máximo 50 (cinquenta) caracteres."
					}
				} else {
					validation.resumo = {
						hasError: false
					}
				}
				validation.resumo.wasValidated = true
				this.setState(prevState => ({ validation: { ...prevState.validation, resumo: validation.resumo }}))
				break;
			default:
                break;
        }

	}
	
	validate() {

		let validation = { ...this.state.validation };

		let wasValidated = true
		//console.log(validation)
		for( var key in validation ) {
			if(!validation[key].wasValidated) {
				this.validateField(key, this.state[key])
				wasValidated = false;
			}
		}

		if(!wasValidated) return false;

		validation = { ...this.state.validation };

		return 	!( 	validation.curso.hasError &&
					validation.titulo.hasError && 
					validation.enunciado.hasError &&
					validation.descEntrada.hasError &&
					validation.descSaida.hasError &&
					validation.resumo.hasError &&
					validation.dificuldade.hasError &&
					validation.categoria.hasError &&
					validation.conceito.hasError )

	}
	
    onChange(e){
		//e.preventDefault()

		const { name, value } = e.target

		this.setState(
			{[name]: value}, 
			() => { this.validateField(name, value) }
		)
	}

    onSubmit(e){
		e.preventDefault()
		
        if (this.validate()) {

			const question = {
				user: this.props.user,
				curso: this.state.curso,
				dificuldade: this.state.dificuldade,
				categoria: this.state.categoria,
				conceito: this.state.conceito,
				titulo: this.state.titulo,
				enunciado: this.state.enunciado,
				descEntrada: this.state.descEntrada,
				descSaida: this.state.descSaida,
				resumo: this.state.resumo
			}
			
			this.props.salvar(question, this.state.casosTeste)
		}
		
	}
	
	newCaseTest(){
		let casosTeste = this.state.casosTeste
		casosTeste.push({
			entrada: this.state.testeEntrada,
			saida: this.state.testeSaida
		})
		this.setState({casosTeste, testeEntrada:'', testeSaida:''})
	}
	
    render() {
		//console.log(this.props)
		if (this.state.loading){
            return <Spinner />
		}
		const { validation } = this.state;

		let dataTable = []
		this.state.casosTeste.forEach((casos,index) => {
			//console.log(questao.updated_at || questao.created_at)
			dataTable.push(
				<tr key={index}>
					<td>{casos.entrada}</td>
					<td>{casos.saida}</td>
				</tr>
			)
		});

        return (
            <React.Fragment>
        		<div id="main">
					<div className = "container wrapper">
						<form onSubmit={this.onSubmit} encType="multipart/form-data" noValidate>
							
						<div className="card-body">

								<div className="form-group">
									<label htmlFor="input-frmuser-state-group">Curso</label>
									<div id="input-frmuser-state-group" className={!validation.curso.wasValidated ? "input-group": validation.curso.hasError ? "is-invalid input-group" : "is-valid input-group"}>
										<div className="input-group-prepend">
											<span className="input-group-text bg-light"><i className="fas fa-globe-americas"></i></span>
										</div>
										<select id="select-frmuser-state" className={!validation.curso.wasValidated ? "form-control": validation.curso.hasError ? "is-invalid form-control" : "is-valid form-control"} 
										name="curso" placeholder="Curso" value={this.state.curso} aria-label="Curso" onChange={this.onChange} >
											<option value=''>--- Selecione um curso ---</option>
											{
												this.state.cursos.map( function(curso) {
													return <option key={curso.id_curso} value={curso.id_curso}>{curso.nome_curso}</option>;
												})
											}
										</select>
									</div>
									{validation.curso.hasError && (<span className="invalid-feedback">{validation.curso.errorMessage}</span>)}
								</div>

								<div className="form-group">
									<label htmlFor="input-frmuser-name-group">Titulo</label>
									<div id="input-frmuser-name-group" className={!validation.titulo.wasValidated ? "input-group": validation.titulo.hasError ? "is-invalid input-group" : "is-valid input-group"}>
										<div className="input-group-prepend">
												<span className="input-group-text bg-light"><i className="fas fa-user"></i></span>
										</div>
										<input id="input-frmuser-name" type="text" className={!validation.titulo.wasValidated ? "form-control": validation.titulo.hasError ? "is-invalid form-control" : "is-valid form-control"} 
										name="titulo" placeholder="Titulo da questão" value={this.state.titulo} onChange={this.onChange} />
									</div>
									{validation.titulo.hasError && (<span className="invalid-feedback">{validation.titulo.errorMessage}</span>)}
								</div>
								
								<div className="form-group">
									<label htmlFor="input-frmuser-nickname-group">Enunciado</label>
									<div id="input-frmuser-nickname-group" className={!validation.enunciado.wasValidated ? "input-group": validation.enunciado.hasError ? "is-invalid input-group" : "is-valid input-group"}>
										<div className="input-group-prepend">
											<span className="input-group-text bg-light"><i className="fas fa-at"></i></span>
										</div>
										<input id="input-frmuser-nickname" type="text" className={!validation.enunciado.wasValidated ? "form-control": validation.enunciado.hasError ? "is-invalid form-control" : "is-valid form-control"} 
										name="enunciado" placeholder="Enunciado da questão" value={this.state.enunciado} onChange={this.onChange} aria-label="Enunciado da questão" />
									</div>
									{validation.enunciado.hasError && (<span className="invalid-feedback">{validation.enunciado.errorMessage}</span>)}
								</div> 

								<div className="form-group">
									<label htmlFor="input-frmuser-nickname-group">Descrição da entrada</label>
									<div id="input-frmuser-nickname-group" className={!validation.descEntrada.wasValidated ? "input-group": validation.descEntrada.hasError ? "is-invalid input-group" : "is-valid input-group"}>
										<div className="input-group-prepend">
											<span className="input-group-text bg-light"><i className="fas fa-at"></i></span>
										</div>
										<input id="input-frmuser-nickname" type="text" className={!validation.descEntrada.wasValidated ? "form-control": validation.descEntrada.hasError ? "is-invalid form-control" : "is-valid form-control"} 
										name="descEntrada" placeholder="Descrição da entrada" value={this.state.descEntrada} onChange={this.onChange} aria-label="Descrição da entrada" />
									</div>
									{validation.descEntrada.hasError && (<span className="invalid-feedback">{validation.descEntrada.errorMessage}</span>)}
								</div> 

								<div className="form-group">
									<label htmlFor="input-frmuser-nickname-group">Descrição da saída</label>
									<div id="input-frmuser-nickname-group" className={!validation.descSaida.wasValidated ? "input-group": validation.descSaida.hasError ? "is-invalid input-group" : "is-valid input-group"}>
										<div className="input-group-prepend">
											<span className="input-group-text bg-light"><i className="fas fa-at"></i></span>
										</div>
										<input id="input-frmuser-nickname" type="text" className={!validation.descSaida.wasValidated ? "form-control": validation.descSaida.hasError ? "is-invalid form-control" : "is-valid form-control"} 
										name="descSaida" placeholder="Descrição da saída" value={this.state.descSaida} onChange={this.onChange} aria-label="Descrição da saída" />
									</div>
									{validation.descSaida.hasError && (<span className="invalid-feedback">{validation.descSaida.errorMessage}</span>)}
								</div>  

								<div className="form-group">
									<label htmlFor="input-frmuser-nickname-group">Resumo</label>
									<div id="input-frmuser-nickname-group" className={!validation.resumo.wasValidated ? "input-group": validation.resumo.hasError ? "is-invalid input-group" : "is-valid input-group"}>
										<div className="input-group-prepend">
											<span className="input-group-text bg-light"><i className="fas fa-at"></i></span>
										</div>
										<input id="input-frmuser-nickname" type="text" className={!validation.resumo.wasValidated ? "form-control": validation.resumo.hasError ? "is-invalid form-control" : "is-valid form-control"} 
										name="resumo" placeholder="Resumo" value={this.state.resumo} onChange={this.onChange} aria-label="Resumo" />
									</div>
									{validation.resumo.hasError && (<span className="invalid-feedback">{validation.resumo.errorMessage}</span>)}
								</div> 
								
								<div className="form-group">
									<label htmlFor="input-frmuser-state-group">Dificuldade</label>
									<div id="input-frmuser-state-group" className={!validation.dificuldade.wasValidated ? "input-group": validation.dificuldade.hasError ? "is-invalid input-group" : "is-valid input-group"}>
										<div className="input-group-prepend">
											<span className="input-group-text bg-light"><i className="fas fa-globe-americas"></i></span>
										</div>
										<select id="select-frmuser-state" className={!validation.dificuldade.wasValidated ? "form-control": validation.dificuldade.hasError ? "is-invalid form-control" : "is-valid form-control"} 
										name="dificuldade" placeholder="Dificuldade" value={this.state.dificuldade} aria-label="Dificuldade" onChange={this.onChange} >
											<option value=''>--- Selecione a dificuldade ---</option>
											{
												this.state.dificuldades.map( function(dificuldade) {
													return <option key={dificuldade.id_dificuldade} value={dificuldade.id_dificuldade}>{dificuldade.nome_dificuldade}</option>;
												})
											}
										</select>
									</div>
									{validation.dificuldade.hasError && (<span className="invalid-feedback">{validation.dificuldade.errorMessage}</span>)}
								</div>
								
								<div className="form-group">
									<label htmlFor="input-frmuser-state-group">Categoria</label>
									<div id="input-frmuser-state-group" className={!validation.categoria.wasValidated ? "input-group": validation.categoria.hasError ? "is-invalid input-group" : "is-valid input-group"}>
										<div className="input-group-prepend">
											<span className="input-group-text bg-light"><i className="fas fa-globe-americas"></i></span>
										</div>
										<select id="select-frmuser-state" className={!validation.categoria.wasValidated ? "form-control": validation.categoria.hasError ? "is-invalid form-control" : "is-valid form-control"} 
										name="categoria" placeholder="Categoria" value={this.state.categoria} aria-label="Categoria" onChange={this.onChange} >
											<option value=''>--- Selecione a categoria ---</option>
											{
												this.state.categorias.map( function(categoria) {
													return <option key={categoria.id_categoria} value={categoria.id_categoria}>{categoria.nome_categoria}</option>;
												})
											}
										</select>
									</div>
									{validation.categoria.hasError && (<span className="invalid-feedback">{validation.categoria.errorMessage}</span>)}
								</div>

								<div className="form-group">
									<label htmlFor="input-frmuser-state-group">Conceito</label>
									<div id="input-frmuser-state-group" className={!validation.conceito.wasValidated ? "input-group": validation.conceito.hasError ? "is-invalid input-group" : "is-valid input-group"}>
										<div className="input-group-prepend">
											<span className="input-group-text bg-light"><i className="fas fa-globe-americas"></i></span>
										</div>
										<select id="select-frmuser-state" className={!validation.conceito.wasValidated ? "form-control": validation.conceito.hasError ? "is-invalid form-control" : "is-valid form-control"} 
										name="conceito" placeholder="Conceito" value={this.state.conceito} aria-label="conceito" onChange={this.onChange} >
											<option value=''>--- Selecione o conceito ---</option>
											{
												this.state.conceitos.map( function(conceito) {
													return <option key={conceito.id_conceito} value={conceito.id_conceito}>{conceito.nome_conceito}</option>;
												})
											}
										</select>
									</div>
									{validation.conceito.hasError && (<span className="invalid-feedback">{validation.conceito.errorMessage}</span>)}
								</div>

								<div className="form-group">
									<label htmlFor="input-frmuser-state-group">Casos de Teste</label>
									<div id="input-frmuser-state-group">							
										<table className="table" cellSpacing="0" cellPadding="0">
											<thead>
												<tr>
													<th>Entrada</th>
													<th>Saída</th>
												</tr>
											</thead>
											<tbody>
												{dataTable}								
											</tbody>
										</table>
										<input type="text" name="testeEntrada" placeholder="Nova entrada" value={this.state.testeEntrada} onChange={this.onChange} />
										<input type="text" name="testeSaida" placeholder="Nova saída" value={this.state.testeSaida} onChange={this.onChange} />
										<button type="button" onClick={this.newCaseTest}>Adicionar</button>

									</div>
								</div>
								
							</div>

							<div className="card-footer text-center">
								<input id="input-hidden-id" type="hidden" value="5e42943c60f8a538e0130fcc"/>
								<button id="btn-update-register" type="submit" className="btn btn-cadastrar-color-1"><i className="fas fa-save"></i> Salvar</button>
							</div>
										
						</form>

					</div>
				</div>
				{this.state.alerts.length > 0 ? this.state.alerts[0] : null}
            </React.Fragment>                                  
        )

    }
}
export default RegisterQuestion