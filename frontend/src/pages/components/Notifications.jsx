import React, { useEffect, useState } from "react";
import { BallTriangle } from "react-loader-spinner";
import api from "../../services/api";
import "../../css/global.css";
import "../../css/Notifications.css";
import jwt_decode from "jwt-decode";
import { Link } from "react-router-dom";
import Spinner from "./Spinner";

function getUserData() {
  const token = localStorage.usertoken;
  const decoded = jwt_decode(token);

  return {
    id: decoded.id,
    tipo: decoded.tipo,
  };
}

function Notifications(props) {
  const [notificacoes, setNotificacoes] = useState([]);
  const [switch1, setSwitch1] = useState("link-off");
  const [switch2, setSwitch2] = useState("link-on");
  const [rerender, setRerender] = useState(false);

  useEffect(() => {
    // console.log(props.data)
    setNotificacoes(props.data);
    /*if(notificacoes.length === 0) {
        setSwitch1("link-off")
        setSwitch2("link-on")
      }*/
    // console.log(notificacoes[0])
  }, [props.data]);

  useEffect(() => {
    // console.log(notificacoes.length)
    if (notificacoes !== undefined && notificacoes.length > 0) {
      console.log("aqui");
      setSwitch1("link-on");
      setSwitch2("link-off");
    }
  }, [notificacoes, switch1]);

  const lerNotificacao = (notificationId) => {
    api.put("/readNotification", {
      headers: {
        notificationID: notificationId,
      },
    });
  };

  return (
    <div className="notification-div">
      <ul className="notification-ul">
        <h3>Últimas notificações</h3>
        {
          notificacoes !== undefined && notificacoes.length > 0 ? (
            notificacoes.map((notificacao, index) => (
              <>
                <Link
                  className={switch1}
                  key={index.toString()}
                  to={{
                    pathname: `/respostas/${notificacao.idPost}`,
                    state: {
                      titulo: notificacao.tituloPost,
                      autor: notificacao.nome,
                      conteudo: notificacao.descPost,
                      postId: notificacao.idPost,
                      turmaId: notificacao.idTurma,
                      questaoId: notificacao.idQuestao,
                      cursoId: notificacao.idCurso,
                    },
                  }}
                >
                  <li
                    key={index.toString()}
                    onClick={() => lerNotificacao(notificacao.notificationID)}
                  >
                    {notificacao.text}
                  </li>
                </Link>
                <li key={(index + 1).toString()} className={switch2}>
                  {"Sem notificações"}
                </li>
              </>
            )) /*<BallTriangle
                    height={200}
                    width={100}
                    radius={5}
                    color="#02224b"
                  />*/
          ) : (
            <li>{"Sem notificações"}</li>
          )
          /*<li>
                {
                    "Sem notificações!"
                }
                </li>*/
        }
      </ul>
    </div>
  );
}

export default Notifications;
