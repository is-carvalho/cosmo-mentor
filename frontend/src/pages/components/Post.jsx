import React, { createContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../css/Post.css";
import api from "../../services/api";
import userCosmo from "../../images/amostra-usuarios/2.png";

export default function Post(props) {
  const [autor] = useState(props.autor);
  const [titulo] = useState(props.titulo);
  const [conteudo] = useState(props.conteudo);
  const [postId] = useState(props.postId);
  const [turmaId] = useState(props.turmaId);
  const [cursoId] = useState(props.cursoId);
  const [questaoId] = useState(props.questaoId);
  const [questaoNome, setQuestaoNome] = useState();

  useEffect(() => {
    if (questaoId) {
      api
        .get(`/question/${questaoId}`)
        .then((res) => {
          setQuestaoNome(res.data.titulo);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [autor, titulo]);

  return (
    <>
      <div data-aos="fade-left">
        <div className="card border-info mb-3">
          <div className="card-header">
            <div className="autor-card">
              Publicado por: {autor}{" "}
              <img
                src={userCosmo}
                alt="foto"
                style={{ height: 50, width: 50, margin: 10, borderRadius: 90 }}
              />
            </div>
            <div className="questionName">
              {questaoNome ? (
                `Postagem relativa à questão: ${questaoNome} `
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="card-body">
            <h4 className="titulo-card">{titulo}</h4>
            <p className="card-title">{conteudo}</p>
            <Link
              to={{
                pathname: `/respostas/${postId}`,
                state: {
                  titulo,
                  autor,
                  conteudo,
                  postId,
                  turmaId,
                  questaoId,
                  cursoId,
                },
              }}
            >
              <input
                type="submit"
                value="Abrir Post"
                className="btn float-right login_btn"
                style={{ color: "white" }}
              />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
