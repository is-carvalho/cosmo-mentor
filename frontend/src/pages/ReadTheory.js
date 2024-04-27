import React, { Component, useEffect } from 'react';

import '../css/ReadTheory.css';
import Spinner from './components/Spinner';
import Navbar from './components/Navbar';
import api from '../services/api';
import jwt_decode from 'jwt-decode';
import Alert from './components/Alert';
import Prism from "prismjs";
import "prismjs/themes/prism-okaidia.css";
import "prismjs/components/prism-python";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-lua";
import "prismjs/components/prism-java";
import "prismjs/plugins/toolbar/prism-toolbar.min.css";
import "prismjs/plugins/toolbar/prism-toolbar.min";
import "prismjs/plugins/line-numbers/prism-line-numbers.js";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs/plugins/show-language/prism-show-language.js";
import "prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.js";

class ReadTheory extends Component {
	constructor() {
		super();
		this.state = {
			loading: true,
			curso_id: '',
			conceito_id: '',
			conteudo: '',
			alerts: [],
		};

		this.getUserId = this.getUserId.bind(this);
	}



	componentDidMount() {

		Prism.highlightAll();

		let id = this.props.match.params.id;

		api
			.get(`/theory_manager/${id}`)
			.then(response => {
				return response.data;
			})
			.then(teoria => {
				this.setState({
					id: teoria.id,
					curso: teoria.curso,
					conceito: teoria.conceito,
					conteudo: teoria.conteudo
				});
			})
			.catch((err) => {
				console.log(err);
			});

		this.setState({
			loading: false
		});

	}

	componentDidUpdate() {
		Prism.highlightAll();
	}

	getUserId() {
		const token = localStorage.usertoken;
		const decoded = jwt_decode(token);

		return decoded.id;
	}

	render() {
		if (this.state.loading) {
			return <Spinner />;
		}

		const retorno = (
			<React.Fragment>
				<div className='fundo-bg fundo-gray' />

				<section className='jumbotron text-left item-hero'>
					<div className='container'>
						<div className='row'>
							<div className='col'>
								<React.Fragment>
									<h1>Visualizar Conteúdo Teórico</h1>
									<h6>
										Possibilita visualizar o conteúdo teórico associado a um determinado conceito.
									</h6>
								</React.Fragment>
							</div>
						</div>
					</div>
				</section>

				<section className='cosmo-hero'>
					<div className='container wrapper'>
						<form
							onSubmit={this.onSubmit}
							className='form-question'
							encType='multipart/form-data'
							noValidate
						>
							<div className='controls'>
								<div className='row'>
									<div className='col-sm-6'>
										<div className='form-group'>
											<label htmlFor='input-frmquest-course-group'>
												Curso
											</label>
											<div
												id='input-frmquest-course-group'
												className='input-group'
											>
												<div className='input-group-prepend'>
													<span className='input-group-text bg-light'>
														<i className='fas fa-globe-americas'></i>
													</span>
												</div>
												<input
													id='input-frmquest-title'
													type='text'
													className='form-control'
													name='curso'
													placeholder='Curso'
													value={this.state.curso}
													disabled='disabled'
												/>
											</div>
										</div>
									</div>

									<div className='col-md-6'>
										<div className='fomr-group'>
											<label htmlFor='input-frmquest-title-group'>
												Conceito
											</label>
											<div
												id='input-frmquest-title-group'
												className='input-group'
											>
												<div className='input-group-prepend'>
													<span className='input-group-text bg-light'>
														<i className='fas fa-user'></i>
													</span>
												</div>
												<input
													id='input-frmquest-title'
													type='text'
													className='form-control'
													name='conceito'
													placeholder='Conceito'
													value={this.state.conceito}
													disabled='disabled'
												/>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className='row'>
								<div className='col-md-12'>
									<div className='fomr-group'>
										<label htmlFor='input-frmquest-title-group'>
											Conteúdo
										</label>
										<div
											id='input-frmquest-title-group'
										>

											<section
												className="sec-id"
												dangerouslySetInnerHTML={{ __html: this.state.conteudo }}
											/>

										</div>
									</div>
								</div>
							</div>

							<div className='row'>
								<div className='col-md-12 text-center register-quest-footer'>
									<div className='float-right'>
										<button
											type='button'
											onClick={() => this.props.history.goBack()}
											className='btn btn-danger cosmo-color-1'
										>
											Voltar
										</button>
									</div>
								</div>
							</div>
						</form>
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
export default ReadTheory;
