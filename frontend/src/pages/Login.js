import React, { Component } from 'react';
import '../css/Login.css';
import api from '../services/api';
import Logo from '../images/tipografia black.png';
import Wallpaper from '../images/wallpaper.jpg';
import { Link } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import Alert from './components/Alert';
import Spinner from './components/Spinner';
import GoogleLogin from 'react-google-login';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      nome: '',
      userName: '',
      senha: '',
      foto: '',
      loading: true,
      alerts: [],

      estilo: {
        height: `100vh`,
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
      },
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.redirectUser = this.redirectUser.bind(this);
    this.showAlert = this.showAlert.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
    this.doLogin = this.doLogin.bind(this);
  }

  responseGoogle = (response) => {
    try {
      var profile = response.getBasicProfile();
      this.setState((state, props) => {
        return {
          nome: profile.getName(),
          userName: profile.getId(),
          senha: profile.getEmail(),
          foto: profile.getImageUrl(),
        };
      });
      const user = {
        userName: profile.getId(),
        senha: profile.getEmail(),
        nome: profile.getName(),
      };
      this.doLogin(user);
    } catch (e) {
      console.log(e);
    }
  };

  componentDidMount() {
    this.redirectUser();
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

  getUserType() {
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);
    //console.log(decoded)
    return decoded.tipo;
  }

  redirectUser() {
    if (localStorage.usertoken) {
      const tipo = this.getUserType();
      if (tipo === 2 || tipo === 1) this.props.history.push('/dashboard');
      else if (tipo === 3)
        // this.props.history.push('/cursos')
        this.props.history.push('/menu');
      else {
        localStorage.clear();
        this.props.history.push('/');
      }
    } else {
      this.setState({ loading: false });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  doLogin(user) {
    api
      .post('login', user)
      .then((res) => {
        res.data.foto = this.state.foto;
        if (res.data.status) {
          localStorage.setItem('usertoken', res.data.data);
          localStorage.setItem('nome', user.nome);
          // put the log of the login here
          if (res.data.foto) localStorage.setItem('items', res.data.foto);
          api
            .post('/log/userLog', {
              logMessage: `Login realizado com sucesso pelo usuário ${
                user.userName
              }. ${new Date(Date.now()).toISOString()}\n`,
              userId: res.data.data,
            })
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.setState({ loading: false });
          this.showAlert(res.data.message, 'error');
        }
        this.redirectUser();
      })
      .catch((err) => {
        console.log(err);
        this.setState({ loading: false });
        this.showAlert('Não foi possível realizar o login!', 'error');
        //alert("Erro ao realizar login")
      });
  }

  onSubmit(e) {
    e.preventDefault();
    this.setState({ loading: true });
    const user = {
      userName: this.state.userName,
      senha: this.state.senha,
      nome: this.state.nome,
    };
    this.doLogin(user);
  }

  render() {
    if (this.state.loading) {
      return <Spinner />;
    }

    const retorno = (
      <div
        className='bg-color main-login'
        style={this.state.estilo}
      >
        <img
          src={Wallpaper}
          alt='Cosmo - Wallpaper'
          className='fundo-bg'
        />
        <div className='container'>
          <div className='d-flex justify-content-center h-100 align-items-center'>
            <div className='card login-body'>
              <div className='card-header'>
                <img
                  src={Logo}
                  alt='Cosmo - Logo'
                  className='imagem'
                ></img>
              </div>
              <div className='card-body'>
                <form
                  noValidate
                  onSubmit={this.onSubmit}
                  className='form-login'
                >
                  {/* <div className="input-group form-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="fas fa-user"></i>
                      </span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      name="userName"
                      placeholder="Username"
                      value={this.state.userName}
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="input-group form-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="fas fa-key"></i>
                      </span>
                    </div>
                    <input
                      type="password"
                      className="form-control"
                      name="senha"
                      placeholder="Password"
                      value={this.state.senha}
                      onChange={this.onChange}
                    />
                  </div> */}

                  <div className='input-group form-group'>
                    <div className='input-group-prepend'>
                      <div className='container'>
                        <GoogleLogin
                          clientId='92707896086-tjuug6g5hmecarivhshpe5um6jv7ob05.apps.googleusercontent.com'
                          buttonText='Continuar com o Google'
                          onSuccess={this.responseGoogle}
                          onFailure={this.responseGoogle}
                          onSubmit={this.onSubmit}
                          // isSignedIn={true} // continuar logado
                          cookiePolicy={'single_host_origin'}
                        />
                        <input
                          type='submit'
                          value='Entrar'
                          className='btn float-right login_btn'
                        />
                        <div className='d-flex justify-content-center links'>
                          Não tem uma conta?
                          <Link
                            to='/cadastrar'
                            className='link-cadastro'
                          >
                            Cadastre-se
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='form-group'></div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <React.Fragment>
        {retorno}
        {this.state.alerts.length > 0 ? this.state.alerts[0] : null}
      </React.Fragment>
    );
  }
}

export default Login;
