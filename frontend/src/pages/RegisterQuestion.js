import React, { Component } from 'react';
//import Wallpaper from "../images/wallpaper.jpg"
import '../css/RegisterQuestion.css';
import Spinner from './components/Spinner';
import Navbar from './components/Navbar';
import api from '../services/api';
import jwt_decode from 'jwt-decode';
import Alert from './components/Alert';
import GoBackButton from './components/BotaoVoltar';

class RegisterQuestion extends Component {
  constructor() {
    super();
    this.state = {
      idQuest: undefined,
      loading: true,
      testeVisivel: '0',
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
      observacao: '',
      resumo: '',
      foto: '',
      file: '',
      xp: 0,
      validation: {
        curso: { wasValidated: false },
        dificuldade: { wasValidated: false },
        categoria: { wasValidated: false },
        conceito: { wasValidated: false },
        titulo: { wasValidated: false },
        enunciado: { wasValidated: false },
        descEntrada: { wasValidated: false },
        descSaida: { wasValidated: false },
        resumo: { wasValidated: false },
        xp: { wasValidated: false },
      },
      alerts: [],
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.newCaseTest = this.newCaseTest.bind(this);
    this.loadAvatar = this.loadAvatar.bind(this);
    this.getUserId = this.getUserId.bind(this);
    this.onChangeTestCase = this.onChangeTestCase.bind(this);
    this.createQuestion = this.createQuestion.bind(this);
    this.updateQuestion = this.updateQuestion.bind(this);
    this.showAlert = this.showAlert.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
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
    let idQuest = this.props.match.params.idQuest;

    if (idQuest) {
      idQuest = jwt_decode(this.props.match.params.idQuest);
      this.setState({ idQuest });

      api
        .get(`/question/${idQuest}`)
        .then((response) => {
          return response.data;
        })
        .then((questao) => {
          //console.log('questao',questao)
          this.setState({
            curso: questao.curso_id,
            dificuldade: questao.dificuldade_id,
            categoria: questao.categoria_id,
            conceito: questao.conceito_id,
            titulo: questao.titulo,
            enunciado: questao.enunciado,
            descEntrada: questao.descricao_entrada,
            descSaida: questao.descricao_saida,
            resumo: questao.resumo,
            observacao: questao.observacao,
            foto: questao.imagem,
            xp: questao.xp,
          });

          this.validate();
        });

      api
        .get('/testCasesFromQuestion', {
          headers: {
            question: idQuest,
          },
        })
        .then((response) => {
          return response.data;
        })
        .then((casosTeste) => {
          //console.log('casosTeste',casosTeste);
          let aux = [];
          for (let i = 0; i < casosTeste.entradas.length; i++) {
            aux.push({
              entrada: casosTeste.entradas[i],
              saida: casosTeste.saidas[i],
              id: casosTeste.ids[i],
              visivel: casosTeste.visivel[i] + '',
              status: 2,
            });
          }
          this.setState({ casosTeste: aux });
        })
        .catch((err) => {
          this.showAlert('Erro ao carregadar todos os casos de teste', 'error');
        });
    }

    //console.log(idQuest)

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
      .get('/dificulties')
      .then((response) => {
        //console.log(response)
        return response.data.map((dificuldade) => ({
          id_dificuldade: `${dificuldade.id}`,
          nome_dificuldade: `${dificuldade.descricao}`,
        }));
      })
      .then((dificuldades) => {
        this.setState({
          dificuldades: dificuldades,
          loading: false,
        });
      })
      .catch((err) => {
        this.showAlert('Erro ao carregar dificuldades', 'error');
      });

    api
      .get('/categories')
      .then((response) => {
        return response.data.map((categoria) => ({
          id_categoria: `${categoria.id}`,
          nome_categoria: `${categoria.descricao}`,
        }));
      })
      .then((categorias) => {
        this.setState({
          categorias: categorias,
          loading: false,
        });
      })
      .catch((err) => {
        this.showAlert('Erro ao carregar categorias', 'error');
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
  }

  validateField(name, value) {
    let validation = { ...this.state.validation };

    switch (name) {
      case 'curso':
        //console.log(value)
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
      case 'dificuldade':
        //console.log(value)
        if (value === '' || !value) {
          validation.dificuldade = {
            hasError: true,
            errorCode: 'EST001',
            errorMessage: "O campo 'dificuldade' deve ser selecionado.",
          };
        } else {
          validation.dificuldade = {
            hasError: false,
          };
        }
        validation.dificuldade.wasValidated = true;
        this.setState((prevState) => ({
          validation: {
            ...prevState.validation,
            dificuldade: validation.dificuldade,
          },
        }));
        break;
      case 'categoria':
        //console.log(value)
        if (value === '' || !value) {
          validation.categoria = {
            hasError: true,
            errorCode: 'EST001',
            errorMessage: "O campo 'categoria' deve ser selecionado.",
          };
        } else {
          validation.categoria = {
            hasError: false,
          };
        }
        validation.categoria.wasValidated = true;
        this.setState((prevState) => ({
          validation: {
            ...prevState.validation,
            categoria: validation.categoria,
          },
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
      case 'titulo':
        if (!value || value.length > 100) {
          validation.titulo = {
            hasError: true,
            errorCode: 'NOM001',
            errorMessage:
              "O campo 'titulo' deve possuir no máximo 100 (cem) caracteres.",
          };
        } else {
          validation.titulo = {
            hasError: false,
          };
        }
        validation.titulo.wasValidated = true;
        this.setState((prevState) => ({
          validation: { ...prevState.validation, titulo: validation.titulo },
        }));
        break;
      case 'enunciado':
        //console.log(!value)
        if (!value || value.length > 1024) {
          //console.log("entrou")
          validation.enunciado = {
            hasError: true,
            errorCode: 'NOM001',
            errorMessage:
              "O campo 'enunciado' deve possuir no máximo 1024 (mil e vinte e quatro) caracteres.",
          };
        } else {
          validation.enunciado = {
            hasError: false,
          };
        }
        validation.enunciado.wasValidated = true;
        this.setState((prevState) => ({
          validation: {
            ...prevState.validation,
            enunciado: validation.enunciado,
          },
        }));
        break;
      case 'descEntrada':
        if (!value || value.length > 1000) {
          validation.descEntrada = {
            hasError: true,
            errorCode: 'NOM001',
            errorMessage:
              "O campo 'descrição de entrada' deve possuir no máximo 1000 (duzentos e cinquenta) caracteres.",
          };
        } else {
          validation.descEntrada = {
            hasError: false,
          };
        }
        validation.descEntrada.wasValidated = true;
        this.setState((prevState) => ({
          validation: {
            ...prevState.validation,
            descEntrada: validation.descEntrada,
          },
        }));
        break;
      case 'descSaida':
        if (!value || value.length > 1000) {
          validation.descSaida = {
            hasError: true,
            errorCode: 'NOM001',
            errorMessage:
              "O campo 'descrição de saída' deve possuir no máximo 1000 (duzentos e cinquenta) caracteres.",
          };
        } else {
          validation.descSaida = {
            hasError: false,
          };
        }
        validation.descSaida.wasValidated = true;
        this.setState((prevState) => ({
          validation: {
            ...prevState.validation,
            descSaida: validation.descSaida,
          },
        }));
        break;
      case 'resumo':
        if (!value || value.length > 40) {
          validation.resumo = {
            hasError: true,
            errorCode: 'NOM001',
            errorMessage:
              "O campo 'resumo' deve possuir no máximo 50 (cinquenta) caracteres.",
          };
        } else {
          validation.resumo = {
            hasError: false,
          };
        }
        validation.resumo.wasValidated = true;
        this.setState((prevState) => ({
          validation: { ...prevState.validation, resumo: validation.resumo },
        }));
        break;
      case 'xp':
        const valueAux = Number(value);

        if (!isNaN(valueAux) && value !== '') {
          if (Number.isInteger(valueAux) && valueAux < 10000 && valueAux >= 0) {
            validation.xp = {
              hasError: false,
            };
          } else {
            validation.xp = {
              hasError: true,
              errorCode: 'NOM001',
              errorMessage:
                "O campo 'Pontos de Experência' deve possuir apenas números inteiros, não negativos e menores que 10000",
            };
          }
        } else {
          validation.xp = {
            hasError: true,
            errorCode: 'NOM001',
            errorMessage:
              "O campo 'Pontos de Experência' deve possuir apenas números não negativos e menores que 10000",
          };
        }

        validation.xp.wasValidated = true;
        this.setState((prevState) => ({
          validation: { ...prevState.validation, xp: validation.xp },
        }));
        break;
      default:
        break;
    }
  }

  validate() {
    let validation = { ...this.state.validation };

    let wasValidated = true;
    //console.log(validation)
    for (var key in validation) {
      if (!validation[key].wasValidated) {
        this.validateField(key, this.state[key]);
        wasValidated = false;
      }
    }

    if (!wasValidated) return false;

    validation = { ...this.state.validation };

    return !(
      validation.curso.hasError ||
      validation.titulo.hasError ||
      validation.enunciado.hasError ||
      validation.descEntrada.hasError ||
      validation.descSaida.hasError ||
      validation.resumo.hasError ||
      validation.dificuldade.hasError ||
      validation.categoria.hasError ||
      validation.conceito.hasError ||
      validation.xp.hasError
    );
  }

  onChange(e) {
    //e.preventDefault()

    const { name, value } = e.target;

    this.setState({ [name]: value }, () => {
      this.validateField(name, value);
    });
  }

  onChangeTestCase(e) {
    //console.log(e)
    const { name, value } = e.target;
    const index = e.target.dataset.index;
    //console.log(e.target.dataset.index)
    let array = [...this.state.casosTeste];
    array[index][name] = value;
    if (array[index].id) array[index].status = 1; //modificado
    this.setState({ casosTeste: array });
  }

  getUserId() {
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);
    //console.log("decoded.id: ", decoded.id)
    return decoded.id;
  }

  createQuestion(formData) {
    api
      .post('/question', formData)
      .then((res) => {
        this.setState({ loading: false });
        if (res.data.status) {
          //console.log("res:", res.data)
          this.showAlert('Questão cadastrada com sucesso.', 'success');

          this.state.casosTeste.forEach((c) => {
            c.questao = res.data.id;
          });
          //console.log(this.state.casosTeste)

          if (this.state.casosTeste.length > 0) {
            api
              .post('/testCase', this.state.casosTeste)
              .then((res2) => {
                if (res2.data.status) {
                  //console.log("res2:", res2.data)
                  this.setState({ loading: false });
                  this.showAlert(
                    'Casos de teste cadastrados com sucesso.',
                    'success'
                  );
                } else {
                  this.showAlert(
                    'Não foi possível cadastrar os casos de teste da questão. Por favor, entre em contato com o administrador do sistema.',
                    'error'
                  );
                }
              })
              .catch((error) => {
                this.showAlert(
                  'Ocorreu um erro inesperado no casos de teste. Por favor, entre em contato com o administrador do sistema.',
                  'error'
                );
              });
          } else {
            this.setState({ loading: false });
          }
        } else {
          this.showAlert(
            'Não foi possível cadastrar a questão. Por favor, entre em contato com o administrador do sistema.',
            'error'
          );
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        this.showAlert(
          'Ocorreu um erro inesperado. Por favor, entre em contato com o administrador do sistema.',
          'error'
        );
      });
  }

  updateQuestion(formData) {
    api
      .put(`/question/${this.state.idQuest}`, formData)
      .then((res) => {
        this.setState({ loading: false });
        if (res.data.status) {
          //console.log("res:", res.data, this.state.casosTeste)
          this.showAlert('Questão editada com sucesso.', 'success');

          let novosCasosTeste = [];
          this.state.casosTeste.forEach((ct) => {
            //console.log(ct)
            if (ct.status === 0) {
              ct.questao = this.state.idQuest;
              novosCasosTeste.push(ct);
              ct.status = 2;
            } else if (ct.status === 1) {
              api
                .put(`/testCase/${ct.id}`, ct)
                .then((res2) => {
                  if (res2.data.status) {
                    //console.log("res2:", res2.data)
                    ct.status = 2;
                    //console.log(this.state.casosTeste)
                    this.setState({ loading: false });
                    //this.showAlert("Casos de teste editados com sucesso.","success")
                  } else {
                    this.showAlert(
                      'Não foi possível editar o caso de teste da questão. Por favor, entre em contato com o administrador do sistema.',
                      'error'
                    );
                  }
                })
                .catch((error) => {
                  this.showAlert(
                    'Ocorreu um erro inesperado no caso de teste. Por favor, entre em contato com o administrador do sistema.',
                    'error'
                  );
                });
            }
          });

          if (novosCasosTeste.length > 0) {
            api
              .post('/testCase', novosCasosTeste)
              .then((res3) => {
                if (res3.data.status) {
                  //console.log("res2:", res3.data)
                  this.setState({ loading: false });
                  this.showAlert(
                    'Novos casos de teste cadastrados com sucesso.',
                    'success'
                  );
                } else {
                  this.showAlert(
                    'Não foi possível cadastrar os casos de teste da questão. Por favor, entre em contato com o administrador do sistema.',
                    'error'
                  );
                }
              })
              .catch((error) => {
                this.showAlert(
                  'Ocorreu um erro inesperado no casos de teste. Por favor, entre em contato com o administrador do sistema.',
                  'error'
                );
              });
          } else {
            this.setState({ loading: false });
          }
        } else {
          this.showAlert(
            'Não foi possível editar a questão. Por favor, entre em contato com o administrador do sistema.',
            'error'
          );
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        this.showAlert(
          'Ocorreu um erro inesperado. Por favor, entre em contato com o administrador do sistema.',
          'error'
        );
      });
  }

  onSubmit(e) {
    e.preventDefault();
    //console.log(this.validate())
    this.setState({ loading: true });
    if (this.validate()) {
      let formData = new FormData();
      formData.append('user', this.getUserId());
      formData.append('curso', this.state.curso);
      formData.append('dificuldade', this.state.dificuldade);
      formData.append('categoria', this.state.categoria);
      formData.append('conceito', this.state.conceito);
      formData.append('titulo', this.state.titulo);
      formData.append('enunciado', this.state.enunciado);
      formData.append('descEntrada', this.state.descEntrada);
      formData.append('descSaida', this.state.descSaida);
      formData.append('resumo', this.state.resumo);
      formData.append('xp', this.state.xp);
      formData.append('observacao', this.state.observacao);
      formData.append('foto', this.state.foto);

      if (this.state.file !== '')
        formData.append('quest', this.state.file, 'quest.png');

      /*
			const formKeys    = formData.keys();
			const formEntries = formData.entries();

			do {
			  console.log(formEntries.next().value);
			} while (!formKeys.next().done)
			*/

      if (this.state.idQuest) {
        this.updateQuestion(formData);
      } else {
        this.createQuestion(formData);
      }
    } else {
      this.setState({ loading: false });
    }
  }

  newCaseTest() {
    let casosTeste = this.state.casosTeste;
    casosTeste.push({
      entrada: this.state.testeEntrada,
      saida: this.state.testeSaida,
      visivel: this.state.testeVisivel,
      status: 0,
    });
    this.setState({
      casosTeste,
      testeEntrada: '',
      testeSaida: '',
      testeVisivel: '0',
    });
  }

  loadAvatar(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    if (e.target.files.length === 0) {
      console.log('Erro - Nenhuma imagem foi selecionada.');
      return;
    }

    if (
      !/^(?:image\/bmp|image\/cis-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x-cmu-raster|image\/x-cmx|image\/x-icon|image\/x-portable-anymap|image\/x-portable-bitmap|image\/x-portable-graymap|image\/x-portable-pixmap|image\/x-rgb|image\/x-xbitmap|image\/x-xpixmap|image\/x-xwindowdump)$/i.test(
        file.type
      )
    ) {
      this.showAlert('Erro - O tipo da imagem não é válido.', 'error');
      return;
    }

    reader.onloadend = () => {
      this.setState({
        file: file,
        foto: reader.result,
      });
    };

    reader.readAsDataURL(file);
  }

  render() {
    if (this.state.loading) {
      return <Spinner />;
    }
    const { validation } = this.state;
    //console.log(this.state.casosTeste)
    let dataTable = [];
    this.state.casosTeste.forEach((casos, index) => {
      dataTable.push(
        <tr key={index}>
          <td>
            <input
              data-index={index}
              type='checkbox'
              name='visivel'
              checked={casos.visivel === '1' ? true : false}
              value={casos.visivel === '1' ? '0' : '1'}
              onChange={this.onChangeTestCase}
            />
          </td>
          <td className='row-case'>
            <textarea
              data-index={index}
              rows='2'
              type='text'
              name='entrada'
              value={casos.entrada}
              onChange={this.onChangeTestCase}
            />
          </td>
          <td className='row-case'>
            <textarea
              data-index={index}
              rows='2'
              type='text'
              name='saida'
              value={casos.saida}
              onChange={this.onChangeTestCase}
            />
          </td>
        </tr>
      );
    });

    //console.log(this.state)

    const retorno = (
      <React.Fragment>
        <div className='fundo-bg fundo-gray' />

        <section className='jumbotron text-left question-hero question-prof'>
          <div className='container'>
            <div className='row'>
              <div className='col'>
                {this.state.idQuest ? (
                  <React.Fragment>
                    <h1>Editar Questão</h1>
                    <h6>
                      A questão editada ficará disponível para todas as turmas
                      do curso selecionado.
                    </h6>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <h1>Cadastrar Questão</h1>
                    <h6>
                      Ao cadastrar, a questão ficará disponível para todas as
                      turmas do curso escolhido.
                    </h6>
                  </React.Fragment>
                )}
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
                  <div className='col-sm-3'>
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
                  <div className='col-sm-3'>
                    <div className='form-group'>
                      <label htmlFor='input-frmquest-dificulty-group'>
                        Dificuldade{' '}
                        <strong className='campo-obrigatorio'>*</strong>
                      </label>
                      <div
                        id='input-frmquest-dificulty-group'
                        className={
                          !validation.dificuldade.wasValidated
                            ? 'input-group'
                            : validation.dificuldade.hasError
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
                          id='select-frmquest-dificulty'
                          className={
                            !validation.dificuldade.wasValidated
                              ? 'form-control'
                              : validation.dificuldade.hasError
                              ? 'is-invalid form-control'
                              : 'is-valid form-control'
                          }
                          name='dificuldade'
                          placeholder='Dificuldade'
                          value={this.state.dificuldade}
                          aria-label='Dificuldade'
                          onChange={this.onChange}
                        >
                          <option value=''> </option>
                          {this.state.dificuldades.map(function (dificuldade) {
                            return (
                              <option
                                key={dificuldade.id_dificuldade}
                                value={dificuldade.id_dificuldade}
                              >
                                {dificuldade.nome_dificuldade}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      {validation.dificuldade.hasError && (
                        <span className='invalid-feedback'>
                          {validation.dificuldade.errorMessage}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className='col-sm-3'>
                    <div className='form-group'>
                      <label htmlFor='input-frmquest-category-group'>
                        Categoria{' '}
                        <strong className='campo-obrigatorio'>*</strong>
                      </label>
                      <div
                        id='input-frmquest-category-group'
                        className={
                          !validation.categoria.wasValidated
                            ? 'input-group'
                            : validation.categoria.hasError
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
                          id='select-frmquest-category'
                          className={
                            !validation.categoria.wasValidated
                              ? 'form-control'
                              : validation.categoria.hasError
                              ? 'is-invalid form-control'
                              : 'is-valid form-control'
                          }
                          name='categoria'
                          placeholder='Categoria'
                          value={this.state.categoria}
                          aria-label='Categoria'
                          onChange={this.onChange}
                        >
                          <option value=''> </option>
                          {this.state.categorias.map(function (categoria) {
                            return (
                              <option
                                key={categoria.id_categoria}
                                value={categoria.id_categoria}
                              >
                                {categoria.nome_categoria}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      {validation.categoria.hasError && (
                        <span className='invalid-feedback'>
                          {validation.categoria.errorMessage}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className='col-sm-3'>
                    <div className='form-group'>
                      <label htmlFor='input-frmquest-concept-group'>
                        Conceito{' '}
                        <strong className='campo-obrigatorio'>*</strong>
                      </label>
                      <div
                        id='input-frmquest-concept-group'
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
                            <i className='fas fa-globe-americas'></i>
                          </span>
                        </div>
                        <select
                          id='select-frmquest-concept'
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
                          aria-label='conceito'
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

                <div className='row'>
                  <div className='col-md-12'>
                    <div className='form-group'>
                      <label htmlFor='input-frmquest-title-group'>
                        Titulo <strong className='campo-obrigatorio'>*</strong>
                      </label>
                      <div
                        id='input-frmquest-title-group'
                        className={
                          !validation.titulo.wasValidated
                            ? 'input-group'
                            : validation.titulo.hasError
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
                            !validation.titulo.wasValidated
                              ? 'form-control'
                              : validation.titulo.hasError
                              ? 'is-invalid form-control'
                              : 'is-valid form-control'
                          }
                          name='titulo'
                          placeholder='Titulo da questão'
                          value={this.state.titulo}
                          onChange={this.onChange}
                        />
                      </div>
                      {validation.titulo.hasError && (
                        <span className='invalid-feedback'>
                          {validation.titulo.errorMessage}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-md-12'>
                    <div className='form-group'>
                      <label htmlFor='input-frmquest-enun-group'>
                        Enunciado{' '}
                        <strong className='campo-obrigatorio'>*</strong>
                      </label>
                      <div
                        id='input-frmquest-enun-group'
                        className={
                          !validation.enunciado.wasValidated
                            ? 'input-group'
                            : validation.enunciado.hasError
                            ? 'is-invalid input-group'
                            : 'is-valid input-group'
                        }
                      >
                        <textarea
                          id='input-frmquest-enun'
                          rows='5'
                          type='text'
                          className={
                            !validation.enunciado.wasValidated
                              ? 'form-control'
                              : validation.enunciado.hasError
                              ? 'is-invalid form-control'
                              : 'is-valid form-control'
                          }
                          name='enunciado'
                          placeholder='Enunciado da questão'
                          value={this.state.enunciado}
                          onChange={this.onChange}
                          aria-label='Enunciado da questão'
                        />
                      </div>
                      {validation.enunciado.hasError && (
                        <span className='invalid-feedback'>
                          {validation.enunciado.errorMessage}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-sm-6'>
                    <div className='form-group'>
                      <label htmlFor='input-frmquest-input-group'>
                        Descrição da entrada{' '}
                        <strong className='campo-obrigatorio'>*</strong>
                      </label>
                      <div
                        id='input-frmquest-input-group'
                        className={
                          !validation.descEntrada.wasValidated
                            ? 'input-group'
                            : validation.descEntrada.hasError
                            ? 'is-invalid input-group'
                            : 'is-valid input-group'
                        }
                      >
                        <textarea
                          id='input-frmquest-input'
                          type='text'
                          rows='4'
                          className={
                            !validation.descEntrada.wasValidated
                              ? 'form-control'
                              : validation.descEntrada.hasError
                              ? 'is-invalid form-control'
                              : 'is-valid form-control'
                          }
                          name='descEntrada'
                          placeholder='Descrição da entrada'
                          value={this.state.descEntrada}
                          onChange={this.onChange}
                          aria-label='Descrição da entrada'
                        />
                      </div>
                      {validation.descEntrada.hasError && (
                        <span className='invalid-feedback'>
                          {validation.descEntrada.errorMessage}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className='col-sm-6'>
                    <div className='form-group'>
                      <label htmlFor='input-frmquest-output-group'>
                        Descrição da saída{' '}
                        <strong className='campo-obrigatorio'>*</strong>
                      </label>
                      <div
                        id='input-frmquest-output-group'
                        className={
                          !validation.descSaida.wasValidated
                            ? 'input-group'
                            : validation.descSaida.hasError
                            ? 'is-invalid input-group'
                            : 'is-valid input-group'
                        }
                      >
                        <textarea
                          id='input-frmquest-output'
                          type='text'
                          rows='4'
                          className={
                            !validation.descSaida.wasValidated
                              ? 'form-control'
                              : validation.descSaida.hasError
                              ? 'is-invalid form-control'
                              : 'is-valid form-control'
                          }
                          name='descSaida'
                          placeholder='Descrição da saída'
                          value={this.state.descSaida}
                          onChange={this.onChange}
                          aria-label='Descrição da saída'
                        />
                      </div>
                      {validation.descSaida.hasError && (
                        <span className='invalid-feedback'>
                          {validation.descSaida.errorMessage}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-sm-6'>
                    <div className='form-group'>
                      <label htmlFor='input-frmquest-xp-group'>
                        Pontos de experiência{' '}
                        <strong className='campo-obrigatorio'>*</strong>
                      </label>
                      <div
                        id='input-frmquest-xp-group'
                        className={
                          !validation.xp.wasValidated
                            ? 'input-group'
                            : validation.xp.hasError
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
                          id='input-frmquest-xp'
                          type='number'
                          className={
                            !validation.xp.wasValidated
                              ? 'form-control'
                              : validation.xp.hasError
                              ? 'is-invalid form-control'
                              : 'is-valid form-control'
                          }
                          name='xp'
                          placeholder='Pontos de experência da questão'
                          value={this.state.xp}
                          onChange={this.onChange}
                        />
                      </div>
                      {validation.xp.hasError && (
                        <span className='invalid-feedback'>
                          {validation.xp.errorMessage}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className='col-sm-6'>
                    <div className='form-group'>
                      <label htmlFor='input-frmquest-resume-group'>
                        Resumo <strong className='campo-obrigatorio'>*</strong>
                      </label>
                      <div
                        id='input-frmquest-resume-group'
                        className={
                          !validation.resumo.wasValidated
                            ? 'input-group'
                            : validation.resumo.hasError
                            ? 'is-invalid input-group'
                            : 'is-valid input-group'
                        }
                      >
                        <div className='input-group-prepend'>
                          <span className='input-group-text bg-light'>
                            <i className='fas fa-at'></i>
                          </span>
                        </div>
                        <input
                          id='input-frmquest-resume'
                          type='text'
                          className={
                            !validation.resumo.wasValidated
                              ? 'form-control'
                              : validation.resumo.hasError
                              ? 'is-invalid form-control'
                              : 'is-valid form-control'
                          }
                          name='resumo'
                          placeholder='Resumo'
                          value={this.state.resumo}
                          onChange={this.onChange}
                          aria-label='Resumo'
                        />
                      </div>
                      {validation.resumo.hasError && (
                        <span className='invalid-feedback'>
                          {validation.resumo.errorMessage}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-md-12'>
                    <div className='form-group'>
                      <label htmlFor='input-frmquest-observation-group'>
                        Observação
                      </label>
                      <div
                        id='input-frmquest-observation-group'
                        className='input-group'
                      >
                        <textarea
                          id='input-frmquest-observation'
                          rows='3'
                          type='text'
                          className='form-control'
                          name='observacao'
                          placeholder='Observação da questão'
                          value={this.state.observacao}
                          onChange={this.onChange}
                          aria-label='Observação da questão'
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {!this.state.idQuest ? (
                  <div className='row'>
                    <div className='col-md-2'>
                      <div className='form-group'>
                        <label htmlFor='input-frmquest-img-group'>Imagem</label>
                        <input
                          id='input-frmquest-fileupload'
                          type='file'
                          className='form-control-file'
                          onChange={this.loadAvatar}
                          accept='image/bmp, image/cis-cod, image/gif, image/ief, image/jpeg, image/pipeg, image/png, image/svg, image/tiff, image/x-cmu-raster, image/x-cmx, image/x-icon, image/x-portable-anymap, image/x-portable-bitmap, image/x-portable-graymap, image/x-portable-pixmap, image/x-rgb, image/x-xbitmap, image/x-xpixmap, image/x-xwindowdump'
                          ref='file'
                          name='avatar'
                        />
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className='row'>
                  <div className='col-sm-6'>
                    <div className='form-group'>
                      <label
                        id='label-frmquest-testcase-group'
                        htmlFor='input-frmquest-testcase-group'
                      >
                        Casos de Teste
                      </label>
                      <div id='input-frmquest-testcase-group'>
                        <table
                          className='table table-bordered table-cad-quest'
                          cellSpacing='0'
                          cellPadding='0'
                        >
                          <thead>
                            <tr>
                              <th>Visível</th>
                              <th>Entrada</th>
                              <th>Saída</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dataTable}
                            <tr className='rowTesteCaseAux'>
                              <td>
                                <input
                                  type='checkbox'
                                  name='testeVisivel'
                                  checked={
                                    this.state.testeVisivel === '1'
                                      ? true
                                      : false
                                  }
                                  value={
                                    this.state.testeVisivel === '1' ? '0' : '1'
                                  }
                                  onChange={this.onChange}
                                />
                              </td>
                              <td className='row-control'>
                                <textarea
                                  rows='2'
                                  type='text'
                                  name='testeEntrada'
                                  placeholder='Inserir novas entradas'
                                  value={this.state.testeEntrada}
                                  onChange={this.onChange}
                                />
                              </td>
                              <td className='row-control'>
                                <textarea
                                  rows='2'
                                  type='text'
                                  name='testeSaida'
                                  placeholder='Inserir novas saídas'
                                  value={this.state.testeSaida}
                                  onChange={this.onChange}
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <button
                          type='button'
                          onClick={this.newCaseTest}
                        >
                          <i className='fas fa-check-square'></i>
                        </button>
                      </div>
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
                  <GoBackButton />
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
export default RegisterQuestion;
