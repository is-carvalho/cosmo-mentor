import React, {
  Component,
  useEffect,
  useState,
  componentDidMount,
} from 'react';
// import "../css/Log.css";
import Spinner from './components/Spinner';
import api from '../services/api';
import Navbar from './components/Navbar';
import jwt_decode from 'jwt-decode';
import Alert from './components/Alert';
import GoBackButton from './components/BotaoVoltar';
import ToggleSwitch from './components/ToggleSwitch';
import '../css/CacabugsManager.css';

function CacabugsManager() {
  function getUserId() {
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);
    return decoded.id;
  }

  const [rowChange, setRowChange] = useState('white');
  function greenRowAndSendStatus() {
    const cbstatus = {
      cbstatus: estadoCacabugs,
    };
    api
      .post('/cacabugsmanager', cbstatus)
      .then((res) => res.data)
      .then((loadEstadoCacabugs) => {
        setRowChange('green');
        const timer = setTimeout(() => {
          setRowChange('white');
        }, 2000);
        if (rowChange === 'green') {
          clearTimeout(timer);
        }
      });
  }

  function botaoSalvar() {
    return (
      <div className='float-right'>
        <button
          type='button'
          className='btn btn-success cosmo-color-1'
          onClick={greenRowAndSendStatus}
          style={{ marginLeft: '3px', marginRight: '3px' }}
        >
          Salvar
        </button>
      </div>
    );
  }

  const [estadoCacabugs, setEstadoCacabugs] = useState(null);
  useEffect(() => {
    api
      .get('/cacabugsmanager')
      .then((res) => res.data)
      .then((loadEstadoCacabugs) => {
        setEstadoCacabugs(Boolean(loadEstadoCacabugs[0]['ativado']));
      });
  }, []);

  const [isToggled, setIsToggled] = useState(false);
  const onToggle = () => {
    setIsToggled(!isToggled);
    setEstadoCacabugs(!isToggled);
  };
  const [runOnlyOnce, setRunOnlyOnce] = useState(true);
  useEffect(() => {
    if (estadoCacabugs == true && runOnlyOnce === true) {
      setRunOnlyOnce(false);
      setIsToggled(true);
      setEstadoCacabugs(true);
    }
  });
  function ToggleSwitch() {
    return (
      <label className='toggle-switch'>
        <input
          type='checkbox'
          checked={isToggled}
          onChange={onToggle}
        />
        <span className='switch' />
      </label>
    );
  }
  return (
    <React.Fragment>
      <Navbar />
      <div className='app-body'>
        <div className='container-log'>
          <div className='table-responsive'>
            <div className='table-wrapper'>
              <div className='table-title'>
                <div className='row'>
                  <div className='col-sm-4'>
                    <h2 className='boxtitle'>
                      Ativar e desativar o Caça-Bugs:
                    </h2>
                  </div>
                </div>
              </div>
              {/* <div className="table-filter-log" style={{display:"flex",alignItems:"center",marginLeft:"15px",marginRight:"15px",justifyContent:"space-around"}}> */}
              <div className='table-filter-log'>
                <div
                  className='row'
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginLeft: '15px',
                    marginRight: '15px',
                    justifyContent: 'center',
                  }}
                >
                  <p
                    className='boxtext'
                    style={{ marginRight: '10px', marginBottom: '6px' }}
                  >
                    Modifique o botão para deixar a ferramenta ativada ou não:
                  </p>
                  {ToggleSwitch()}
                </div>
                <div
                  className='row'
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '10px',
                    marginBottom: '10px',
                  }}
                >
                  {/* <div className="col" style={{backgroundColor:rowColor,opacity:rowOpacity,color:rowColor}}>a</div> */}
                  <div className={`col ${rowChange}`}>placeholder text</div>
                  {botaoSalvar()}
                  <div className={`col ${rowChange}`}>placeholder text</div>
                  {/* <div className="col" style={{backgroundColor:rowColor,opacity:rowOpacity,color:rowColor}}>a</div> */}
                </div>
                {/* <p1 style={{fontSize:"20px",marginRight:"20px"}} onMouseOver={a}>Desativar e ativar o Caça-Bugs:</p1> */}
                {/* <ToggleSwitch/> */}
              </div>
            </div>
          </div>
          <GoBackButton />
        </div>
      </div>
    </React.Fragment>
  );
}

export default CacabugsManager;
