import React, { Component } from 'react';
//import Wallpaper from "../images/wallpaper.jpg"
import '../css/CreateTheory.css';
import Spinner from './components/Spinner';
import Navbar from './components/Navbar';
import api from '../services/api';
import jwt_decode from 'jwt-decode';
import Alert from './components/Alert';
import { Editor } from '@tinymce/tinymce-react';
import imgPreview from '../images/avatar.png'

class UpdateTheory extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      cursos: [],
      conceitos: [],
      curso: '',
      conceito: '',
      conteudo: '',
      validation: {
        curso: { wasValidated: false },
        conceito: { wasValidated: false },
      },
      alerts: [],
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.getUserId = this.getUserId.bind(this);
    this.updateItem = this.updateItem.bind(this);
    this.showAlert = this.showAlert.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
	this.handleEditorChange = this.handleEditorChange.bind(this);
  }

  handleEditorChange(value, editor) {
    this.setState({ conteudo: value });
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
	let id = this.props.match.params.id;

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

	if (id) {
		api
		.get(`/theory_manager/${id}`)
		.then(response => {
			return response.data;
		})
		.then(teoria => {
			this.setState({
				id: teoria.id,
				curso: teoria.curso_id,
				conceito: teoria.conceito_id,
				conteudo: teoria.conteudo
			});

			this.validate();
		})
		.catch((err) => {
			console.log(err);
		});
	}
  
	  this.setState({
		  loading: false
	  });
  
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
          validation: { ...prevState.validation, conceito: validation.conceito },
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

  getUserId() {
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);
    return decoded.id;
  }

  updateItem() {
	
	let id = this.props.match.params.id;

    const theory = {
	  user: this.getUserId(),
	  curso: this.state.curso,
	  conceito: this.state.conceito,
	  conteudo: this.state.conteudo
    };
    
	api
      .put(`/theory_manager/${id}`, theory)
      .then((response) => {
        this.setState({ loading: false });

        if (response.data.status) {
          this.showAlert('Conteúdo teórico atualizado com sucesso.', 'success');
        } else {
          this.showAlert('Não foi possível atualizar o conteúdo teórico. Por favor, entre em contato com o administrador do sistema.', 'error');
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        this.showAlert(
          'Ocorreu um erro inesperado. Por favor, entre em contato com o administrador do sistema.', 'error'
        );
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

		this.updateItem();
	}
	
	this.setState({ loading: false });
  }

  render() {
    if (this.state.loading) {
      return <Spinner />;
    }
    const { validation } = this.state;

	const retorno = (
		<React.Fragment>
			<div className='fundo-bg fundo-gray' />

			<section className='jumbotron text-left item-hero'>
			  <div className='container'>
				<div className='row'>
				  <div className='col'>
					<React.Fragment>
					  <h1>Atualizar Conteúdo Teórico</h1>
					  <h6>
						Possibilita atualizar o conteúdo teórico associado a um determinado conceito.
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
				  <div className='row'>
					<div className='col-md-12'>
					  <p className='text-muted'>
						<strong className='campo-obrigatorio'>*</strong> Campo
						Obrigatório
					  </p>
					</div>
				  </div>
				  <div className='controls'>
					<div className='row'>
					  <div className='col-md-6'>
						<div className='form-group'>
						  <label htmlFor='input-frmquest-course-group'>
							Curso <strong className='campo-obrigatorio'>*</strong>
						  </label>
						  <div
							id='input-frmquest-course-group'
							className={
							  !validation.curso.wasValidated
								? 'input-group'
								: validation.curso.hasError
								? 'is-invalid input-group'
								: 'is-valid input-group'
							}
						  >
							<div className='input-group-prepend'>
							  <span className='input-group-text bg-light'>
								<i className='fas fa-globe-americas'></i>
							  </span>
							</div>
							<select
							  id='select-frmquest-course'
							  className={
								!validation.curso.wasValidated
								  ? 'form-control'
								  : validation.curso.hasError
								  ? 'is-invalid form-control'
								  : 'is-valid form-control'
							  }
							  name='curso'
							  placeholder='Curso'
							  value={this.state.curso}
							  aria-label='Curso'
							  onChange={this.onChange}
							>
							  <option value=''> </option>
							  {this.state.cursos.map(function (curso) {
								return (
								  <option
									key={curso.id_curso}
									value={curso.id_curso}
								  >
									{curso.nome_curso}
								  </option>
								);
							  })}
							</select>
						  </div>
						  {validation.curso.hasError && (
							<span className='invalid-feedback'>
							  {validation.curso.errorMessage}
							</span>
						  )}
						</div>
					  </div>

					  <div className='col-md-6'>
						<div className='fomr-group'>
						  <label htmlFor='input-frmquest-title-group'>
							Conceito{' '}
							<strong className='campo-obrigatorio'>*</strong>
						  </label>
						  <div
							id='input-frmquest-title-group'
							className={
							  !validation.conceito.wasValidated
								? 'input-group'
								: validation.conceito.hasError
								? 'is-invalid input-group'
								: 'is-valid input-group'
							}
						  >
							<div className='input-group-prepend'>
							  <span className='input-group-text bg-light'>
								<i className='fas fa-user'></i>
							  </span>
							</div>
							<select
							  id='select-frmquest-course'
							  className={
								!validation.conceito.wasValidated
								  ? 'form-control'
								  : validation.conceito.hasError
								  ? 'is-invalid form-control'
								  : 'is-valid form-control'
							  }
							  name='conceito'
							  placeholder='Conceito'
							  value={this.state.conceito}
							  aria-label='Conceito'
							  onChange={this.onChange}
							>
							  <option value=''> </option>
							  {this.state.conceitos.map(function (conceito) {
								return (
								  <option
									key={conceito.id_conceito}
									value={conceito.id_conceito}
								  >
									{conceito.nome_conceito}
								  </option>
								);
							  })}
							</select>
						  </div>
						  {validation.conceito.hasError && (
							<span className='invalid-feedback'>
							  {validation.conceito.errorMessage}
							</span>
						  )}
						</div>
					  </div>
					</div>
				  </div>


					<div className='row'>
					  <div className='col-md-12'>
						<div className='fomr-group'>
						  <label htmlFor='input-frmquest-title-group'>
							Conteúdo{' '}
							<strong className='campo-obrigatorio'>*</strong>
						  </label>
						  <div
							id='input-frmquest-title-group'
						  >
							<Editor onClick={this.handleClick}
								value={this.state.conteudo}
								onEditorChange={this.handleEditorChange}
								init={{
									height: 500,
									menubar: false,
									images_upload_url: "/upload/image",
									plugins: [
									  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
									  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
									  'insertdatetime', 'media', 'table', 'codesample', 'help', 'wordcount'
									],
									toolbar: 'undo redo | blocks | ' +
									  'bold italic forecolor | alignleft aligncenter ' +
									  'alignright alignjustify | bullist numlist outdent indent | ' +
									  'removeformat | image | media | codesample | table | visualblocks | code | preview | fullscreen | help',
									content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
								  }}
							/>
						  <div>
						  </div>
						  {validation.conceito.hasError && (
							<span className='invalid-feedback'>
							  {validation.conceito.errorMessage}
							</span>
						  )}
						</div>
					  </div>
					</div>
				  </div>
							
				  <div className='row'>
					<div className='col-md-12 text-center register-quest-footer'>
					  <button
						id='btn-question-register'
						type='submit'
						className='btn btn-cadastrar-color-1'
					  >
						<i className='fas fa-save'></i> Atualizar
					  </button>
					  <div className='float-right'>
						<button
						type='button'
						onClick={() => this.props.history.goBack()}
						className='btn btn-danger cosmo-color-1'>
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
export default UpdateTheory;
