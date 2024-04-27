import React, { useEffect, useState } from "react";
import { BallTriangle } from "react-loader-spinner";
import api from "../../services/api";
import jwt_decode from "jwt-decode";
import "../../css/Nivel.css";
import useWebSocket from 'react-use-websocket';

const definirTitulos = () => {
  let titulos = [];
  titulos = [
    'Gacrux',
    'Adhara',
    'Mimosa',
    'Pollux',
    'Antares',
    'Altair',
    'Rigel',
    'Vega',
    'Arcturus',
    'Sirius'
  ]
  return titulos
}

let xpMaximo = 110 // PRECISA SER ESTÁTICO PRA FUNCIONAR EM OUTROS COMPONENTES, POR CAUSA DA FORMA QUE O CÓDIGO FUNCIONA :(
let xpPorNivel = xpMaximo/10
let niveis = {
  camp: xpPorNivel,
  escud: xpPorNivel * 2,
  bar: xpPorNivel * 3,
  visc: xpPorNivel * 4,
  conde: xpPorNivel * 5,
  marq: xpPorNivel * 6,
  duque: xpPorNivel * 7,
  gDuque: xpPorNivel * 8,
  imp: xpPorNivel * 9,
  hTuring: xpPorNivel * 10
}

const getXpMaximo = (xp) => {
  xpMaximo = xp
  xpPorNivel = xpMaximo/10
  niveis = {
    camp: xpPorNivel,
    escud: xpPorNivel * 2,
    bar: xpPorNivel * 3,
    visc: xpPorNivel * 4,
    conde: xpPorNivel * 5,
    marq: xpPorNivel * 6,
    duque: xpPorNivel * 7,
    gDuque: xpPorNivel * 8,
    imp: xpPorNivel * 9,
    hTuring: xpPorNivel * 10
  }
}

function getNivel(xp) {
  const titulos = definirTitulos()
  if (xp <= niveis.camp) {

    return [titulos[0], (xp / xpPorNivel) * 100, niveis.camp + 1, 1, titulos[1]];

  } else if (xp > niveis.camp && xp <= niveis.escud) {

    return [titulos[1], 100 - ( ( (niveis.escud+1-xp) / xpPorNivel ) * 100 ), niveis.escud + 1, 2, titulos[2]];

  } else if (xp > niveis.escud && xp <= niveis.bar) {

    return [titulos[2], 100 - (((niveis.bar+1-xp) / xpPorNivel) * 100), niveis.bar + 1, 3, titulos[3]];

  } else if (xp > niveis.bar && xp <= niveis.visc) {

    return [titulos[3], 100 - (((niveis.visc+1-xp) / xpPorNivel) * 100), niveis.visc + 1, 4, titulos[4]];

  } else if (xp > niveis.visc && xp <= niveis.conde) {

    return [titulos[4], 100 - (((niveis.conde+1-xp) / xpPorNivel) * 100), niveis.conde + 1, 5, titulos[5]];

  } else if (xp > niveis.conde && xp <= niveis.marq) {

  return [titulos[5], 100 - (((niveis.marq+1-xp) / xpPorNivel) * 100), niveis.marq + 1, 6, titulos[6]];

  } else if (xp > niveis.marq && xp <= niveis.duque) {

    return [titulos[6], 100 - (((niveis.duque+1-xp) / xpPorNivel) * 100), niveis.duque + 1, 7, titulos[7]];

  } else if (xp > niveis.duque && xp <= niveis.gDuque) {

    return [titulos[7], 100 - (((niveis.gDuque+1-xp) / xpPorNivel) * 100), niveis.gDuque + 1, 8, titulos[8]];

  } else if (xp > niveis.gDuque && xp <= niveis.imp) {

    return [titulos[8], 100 - (((niveis.imp+1-xp) / xpPorNivel) * 100), niveis.imp + 1, 9, titulos[9]];

  } else {

    return [titulos[9], 100 , niveis.imp+1, 10, '---'];
  }
}

function Nivel (props) {
    const [xpMaximo, setXpMaximo] = useState(10);
    const xpPorNivel = xpMaximo/10 // Existem 10 níveis diferentes atualmente

    const niveis = {
      camp: xpPorNivel,
      escud: xpPorNivel * 2,
      bar: xpPorNivel * 3,
      visc: xpPorNivel * 4,
      conde: xpPorNivel * 5,
      marq: xpPorNivel * 6,
      duque: xpPorNivel * 7,
      gDuque: xpPorNivel * 8,
      imp: xpPorNivel * 9,
      hTuring: xpPorNivel * 10
    }

    const [xp, setXp] = useState(0);
    const [xpNecessario, setXpNecessario] = useState(0);
    const [porcentagemProgresso, setProgresso] = useState(0);
    const [tituloUser, setTituloUser] = useState('');
    const [lvlUser, setLvlUser] = useState('');
    const [sexo, setSexo] = useState(0);

    const token = localStorage.usertoken
	  const decoded = jwt_decode(token)
	  // console.log(decoded)
	  const idUser = decoded.id

    useEffect(() => {
      api.get(`/user/${idUser}`)
        .then(response => {
          // console.log(response.data)
          setXp(response.data.xp)
          setSexo(response.data.sexo)
          setTituloUser(response.data.titulo)
        })

      api
        .get(`/xpTotalQuestoes`, {
          headers: {
            cursoid: 3, // ID ESTÁTICO POR ENQUANTO!!!!!!
          }
        })
        .then(response => {
          // console.log(response.data.xpTotal)
          getXpMaximo(response.data.xpTotal) // NÃO ATUALIZA O xpMaximo GLOBAL COMO ESPERADO
          setXpMaximo(response.data.xpTotal)
        })
    }, [])
  
    useEffect(() => {
      const array = calcularProgressoNiveis()
      setLvlUser(array[3])
      setXpNecessario(array[2])
      setProgresso(array[1])
      setTituloUser(array[0]);
    }, [sexo, xp, xpMaximo])

    const { lastJsonMessage, sendMessage } = useWebSocket('wss://cosmo.telemidia-ma.com.br/ws/', {
      onOpen: () => {console.log(`Connected to App WS (Nivel.jsx)`)},
      onMessage: (message) => {
        const data = JSON.parse(message.data)
        // console.log(/*lastJsonMessage*/data)
        setXp(xp + data.data.xp)
      },
      queryParams: { 'page': 'nivel' },
      onError: (event) => { console.error(event); },
      shouldReconnect: (closeEvent) => true,
      reconnectInterval: 3000
    });
  
    const calcularProgressoNiveis = () => {
      const titulos = definirTitulos()
      if (xp <= niveis.camp) {
  
        return [titulos[0], (xp / xpPorNivel) * 100, niveis.camp + 1, 1];  
  
      } else if (xp > niveis.camp && xp <= niveis.escud) {
  
        return [titulos[1], 100 - ( ( (niveis.escud+1-xp) / xpPorNivel ) * 100 ), niveis.escud + 1, 2];
  
      } else if (xp > niveis.escud && xp <= niveis.bar) {
  
        return [titulos[2], 100 - (((niveis.bar+1-xp) / xpPorNivel) * 100), niveis.bar + 1, 3];
  
      } else if (xp > niveis.bar && xp <= niveis.visc) {
  
        return [titulos[3], 100 - (((niveis.visc+1-xp) / xpPorNivel) * 100), niveis.visc + 1, 4];
  
      } else if (xp > niveis.visc && xp <= niveis.conde) {
  
        return [titulos[4], 100 - (((niveis.conde+1-xp) / xpPorNivel) * 100), niveis.conde + 1, 5];
  
      } else if (xp > niveis.conde && xp <= niveis.marq) {
  
        return [titulos[5], 100 - (((niveis.marq+1-xp) / xpPorNivel) * 100), niveis.marq + 1, 6];
  
      } else if (xp > niveis.marq && xp <= niveis.duque) {
  
        return [titulos[6], 100 - (((niveis.duque+1-xp) / xpPorNivel) * 100), niveis.duque + 1, 7];
  
      } else if (xp > niveis.duque && xp <= niveis.gDuque) {
  
        return [titulos[7], 100 - (((niveis.gDuque+1-xp) / xpPorNivel) * 100), niveis.gDuque + 1, 8];
  
      } else if (xp > niveis.gDuque && xp <= niveis.imp) {
  
        return [titulos[8], 100 - (((niveis.imp+1-xp) / xpPorNivel) * 100), niveis.imp + 1, 9];
  
      } else {
  
        return [titulos[9], 100 , niveis.imp+1, 10];
      }
    }

    return (
        <>
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
        </>
    );
}

export {Nivel};
export {getNivel};