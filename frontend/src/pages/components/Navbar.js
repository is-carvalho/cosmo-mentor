import React, { useEffect, useState, useContext } from 'react';
import { Link, withRouter, useLocation } from 'react-router-dom';

import { Nivel } from './Nivel.jsx';

import jwt_decode from 'jwt-decode';
import '../../css/Navbar.css';
import logo from '../../images/tipografia black.png';
import api from '../../services/api';
import useWebSocket from 'react-use-websocket';

const getUserPhoto = () => {
  const items = localStorage.getItem('items');
  return items;
};

function Navbar(props) {
  const [nome, setNome] = useState();
  const [foto, setFoto] = useState(getUserPhoto());
  const [classeProfile, setProfile] = useState('profile_dd');
  const [classeMenuSidebar, setMenu] = useState('hamburger');
  const [saldoMoedas, setSaldoMoedas] = useState(0);

  const token = localStorage.usertoken;
  const decoded = jwt_decode(token);
  // console.log(decoded)
  const idUser = decoded.id;

  const getUserId = () => {
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);
    return decoded.id;
  };

  const getUserName = () => {
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);
    return decoded.nome;
  };

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem('usertoken');
    props.history.push('/');
  };

  const btnProfileClicked = (e) => {
    if (classeProfile === 'profile_dd active') {
      setProfile('profile_dd');
    } else {
      setProfile('profile_dd active');
    }
  };

  useEffect(() => {
    api
      .get(`/statsUser/${idUser}`)
      .then((response) => {
        console.log(response);
        setSaldoMoedas(response.data.data[0].saldo_moedas);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (props.activateProfileTab === true) {
      setProfile('profile_dd active');
    } else {
      setProfile('profile_dd');
    }
  }, [props.activateProfileTab]);

  const userName = getUserName();
  // setFoto(getUserPhoto());

  return (
    <div className='top_navbar'>
      <div className={classeMenuSidebar}>
        <div className='hamburger__inner'>
          <div className='one'></div>
          <div className='two'></div>
          <div className='three'></div>
        </div>
      </div>
      <div className='menu'>
        <div className='logo'>
          <Link to='/menu'>
            <img
              id='cosmo-logo'
              alt='Cosmo logo'
              src={logo}
              className='logo'
            />
          </Link>
        </div>
        {/* i wanna put a button to see all the submissions made by the user, i dont know how to do it, that button should link to route "/LogSubmissionsStudent"  */}

        <div className='right_menu'>
          <ul className='nav navbar-nav d-flex flex-row'>
            <div className='dropdown d-flex flex-end'>
              <button
                className='dd_item dropdown-item btn text-light'
                onClick={() => {
                  props.history.push('/LogSubmissionsStudent');
                }}
              >
                <i className='fas fa-eye'></i> Ver Submissões
              </button>
              {/* <div className='dropdown-divider'></div> */}
            </div>
            <li>
              <Nivel />
            </li>
            {/*<li>                                             //BARRA DE PROGRESSO!!!!!!!!!!!!!!!!!!!!!!!!!
              <div className="backgrnd">
                <span className="p-1">
						    	<i className="fas fa-scroll fa-lg text-cosmo-color-1 pr-1"></i>
						    	<span>Título:</span> {tituloUser}
                  <span> (LVL {lvlUser})</span>
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
						    </span>
              </div>
            </li>*/}
            <li>
              <a
                className='link-menu'
                style={{ cursor: 'pointer' }}
              >
                {/* <button onClick={{}} id="tutorial-button" class="tutorial-button" role="button">Tutorial</button> */}
                <img
                  src={foto ? foto : ''}
                  alt='foto'
                  style={{
                    borderRadius: 50,
                    height: 50,
                    width: 50,
                    margin: 10,
                  }}
                  onClick={btnProfileClicked}
                />
              </a>

              <div className={classeProfile}>
                <div className='profile'>
                  <div className='img'>
                    {foto ? (
                      <img
                        src={foto}
                        alt='profile_pic'
                        referrerPolicy='no-referrer'
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                  <p>{userName}</p>
                </div>

                <div className='saldoMoedas'>Saldo Atual: {saldoMoedas}</div>

                <div className='dropdown-divider'></div>

                <a
                  href='/profile'
                  className='dd_item dropdown-item'
                >
                  <i className='fas fa-eye'></i> Ver Perfil
                </a>
                <div className='dropdown-divider'></div>
                <a
                  className='dd_item dropdown-item'
                  href=' '
                  onClick={logout.bind(this)}
                >
                  <i className='fas fa-power-off'></i> Sair
                </a>
                <div className='dropdown-divider'></div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default withRouter(Navbar);
