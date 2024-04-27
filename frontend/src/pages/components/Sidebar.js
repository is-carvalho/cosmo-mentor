import React, { Component } from 'react';
import { withRouter } from 'react-router';
import '../../css/Sidebar.css';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import jwt_decode from 'jwt-decode';

class Sidebar2 extends Component {
  getUserId() {
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);
    // console.log(decoded)
    return decoded;
  }

  constructor() {
    super();

    this.state = {
      userId: this.getUserId(),
      results: [],
      classeMenuSidebar: 'sidebar',
    };
  }

  componentDidMount() {
    // Define qual ícone do sidebar será marcado, dependendo da página atual
    const local = this.props.location;
    const baseName = local.pathname.split('/').pop();
    let ulOpcoes = document.getElementById('options');
    let opcaoAtual;
    switch (baseName) {
      case 'menu':
        opcaoAtual = ulOpcoes.children[0].firstChild;
        break;
      case 'turmas':
      case 'cursos':
        opcaoAtual = ulOpcoes.children[2].firstChild;
        break;
      case 'forum':
        opcaoAtual = ulOpcoes.children[1].firstChild;
        break;
      case 'cacabugs':
        opcaoAtual = ulOpcoes.children[3].firstChild;
        break;
      case 'ranking':
        opcaoAtual = ulOpcoes.children[4].firstChild;
        break;
      default:
        opcaoAtual = ulOpcoes.children[0].firstChild;
        break;
    }
    opcaoAtual.className = 'active';

    //console.log('basename', baseName)
    switch (baseName) {
      case 'forum':
        this.setState({ classeMenuSidebar: 'sidebar' });
        break;
      case 'menu':
      case 'cursos':
      case 'turmas':
      case 'cacabugs':
        break;
      default:
        // this.setState({ classeMenuSidebar: "sidebar-closed" });
        this.setState({ classeMenuSidebar: 'sidebar' });
        break;
    }
    /*console.log(`Objeto 'location' no arquivo sidebar2 eh ${this.props.location}`)
    console.log('props sidebar aq', this.props)*/

    api
      .get(`forum`, {
        headers: {
          userId: this.state.userId,
        },
      })
      .then((res) => {
        if (res.data.status) {
          this.setState({ results: res.data.data });
          // console.log(this.state.results)
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  btnWrapperClicked(e) {
    if (
      e.target.className === 'hamburger' ||
      e.target.className === 'hamburger__inner'
    ) {
      if (this.state.classeWrapper === 'wrapper active') {
        this.setState({
          classeWrapper: 'wrapper',
        });
      } else {
        this.setState({
          classeWrapper: 'wrapper active',
        });
      }
    }
  }

  render() {
    return (
      <>
        <div className='box'>
          <div
            className={this.state.classeWrapper}
            onClick={this.btnWrapperClicked}
          >
            <div className='main_container'>
              <div className={this.state.classeMenuSidebar}>
                <div className='sidebar__inner'>
                  <ul id='options'>
                    <li>
                      <a id="menu-button" href='/menu'>
                        <span className='icon'>
                          <i className='fas fa-dice-d6'></i>
                        </span>
                        <span className='title'>Meu Progresso</span>
                      </a>
                    </li>
                    <li>
                      <Link id="forum-button" to={{ pathname: `/forum`, state: { menu: true } }}>
                        <span className='icon'>
                          <i className='fab fa-delicious'></i>
                        </span>
                        <span className='title'>Forum</span>
                      </Link>
                    </li>
                    <li>
                      <a id="cursos-button" href='/cursos'>
                        <span className='icon'>
                          <i className='fab fa-elementor'></i>
                        </span>
                        <span className='title'>Cursos</span>
                      </a>
                    </li>
                    <li>
                      <a id="cacabugs-button" href='/cacabugs'>
                        <span className='icon'>
                          <i
                            style={{ marginLeft: '  -4px' }}
                            className='fa-solid fa-bug-slash'
                          ></i>
                        </span>
                        <span className='title'>Caça-Bugs</span>
                      </a>
                    </li>
                    <li>
                      <a id="ranking-button" href='/ranking'>
                        <span className='icon'>
                          <i
                            style={{ marginLeft: '  -2px' }}
                            className='fa-solid fa-ranking-star'
                          ></i>
                        </span>
                        <span className='title'>Ranking</span>
                      </a>
                    </li>
                    {/*<li>
                <a href="#">
                  <span className="icon"><i className="fas fa-chart-pie"></i></span>
                  <span className="title">Práticas</span>
                </a>
              </li>
              <li>
                <a href="#">
                  <span className="icon"><i className="fas fa-border-all"></i></span>
                  <span className="title">Avaliações</span>
                </a>
              </li>*/}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default withRouter(Sidebar2);
