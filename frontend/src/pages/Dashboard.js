import React, { Component } from 'react';
import imgSettings from '../images/settings.png';
import imgLogClass from '../images/logClass.png';
import imgForum from '../images/forum.png';
import imgDojo from '../images/code-dojo.png';
import imgConceitos from '../images/icons8-conceito-100.png';
import imgDashboard from '../images/dashboard-img.png';
import imgContent from '../images/content.png';

import Navbar from './components/Navbar';
import jwt_decode from 'jwt-decode';
import Spinner from './components/Spinner';
import imgCacabugs from "../images/cacabugs.jpg";
import api from '../services/api';

export default class Dashboard extends Component {
  state = {
    userType: 0,
    loading: true,
  };

  componentDidMount() {
    const userType = this.getUserType();
    this.setState({ userType, loading: false });
  }

  getUserType() {
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);
    return decoded.tipo;
  }

  render() {
    //aqui começa a renderizar(desenha) //
    if (this.state.loading) {
      return <Spinner />;
    }

    const retorno = (
      <React.Fragment>
        <div className='fundo-bg fundo-gray' />
        {/*<section className="jumbotron text-center section-titulo-cursos">
                <div className="container">
                    <h1 className="jumbotron-heading">DASHBOARD</h1>
                </div>
            </section>*/}
        <section
          id='team'
          className='pb-5'
        >
          <div className='container'>
            <div className='row'>
              <div className='image-flip'>
                <div className='mainflip main-cursos'>
                  <div className='frontside'>
                    <div className='card'>
                      <div className='card-body text-center'>
                        <p>
                          <img
                            className='img-fluid'
                            alt='card curso'
                            src={imgSettings}
                          />
                        </p>
                        <h4 className='card-title'>Gerenciador de Questões</h4>
                      </div>
                    </div>
                  </div>
                  <div className='backside'>
                    <div className='card'>
                      <div className='card-body text-center mt-2'>
                        <div className='custom-scrollbar-css p-2'>
                          <section className='backside-head'>
                            <h5 className='card-title'>
                              Gerenciador de Questões
                            </h5>
                          </section>
                          <section className='backside-body'>
                            <p className='card-text'>
                              Visualize todas as questões disponíveis para suas
                              turmas, crie novas questões, remova ou edite as
                              questões feitas por você.
                            </p>
                          </section>
                        </div>
                        <section className='backside-footer'>
                          <button
                            onClick={(e) =>
                              this.props.history.push('/questoes')
                            }
                            className='btn btn-primary btn-sm btn-cursos'
                          >
                            <i className='fas fa-sign-in-alt'></i>
                          </button>
                        </section>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='image-flip'>
                <div className='mainflip main-cursos'>
                  <div className='frontside'>
                    <div className='card'>
                      <div className='card-body text-center'>
                        <p>
                          <img
                            className='img-fluid'
                            alt='card curso'
                            src={imgContent}
                          />
                        </p>
                        <h4 className='card-title'>Gerenciador de Conteúdo</h4>
                      </div>
                    </div>
                  </div>
                  <div className='backside'>
                    <div className='card'>
                      <div className='card-body text-center mt-2'>
                        <div className='custom-scrollbar-css p-2'>
                          <section className='backside-head'>
                            <h5 className='card-title'>
                              Gerenciador de Conteúdo
                            </h5>
                          </section>
                          <section className='backside-body'>
                            <p className='card-text'>
                              Visualize todas os conteúdos disponíveis para suas
                              turmas, crie, edite ou remova os conteúdos
                              elaborados por você.
                            </p>
                          </section>
                        </div>
                        <section className='backside-footer'>
                          <button
                            onClick={(e) =>
                              this.props.history.push('/theory-list')
                            }
                            className='btn btn-primary btn-sm btn-cursos'
                          >
                            <i className='fas fa-sign-in-alt'></i>
                          </button>
                        </section>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='image-flip'>
                <div className='mainflip main-cursos'>
                  <div className='frontside'>
                    <div className='card'>
                      <div className='card-body text-center'>
                        <p>
                          <img
                            className='img-fluid'
                            alt='card curso'
                            src={imgConceitos}
                          />
                        </p>
                        <h4 className='card-title'>Gerenciador de Conceitos</h4>
                      </div>
                    </div>
                  </div>
                  <div className='backside'>
                    <div className='card'>
                      <div className='card-body text-center mt-2'>
                        <div className='custom-scrollbar-css p-2'>
                          <section className='backside-head'>
                            <h5 className='card-title'>
                              Gerenciador de Conceitos
                            </h5>
                          </section>
                          <section className='backside-body'>
                            <p className='card-text'>
                              Visualize todos os conceitos disponíveis e edite a
                              disponibilidade de cada um.
                            </p>
                          </section>
                        </div>
                        <section className='backside-footer'>
                          <button
                            onClick={(e) =>
                              this.props.history.push('/questoes/editarConceitos')
                            }
                            className='btn btn-primary btn-sm btn-cursos'
                          >
                            <i className='fas fa-sign-in-alt'></i>
                          </button>
                        </section>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='image-flip'>
                <div className='mainflip main-cursos'>
                  <div className='frontside'>
                    <div className='card'>
                      <div className='card-body text-center'>
                        <p>
                          <img
                            className='img-fluid'
                            alt='card curso'
                            src={imgDojo}
                          />
                        </p>
                        <h4 className='card-title'>Coding Dojo</h4>
                      </div>
                    </div>
                  </div>
                  <div className='backside'>
                    <div className='card'>
                      <div className='card-body text-center mt-2'>
                        <div className='custom-scrollbar-css p-2'>
                          <section className='backside-head'>
                            <h5 className='card-title'>Coding Dojo</h5>
                          </section>
                          <section className='backside-body'>
                            <p className='card-text'>
                              Visualize Coding Dojo e crie novos desafios!
                            </p>
                          </section>
                        </div>
                        <section className='backside-footer'>
                          <button
                            onClick={(e) =>
                              this.props.history.push('/createDojo')
                            }
                            className='btn btn-primary btn-sm btn-cursos'
                          >
                            <i className='fas fa-sign-in-alt'></i>
                          </button>
                        </section>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="image-flip">
                <div className="mainflip main-cursos">
                  <div className="frontside">
                    <div className="card">
                      <div className="card-body text-center">
                        <p>
                          <img
                            className="img-fluid"
                            alt="card curso"
                            src={imgCacabugs}
                          />
                        </p>
                        <h4 className="card-title">Caça-Bugs</h4>
                      </div>
                    </div>
                  </div>
                  <div className="backside">
                    <div className="card">
                      <div className="card-body text-center mt-2">
                        <div className="custom-scrollbar-css p-2">
                          <section className="backside-head">
                            <h5 className="card-title">Caça-Bugs</h5>
                          </section>
                          <section className="backside-body">
                            <p className="card-text">
                              Bloqueie ou desbloqueie a ferramenta Caça-Bugs para os alunos.
                            </p>
                          </section>
                        </div>
                        <section className="backside-footer">
                          <button
                            onClick={(e) => this.props.history.push("/cacabugsmanager")}
                            className="btn btn-primary btn-sm btn-cursos"
                          >
                            <i className="fas fa-sign-in-alt"></i>
                          </button>
                        </section>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='image-flip'>
                <div className='mainflip main-cursos'>
                  <div className='frontside'>
                    <div className='card'>
                      <div className='card-body text-center'>
                        <p>
                          <img
                            className='img-fluid'
                            alt='card curso'
                            src={imgForum}
                          />
                        </p>
                        <h4 className='card-title'>Forum Geral</h4>
                      </div>
                    </div>
                  </div>
                  <div className='backside'>
                    <div className='card'>
                      <div className='card-body text-center mt-2'>
                        <div className='custom-scrollbar-css p-2'>
                          <section className='backside-head'>
                            <h5 className='card-title'>Forum Geral</h5>
                          </section>
                          <section className='backside-body'>
                            <p className='card-text'>
                              Visualize postagens de todas as turmas relativas à
                              todas as questões.
                            </p>
                          </section>
                        </div>
                        <section className='backside-footer'>
                          <button
                            onClick={(e) => this.props.history.push('/forum')}
                            className='btn btn-primary btn-sm btn-cursos'
                          >
                            <i className='fas fa-sign-in-alt'></i>
                          </button>
                        </section>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='image-flip'>
                <div className='mainflip main-cursos'>
                  <div className='frontside'>
                    <div className='card'>
                      <div className='card-body text-center'>
                        <p>
                          <img
                            className='img-fluid'
                            alt='card curso'
                            src={imgLogClass}
                          />
                        </p>
                        <h4 className='card-title'>Log da Turma</h4>
                      </div>
                    </div>
                  </div>
                  <div className='backside'>
                    <div className='card'>
                      <div className='card-body text-center mt-2'>
                        <div className='custom-scrollbar-css p-2'>
                          <section className='backside-head'>
                            <h5 className='card-title'>Log da Turma</h5>
                          </section>
                          <section className='backside-body'>
                            <p className='card-text'>
                              Visualize informações de todos os alunos ou de
                              todas as questões, presentes nas suas respectivas
                              turmas.
                            </p>
                          </section>
                        </div>
                        <section className='backside-footer'>
                          <button
                            onClick={(e) => this.props.history.push('/log')}
                            className='btn btn-primary btn-sm btn-cursos'
                          >
                            <i className='fas fa-sign-in-alt'></i>
                          </button>
                        </section>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='image-flip'>
                <div className='mainflip main-cursos'>
                  <div className='frontside'>
                    <div className='card'>
                      <div className='card-body text-center'>
                        <p>
                          <img
                            className='img-fluid'
                            alt='card curso'
                            src={imgDashboard}
                          />
                        </p>
                        <h4 className='card-title'>Log de Submissões</h4>
                      </div>
                    </div>
                  </div>
                  <div className='backside'>
                    <div className='card'>
                      <div className='card-body text-center mt-2'>
                        <div className='custom-scrollbar-css p-2'>
                          <section className='backside-head'>
                            <h5 className='card-title'>Dashboard da Turma</h5>
                          </section>
                          <section className='backside-body'>
                            <p className='card-text'>
                              Visualize informações de todas as submissões
                              presentes em suas respectivas turmas.
                            </p>
                          </section>
                        </div>
                        <section className='backside-footer'>
                          <button
                            onClick={(e) =>
                              this.props.history.push('/logSubmissoesProfessor')
                            }
                            className='btn btn-primary btn-sm btn-cursos'
                          >
                            <i className='fas fa-sign-in-alt'></i>
                          </button>
                        </section>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/*this.state.userType === 1 ? 
                        <div className="image-flip">
                            <div className="mainflip main-cursos">
                                <div className="frontside">
                                    <div className="card">
                                        <div className="card-body text-center">
                                            <p><img className="img-fluid" alt="card curso" src={imgSettings}/></p>
                                            <h4 className="card-title">Gerenciador de Usuários</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="backside">
                                    <div className="card">
                                        <div className="card-body text-center mt-2">
                                        <div className="custom-scrollbar-css p-2">
                                            <section className="backside-head">
                                                <h5 className="card-title">Gerenciador de Usuários</h5>
                                            </section>
                                            <section className="backside-body">
                                                <p className="card-text">Visualize ou edite todos os usuários cadastrados no sistema.</p>
                                            </section>
                                        </div>
                                            <section className="backside-footer">
                                            <button onClick={e=>this.props.history.push('/questoes')} className="btn btn-primary btn-sm btn-cursos"><i className="fas fa-sign-in-alt"></i></button>
                                            </section>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        : null*/}
            </div>
          </div>
        </section>
      </React.Fragment>
    );

    return (
      <React.Fragment>
        <Navbar />
        <div className='app-body'>{retorno}</div>
      </React.Fragment>
    );
  }
}
