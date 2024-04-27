import React from "react";
import api from "../../services/api";
import jwt_decode from "jwt-decode";
import { useEffect } from "react";
import { useState } from "react";
import Spinner from "./Spinner";
import Alert from "./Alert";

import useWebSocket from 'react-use-websocket';

const Achieve = require("../../../node_modules/achievement-unlocked/lib/index.js").Achieve

const url = process.env.REACT_APP_BASE_URL

function getConquistas(conquistas, stats) {
  let achievementExport = new Achieve();

  const listaStats = []
  Object.entries(stats).map(([keyName, value]) => {
      listaStats.push(keyName)
      // console.log(keyName, value)
      achievementExport.defineProperty(keyName, value)
  })

  conquistas.forEach((conquista) => {
    const achievementProps = []

    let index = 0

    const activation = conquista.activation
    // console.log(conquista)
    const activation_values = conquista.activation_values.split(',');
    const statsNecessarios = conquista.stats_necessarios.split(',');
    // console.log(statsNecessarios)
  
    statsNecessarios.forEach((id_stat) => {

      achievementProps.push({
        propName: listaStats[parseInt(id_stat)],
        activation: activation,
        activationValue: parseInt(activation_values[index])
      })

      index++
    })
    achievementExport.defineAchievement(conquista.nome, achievementProps)

    // setNomeConquista(conquista.nome)
  })

  achievementExport.checkAchievements()

  return achievementExport
}

function Conquista(props) {
    const [achievement, setAchievement] = useState(new Achieve());

    const [dataUser, setDataUser] = useState([]);

    const [conquistas, setConquistas] = useState([]);
    const [idStat, setIdStat] = useState(0);
    const [nomeStat, setNomeStat] = useState(0);
    const [nomeConquista, setNomeConquista] = useState('');
    const [stats, setStats] = useState(null);
    const [acIsSet, setAcIsSet] = useState(false); // "acIsSet" == "achievement is set"

    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      const token = localStorage.usertoken;
      const decoded = jwt_decode(token);

      api
        .get(`/user/${decoded.id}`)
        .then((response) => {        
          setDataUser({
            id: response.data.id,
            tipo: response.data.tipo,
            titulo_id: response.data.titulo_id,
            xp: response.data.xp,
            nome: response.data.nome,
          })
        })

    }, [])

    useEffect(() => {
        const decoded = jwt_decode(localStorage.usertoken)
        api
          .get(`/statsUser/${parseInt(decoded.id)}`)
          .then((response) => {
            // sessionStorage.setItem('stats', JSON.stringify(response.data.data[0]))
            const stats = JSON.stringify(response.data.data[0])
            setStats(JSON.parse(stats))
            setLoading(false)
            // console.log(JSON.parse(stats))
          })
          .catch(err => {
            // console.log(err)
          })
    }, [])
    
    useEffect(() => {
      // console.log(stats.nivel_atual)

      if(stats && conquistas) {
        // console.log(stats, conquistas)
        definirConquistas()
        console.log(achievement.getValue('nivel_atual'))
        console.log(achievement.getAchievements())
      }/* else {
        console.log('nao chamou a funcao')
      }*/
    }, [/*stats, */conquistas])
    
    useEffect(() => {
      api
        .get(`/achievement`)
        .then((result) => {    
          setConquistas(result.data.data)
        })
    }, [])

    const closeAlert = () => {
      let alertsList = alerts;
      alertsList.shift();
      setAlerts(alertsList);
    }
  
    const showAlert = (msg, status) => {
      let alertsList = alerts;
      alertsList.push(
        <Alert msg={msg} status={status} /*hide={closeAlert.bind(this)}*/ />
      );
      setAlerts(alertsList);
    }

    const definirConquistas = () => {
      const listaStats = []
      Object.entries(stats).map(([keyName, value]) => {
          listaStats.push(keyName)
          // console.log(keyName, value)
          achievement.defineProperty(keyName, value)
      })

      conquistas.forEach((conquista) => {
        const achievementProps = []

        let index = 0

        const activation = conquista.activation
        // console.log(conquista)
        const activation_values = conquista.activation_values.split(',');
        const statsNecessarios = conquista.stats_necessarios.split(',');
        // console.log(statsNecessarios)
      
        statsNecessarios.forEach((id_stat) => {

          achievementProps.push({
            propName: listaStats[parseInt(id_stat)],
            activation: activation,
            activationValue: parseInt(activation_values[index])
          })

          index++
        })
        achievement.defineAchievement(conquista.nome, achievementProps)

        setNomeConquista(conquista.nome)
      })
      achievement.checkAchievements()
    }

    const addProp = (propName) => { // INCREMENTAR VALOR DE UM PROP/STAT ESPECIFICO
      achievement.addValue(propName, 1)
    }

    const setProp = (propName, propValue) => {
      console.log(propName)
      achievement.setValue(propName, propValue)
    }

    const { lastJsonMessage, sendMessage } = useWebSocket('wss://cosmo.telemidia-ma.com.br/ws/', {
      onOpen: () => {return/*console.log(`Connected to App WS (Conquista.jsx)`)*/},
      onMessage: (message) => {
        // console.log(message)
        const msg = JSON.parse(message.data)
        let data = msg.data

        switch(msg.action) {
          case 'setStat':
            setProp(data.statName, data.statValue)
            break
          case 'addStat':
            addProp(data.statName)
            break
        }
        
        /*console.log(achievement.getValue('nivel_atual'))              //  <-- DEBUG kk
        console.log(achievement.checkAchievements())*/

        achievement.getAchievements().forEach(achievement => {
          // console.log(achievement.unlocked)
          if(achievement.unlocked) {
            let conq = 0
            conq = conquistas.find(conquista => {
              return conquista.nome === achievement.name
            })

            /*api                             // DESBLOQUEIA UMA CONQUISTA E NOTIFICA O USUÁRIO
              .post(`/unlockAchievement/`, {
                achievementId: conq.id_conquista,
                achievementName: achievement.name,
                userId: dataUser.id,
                userName: dataUser.nome,
              })
              .then(response => {
                if(response.data.status) {
                  // MENSAGEM DE CONQUISTA DESBLOQUEADA
                  sendMessage(JSON.stringify({
                    data: {                
                      alertStatus: 'success',
                      alertMsg: `Você desbloqueou a conquista "${achievement.name}"!`,
                    },
                    fromComponent: 'conquista',
                    toComponent: msg.fromComponent, // Componente Destino
                    action: 'showAlert',
                  }))

                }
              })*/
          }
        })

      },
      queryParams: { 'page': 'conquista' },
      onError: (event) => { console.error(event); },
      shouldReconnect: (closeEvent) => true,
      reconnectInterval: 3000
    });

    return (
      <>
      {loading ? <Spinner /> : 
        <>
        </>
      }
      </>
    );
}

export {Conquista, getConquistas}
