import React, { useState, useEffect } from 'react';
//import Wallpaper from "../images/wallpaper.jpg"
import '../css/RegisterQuestion.css';
import Spinner from './components/Spinner';
import Navbar from './components/Navbar';
import api from '../services/api';
import jwt_decode from 'jwt-decode';
import Alert from './components/Alert';
import { ToastProvider, useToasts } from 'react-toast-notifications';

export default function EditConcepts(props) {
  /*constructor() {
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
      alerts: [],
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.getUserId = this.getUserId.bind(this);
    this.createConcept = this.createConcept.bind(this);
    this.showAlert = this.showAlert.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
  }*/

  const [idQuest, setIdQuest] = useState(undefined)
  const [loading, setLoading] = useState(true)
  const [cursos, setCursos] = useState([])
  const [conceitos, setConceitos] = useState([])
  const [curso, setCurso] = useState('')
  const [conceito, setConceito] = useState('')
  const [descricao, setDescricao] = useState('')
  const [validation, setValidation] = useState({
    curso: { wasValidated: false },
    conceito: { wasValidated: false },
  })
  const [state, setState] = useState({
    curso: '',
    conceito: ''
  })

  const { addToast } = useToasts();

  useEffect(() => {
    api
      .get(`/concepts`)
      .then(response => {
        console.log(response.data)
        setLoading(false)
        setConceitos(response.data)
      })
  }, [])

  const showAlert = (msg, status) => {
    addToast(msg, { appearance: status, autoDismiss: true });
    /*let alertsList = this.state.alerts;
    alerts.push(
      <Alert
        msg={msg}
        status={status}
        hide={this.closeAlert.bind(this)}
      />
    );
    this.setState({ alerts: alerts });*/
  }

  /*const closeAlert = () => {
    let alerts = this.state.alerts;
    alerts.shift();
    this.setState({ alerts: alerts });
  }*/

  /*componentDidMount() {
    // let idQuest = this.props.match.params.idQuest

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
  }*/

  const validateField = (name, value) => {
    let validationFunc = { ...validation };

    switch (name) {
      case 'curso':
        //console.log(value)
        if (value === '' || !value) {
          validationFunc.curso = {
            hasError: true,
            errorCode: 'EST001',
            errorMessage: "O campo 'curso' deve ser selecionado.",
          };
        } else {
          validationFunc.curso = {
            hasError: false,
          };
        }
        validationFunc.curso.wasValidated = true;
        setValidation((prevValidation) => (
          { ...prevValidation, curso: validationFunc.curso }
        ));
        break;
      case 'conceito':
        //console.log(value)
        if (value === '' || !value) {
          validationFunc.conceito = {
            hasError: true,
            errorCode: 'EST001',
            errorMessage: "O campo 'conceito' deve ser selecionado.",
          };
        } else {
          validationFunc.conceito = {
            hasError: false,
          };
        }
        validationFunc.conceito.wasValidated = true;
        setValidation((prevValidation) => (
          {
            ...prevValidation,
            conceito: validationFunc.conceito,
          }
        ));
        break;
      default:
        break;
    }
  }

  const validate = () => {
    let validationFunc = { ...validation };

    let wasValidated = true;
    //console.log(validationFunc)
    for (var key in validationFunc) {
      if (!validationFunc[key].wasValidated) {
        validateField(key, state[key]);
        wasValidated = false;
      }
    }

    if (!wasValidated) return false;

    validationFunc = { ...validation };

    return !(validationFunc.curso.hasError || validationFunc.conceito.hasError);
  }

  const onChange = (e) => {
    //e.preventDefault()

    const { name, value } = e.target;
    const stateUpdate = {[name]: value}

    setState(state => ({
      ...state,
      ...stateUpdate
    }));
  }

  const getUserId = () => {
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);
    //console.log("decoded.id: ", decoded.id)
    return decoded.id;
  }

  const createConcept = () => {
    const concept = {
      curso_id: 1,
      descricao: conceito,
    };
    api
      .post('/conceptCreate', concept)
      .then((response) => {
        // console.log(this.state.conceito)
        setLoading(false);
        // console.log(response.data)
        if (response.data.status) {
          // console.log("res:", response.data.conceito)
          showAlert('Conceito cadastrado com sucesso.', 'success');
        } else {
          // console.log("res:", response.data.conceito)
          showAlert(
            'Não foi possível cadastrar o conceito. Por favor, entre em contato com o administrador do sistema.',
            'error'
          );
        }
      })
      .catch((error) => {
        setLoading(false);
        showAlert(
          'Ocorreu um erro inesperado. Por favor, entre em contato com o administrador do sistema.',
          'error'
        );
      });
  }

  const onSubmit = (e) => {
    e.preventDefault();
    //console.log(this.validate())
    setLoading(true);
    if (validate()) {
      let formData = new FormData();
      formData.append('user', getUserId());
      formData.append('curso', curso);
      formData.append('conceito', conceito);
      formData.append('conceito', descricao);
      setDescricao(formData.append('conceito', descricao));
      // console.log(this.state)
      /*this.setState((state, props) => {
        return {
          descricao: formData.append('conceito', this.state.descricao),
        };
      });*/

      if (true) {
        createConcept(formData);
      }
    } else {
      setLoading(false);
    }
  }

  if (loading) {
    return <Spinner />;
  }
  // const { validation } = this.state;

  const retorno = (
    <React.Fragment>
      <div className='fundo-bg fundo-gray' />

      <section className='jumbotron text-left question-hero question-prof'>
        <div className='container'>
          <div className='row'>
            <div className='col'>
              <React.Fragment>
                <h1>Cadastrar Conceito</h1>
                <h6>
                  Ao cadastrar, o conceito ficará disponível para ter questões
                  adicionadas a ele.
                </h6>
              </React.Fragment>
            </div>
          </div>
        </div>
      </section>

      <section className='cosmo-hero'>
        <div className='container wrapper'>
          <form
            onSubmit={onSubmit}
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
                <div className='col-sm-3'>
                  <div className='form-group'>
                    <label htmlFor='input-frmquest-course-group'>
                      Conceito <strong className='campo-obrigatorio'>*</strong>
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

                      {conceitos.map(function (conceito) {
                        console.log(conceito)
                        const valorAtual = state.conceito.flagActive == null ? 'Não' : 'Sim'
                        return (
                          <div className="conceito-info">
                            {conceito.descricao}
                            <select
                              id='select-frmquest-course'
                              className='form-control'
                              name='conceito'
                              placeholder='Conceito'
                              value={state.conceito.flagActive}
                              aria-label='Conceito'
                              onChange={onChange}
                            >
                              <option value=''>{state.conceito.flagActive == null ? 'Sim' : 'Não'}</option>
                              <option value=''>{state.conceito.flagActive == null ? 'Não' : 'Sim'}</option>
                              {/*conceitos.map(function (conceito) {
                                // console.log(conceito)
                                return (
                                  <option
                                    key={conceito.id}
                                    value={conceito.id}
                                  >
                                    {state.conceito.flagActive == null ? 'Não' : 'Sim'}
                                  </option>
                                );
                              })*/}
                            </select>
                          </div>
                        );
                      })}

                      {/*<select
                        id='select-frmquest-course'
                        className='form-control'
                        name='conceito'
                        placeholder='Conceito'
                        value={state.conceito}
                        aria-label='Conceito'
                        onChange={onChange}
                      >
                        <option value=''> </option>
                        {conceitos.map(function (conceito) {
                          // console.log(conceito)
                          return (
                            <option
                              key={conceito.id}
                              value={conceito.id}
                            >
                              {conceito.descricao}
                            </option>
                          );
                        })}
                      </select>*/}
                    </div>
                    {/*validation.curso.hasError && (
                      <span className='invalid-feedback'>
                        {validation.curso.errorMessage}
                      </span>
                    )*/}
                  </div>
                </div>
              </div>

              <div className='row'>
                <div className='col-md-12'>
                  <div className='fomr-group'>
                    <label htmlFor='input-frmquest-title-group'>
                      Conceito
                      <strong className='campo-obrigatorio'> *</strong>
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
                      <input
                        id='input-frmquest-title'
                        type='text'
                        className={
                          !validation.conceito.wasValidated
                            ? 'form-control'
                            : validation.conceito.hasError
                            ? 'is-invalid form-control'
                            : 'is-valid form-control'
                        }
                        name='conceito'
                        placeholder='Conceito'
                        value={conceito}
                        onChange={onChange}
                      />
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
                  <i className='fas fa-save'></i> Salvar
                </button>
                <div className='float-right'>
                  <button
                    type='button'
                    onClick={() => props.history.goBack()}
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
        {/*this.state.alerts.length > 0 ? /*this.state.alerts[0] : null*/}
      </React.Fragment>
    );
  
}