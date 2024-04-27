import React from 'react';
import api from '../services/api';
import jwt_decode from 'jwt-decode';
// import imgPreview from "../images/avatar.png";
import Spinner from "./components/Spinner";
import Navbar from "./components/Navbar";
import Alert from "./components/Alert";
import AprendaCard from "./components/AprendaCard.jsx";
import PratiqueCard from "./components/PratiqueCard";
import ContinuarCursoCard from "./components/ContinuarCursoCard";
import Sidebar2 from "./components/Sidebar";
import "../css/Menu.css";
import { useEffect } from "react";
import { useState } from "react";
import { useHistory } from "react-router";
import Notifications from "./components/Notifications.jsx";
import Joyride from "react-joyride";
import { tutorialSteps } from "./Tutorial.js";
// import { useContext,createContext } from "react";
import { Conquista } from "./components/Conquista.jsx"

export default function Menu() {
  const [qtdCursos, setQtdCursos] = useState("");
  const [cursos, setCursos] = useState([]);
  const [idCurso, setIdCurso] = useState('');
  const [descricaoCurso, setDescricaoCurso] = useState('');
  const [nomeCurso, setNomeCurso] = useState('');
  // const [foto, setFoto] = useState('');
  const [loading] = useState('');
  const [classeWrapper, setClasseWrapper] = useState('');
  const [history] = useState(useHistory());
  const [alerts] = useState();

  const [results, setResults] = useState();
  const [currentAuthors, setAuthors] = useState();
  const [notifications, setNotifications] = useState();
  const [userGroup, setUserGroup] = useState();


  // const [idTurma, setIdTurma] = useState('');
  // const [nomeTurma, setNomeTurma] = useState('');

  // const showAlert = (msg, status) => {
  //     alerts.push(<Alert msg={msg} status={status} hide={closeAlert()} />)
  // }

  // const closeAlert = () => {
  //     alerts.shift()
  //     this.setState({ alerts: alerts })
  // }
  const getUserData = () => {
    const token = localStorage.usertoken;
    const nome = localStorage.nome;
    const decoded = jwt_decode(token);
    return {
      id: decoded.id,
      tipo: decoded.tipo,
      nome: nome,
    };
  };

  const [user, setUser] = useState(getUserData);

  const btnWrapperClicked = (e) => {
    if (
      e.target.className === 'hamburger' ||
      e.target.className === 'hamburger__inner'
    ) {
      if (classeWrapper === 'wrapper active') {
        setClasseWrapper('wrapper');
      } else {
        setClasseWrapper('wrapper active');
      }
    }
  };
  
  const [showTutorial,setShowTutorial] = useState(null);
  const [objetoTutorial,setObjetoTutorial] = useState(null);
  const  [joyrideState,setJoyrideState] = useState({run:true});
  const [joyrideCallback,setJoyrideCallback] = useState(null);
  // const [tutorialHelpers,setTutorialHelpers] =useState(null);
  const [activateProfileTab,setActivateProfileTab]=useState(false);
  const [activateTutorial,setActivateTutorial]=useState(false);
  
  useEffect(()=>{
    api
    .get(`/tutorial/${user.id}`)
    .then((data)=>{
      setShowTutorial(Boolean(data["data"][0]["show_tutorial"]));
      if(Boolean(data["data"][0]["show_tutorial"])===true){
        setActivateProfileTab(true)
      }
    })
  },[])

  // const showTutorialContext=createContext(false);

  function handleJoyrideCallback(callback){
    setJoyrideCallback(callback);
    // console.log(tutorialHelpers);
    // console.log(`bom dia ${helpers}`)
    console.log(callback);
    if(callback["action"]==="start" && classeWrapper==="wrapper active"){
      setClasseWrapper("wrapper")
    }
    if(callback["action"]==="start" || callback["index"]===2){
      setActivateProfileTab(true);
    }
    if(callback["status"]==="skipped"){
      setActivateProfileTab(false);
      setShowTutorial(false);
      setObjetoTutorial(null);
      api
      .post(`/tutorial/${user.id}/${false}`)
    }
    if(callback["action"]==="next" && callback["index"]===3){
      setActivateProfileTab(false);
    }
    if(callback["status"]==="finished"){
      setClasseWrapper("wrapper active");
      setShowTutorial(false);
      setObjetoTutorial(null);
      setActivateProfileTab(false)
      api
      .post(`/tutorial/${user.id}/${false}`)
    }
  }
  // let helpers;

  useEffect(()=>{
    if(showTutorial===true){
      const objetoInicioTutorial = ()=>{
        return <Joyride 
        {...joyrideState}
        locale={{back:'Voltar',close:'Fechar',skip:'Pular tutorial',next:'Próximo',last:'Encerrar'}}
        // getHelpers={(store)=>(setTutorialHelpers(store))}
        // getHelpers={(h)=>(helpers=h)}
        continuous
        hideCloseButton
        scrollToFirstStep 
        disableScrolling
        showProgress
        showSkipButton={false}
        disableOverlayClose
        disableCloseOnEsc
        disableBeacon
        spotlightClicks={false}
        callback={handleJoyrideCallback}
        styles={{
          options:{ primaryColor:'#0070E8',zIndex:1000},
        }}
        steps={tutorialSteps}>

        </Joyride>;
      }
      setObjetoTutorial(objetoInicioTutorial);
    }
  },[showTutorial])
  

  useEffect(() => {
    api
    .get(`/userGroup/${user.id}`)
      .then((response) => {
        // console.log(response.data[0].grupo);
        setUserGroup(response.data[0].grupo);
      })
      .catch((err) => {
        console.log('Erro ao carregadar grupo do usuário', 'error');
      });
    // console.log(userGroup);
    if (userGroup) localStorage.setItem('userGroup', userGroup);
  }, [user, userGroup]);

  useEffect(() => {
    api
      .get('/searchIdClass', {
        headers: {
          user: user.id,
        },
      })
      .then((response) => {
        // console.log("response searchIdClass", response)
        if (response.data[0] !== undefined) {
          setQtdCursos(response.data.length);
          setCursos(response.data);
          setIdCurso(response.data[0].idCurso);
          setDescricaoCurso(response.data[0].descricaoCurso);
          setNomeCurso(response.data[0].nomeCurso);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  useEffect(() => {
    let isApiSubscribed = true;
    setTimeout(() => {
      api
        .get('/userNotifications', {
          headers: {
            userId: user.id,
          },
        })
        .then((res) => {
          if (isApiSubscribed) {
            setResults(res.data.data);
          }
        });

      setInterval(() => {
        api
          .get('/userNotifications', {
            headers: {
              userId: user.id,
            },
          })
          .then((res) => {
            if (isApiSubscribed) {
              setResults(res.data.data);
            }
          });
      }, 300000);
    }, 0);

    return () => {
      isApiSubscribed = false;
    };
  }, []);

  useEffect(() => {
    // Busca os autores das replies
    let isApiSubscribed = true;
    if (results !== undefined && results.length > 0) {
      let aux = [];
      for (let i = 0; i < results.length; i++) {
        api
          .get('/userReplies', {
            headers: {
              entityID: results[i].entityID,
            },
          })
          .then((res) => {
            if (isApiSubscribed) {
              aux.push(res.data.data);
            }
          });
      }

      setTimeout(() => {
        setAuthors(aux);
      }, 5000);

      // console.log(aux)
    }

    return () => {
      isApiSubscribed = false;
    };
  }, [results]);

  useEffect(() => {
    let isApiSubscribed = true;
    if (currentAuthors !== undefined) {
      let arrayAux = [];
      for (let i = 0; i < currentAuthors.length; i++) {
        arrayAux = [...arrayAux, ...notify(currentAuthors[i], i)];
      }

      setNotifications(arrayAux);
    } else {
      setNotifications([]);
      /*setNotifications({
                notificationID: -1,
                text: "Sem notificações",
                idPost: "#",
                idCurso: "#",
                idUsuario: "#",
                nome: "#",
                idTurma: "#",
                idQuestao: "#",
                idForum: "#",
                tituloPost: "#",
                descPost: "#"
            })

            setTimeout(() => {
                console.log(notifications)
            }, 5000)*/
    }

    return () => {
      isApiSubscribed = false;
    };
  }, [currentAuthors]);

  // useEffect(() => {
  //   // do it in http://127.0.0.1:8000 instead of http://localhost:4000
  //   if (imageSrc !== undefined) {
  //     //change base url
  //     // axios
  //     //   .post('http://http://127.0.0.1:8000/processImage', {
  //     //     image: imageSrc,
  //     //   })
  //     //   .then((res) => {
  //     //     console.log(res);
  //     //   });
  //     // const data = new FormData();
  //     // data.append('image', imageSrc);
  //     // try {
  //     //   fetch('http://127.0.0.1:8000/processImage', {
  //     //     method: 'GET',
  //     //   })
  //     //     .then((res) => res.json())
  //     //     .then((res) => {
  //     //       console.log(res);
  //     //     });
  //     // } catch (err) {
  //     //   console.log(err);
  //     // }
  //   }
  // }, [imageSrc]);

  /*useEffect(() => {

    }, [notifications])*/

  const notify = (postagem, indice) => {
    // Organiza os dados de cada notificação para o frontend
    const userNotifications = [];

    switch (results[indice].type) {
      case 'reply':
        const dados = {
          notificationID: postagem[0].notificationID,
          idPost: results[indice].entityID,
          idCurso: results[indice].idCurso,
          idUsuario: results[indice].idUsuario,
          nome: results[indice].nome,
          idTurma: results[indice].idTurma,
          idQuestao: results[indice].idQuestao,
          idForum: results[indice].idForum,
          tituloPost: results[indice].titulo,
          descPost: results[indice].descricao,
        };
        if (postagem.length > 2 && postagem[0] !== undefined) {
          const author1 = postagem[0];
          const author2 = postagem[1];
          const total = postagem.length - 2;

          userNotifications.push({
            ...dados,
            text: `${author1.nome}, ${author2.nome} e outros ${total} responderam a sua pergunta: "${author1.tituloPost}"`,
          });
        } else if (postagem.length === 2 && postagem[0] !== undefined) {
          const author1 = postagem[0];
          const author2 = postagem[1];

          userNotifications.push({
            ...dados,
            text: `${author1.nome} e ${author2.nome} responderam a sua pergunta: "${author1.tituloPost}"`,
          });
        } else if (postagem.length < 2 && postagem[0] !== undefined) {
          const author1 = postagem[0];

          userNotifications.push({
            ...dados,
            text: `${author1.nome} respondeu a sua pergunta: "${author1.tituloPost}"`,
          });
        }

        break;

      case '': // Outros tipos de notificação
        break;
    }
    return userNotifications;
  };

  return (
    <>
      {loading ? <Spinner /> : <></>}
      {/*<Conquista />*/}
      {qtdCursos > 0 ? (
        <>
          <div
            className='row'
            id='row3'
          >
            <div
              className='col col-ativo'
              id='col1'
            >
              Em progresso
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
      <div className={classeWrapper} onClick={btnWrapperClicked}>
        <Navbar activateTutorial={activateTutorial} activateProfileTab={activateProfileTab}/>

        <div className='main_container'>
          <Sidebar2 />

          <div className="container-fluid">
          <button onClick={()=>setShowTutorial(true)} id="tutorial-button" class="tutorial-button" role="button">Tutorial</button>
            <div className="row">
              <div className="col">
                <AprendaCard />
              </div>
            </div>
            <div className='row'>
              <div className='col'>
                <PratiqueCard
                  id='0'
                  history={history}
                />
              </div>
              <div className='col'>
                <PratiqueCard
                  id='1'
                  history={history}
                />
              </div>
            </div>
            <div>
              <div
                style={{
                  width: '100%',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                }}
              >
                <div style={{ paddingRight: '10px', marginRight: '6px' }}>
                  {cursos?.map((curso, index) => (
                    <div key={index.toString()}>
                      {
                        <ContinuarCursoCard
                          id_curso={cursos[index].idCurso}
                          nome_curso={curso.nomeCurso}
                          descricao_curso={curso.descricaoCurso}
                          id_turma={curso.idTurma}
                          id_usuario={user.id}
                          nome_turma={curso.nomeTurma}
                          history={history}
                        />
                      }
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    paddingLeft: '10px',
                    marginLeft: '6px',
                  }}
                >
                  <Notifications data={notifications} />

                  {objetoTutorial}

                </div>
              </div>
            </div>
            {/* <Notifications data={notifications} /> */}
            {/* <Row>
                                <div className="col col-ativo">Avalie seu conhecimento</div>
                            </Row>
                            <div className="row">
                                <div className="col">
                                    <AvalieCard />
                                </div>
                                <div className="col">
                                    <AvalieCard />
                                </div>
                                <div className="col">
                                    <AvalieCard />
                                </div> */}
            {/* </div> */}
            {/*<div>
              <a href="https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=Badge%20de%20Teste&organizationId=35706424&issueYear=2018&issueMonth=2&certUrl=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Flearn%2Fcertifications%2Fd365-functional-consultant-sales&certId=1234"><img src="https://download.linkedin.com/desktop/add2profile/buttons/en_US.png " alt="LinkedIn Add to Profile button"></img></a>
                              </div> */}
          </div>
        </div>
      </div>
                                
      {/* {alerts.length > 0 ? alerts[0] : null} */}
    </>
  );
}
