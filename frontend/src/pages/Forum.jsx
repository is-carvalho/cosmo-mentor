import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Post from "./components/Post";
import "../css/Forum.css";
import api from "../services/api";
import jwt_decode from "jwt-decode";
import Header from "./components/Header";
import GoBackButton from "./components/BotaoVoltar";
import Spinner from "./components/Spinner";

function getUserId() {
  const token = localStorage.usertoken;
  const decoded = jwt_decode(token);
  return decoded;
}
export default function Forum(props) {
  const location = useLocation();

  const [user] = useState(getUserId());
  const [questaoId, setQuestao] = useState();
  const [turmaId, setTurma] = useState();
  const [cursoId, setCurso] = useState();
  const [results, setResults] = useState();
  const [turmasUser, setTurmasUser] = useState();
  const [cursos, setCursos] = useState();
  const [loading, setLoading] = useState(false)

  // const [btnWrapperClicked, setBtnWrapperClicked] = useState('sidebar')
  /*useEffect(() => {
    api
      .get(`forum`, {
        headers: {
          userId: user.id,
        },
      })
      .then((res) => {
        if (res.data.status) {
          setResults(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user]);*/

  useEffect(() => {
    try {
      if (location.state.menu) {
        /*api.get('courses').then(res => {
                setCursos(res.data)
                console.log(cursos)
            }).catch(err => {
                console.log(err)
            })

            api.get(`classesUser`, {
                headers: {
                    course: cursoId,
                    user: user.id
                }
            }).then(res => {
                setTurmasUser(res.data.data)
                console.log(res.data.data)
            })*/
        setLoading(true)
        api
          .get(`/forum`, {
            headers: {
              userId: user.id,
            },
          })
          .then((res) => {
            setLoading(false)
            if (res.data.status) {
              setResults(res.data.data);
            }
          })
          .catch((err) => {
            setLoading(false)
            console.log(err);
          });
      } else {
        setQuestao(location.state.questId);
        setTurma(location.state.turmaId);
        setCurso(location.state.cursoId);

        setLoading(true)
        api
          .get(`/duvidas/${questaoId}/${turmaId}`, {
            headers: {
              questaoId: questaoId,
              userId: user.id,
            },
          })
          .then((res) => {
            setLoading(false)
            if (res.data.status) {
              setResults(res.data.data);
              console.log(res.data.data);
            }
          })
          .catch((err) => {
            setLoading(false)
            console.log(err);
            results.length = 0;
          });
      }
    } catch (e) {}
  }, [questaoId, turmaId, cursoId]);

  return (
    <>
      {loading ? <Spinner /> : <></>}
      <Header />
      <div className="container-fluid">
        <div className="container-forum">
          <div className="info">
            {turmaId !== undefined ? (
              <Link
                to={{
                  pathname: `/${cursoId}/${turmaId}/${questaoId}/criarPost`,
                  state: {
                    cursoId: cursoId,
                    turmaId: turmaId,
                    questId: questaoId,
                  },
                }}
                className="btn btn-success"
              >
                <i className="fas fa-plus"></i> Cadastrar Postagem
              </Link>
            ) : (
              <Link to="/criarPost" className="btn btn-success">
                <i className="fas fa-plus"></i> Cadastrar Postagem
              </Link>
            )}
          </div>
          <br />
          <div>
            <ul>
              {/* {results?.map((post, index) => console.log(results[index]))} */}
              {results?.map((post, index) => (
                <li key={index.toString()}>
                  {
                    <Post
                      assunto={post.descricao}
                      autor={post.nomeAutor}
                      titulo={post.titulo}
                      status={1}
                      conteudo={post.descricao}
                      imagem={undefined}
                      postId={results[index].idPost}
                      turmaId={turmaId}
                      questaoId={post.idQuestao}
                      questaoNome={post.questaoNome}
                      cursoId={cursoId}
                    />
                  }
                </li>
              ))}
            </ul>
            <GoBackButton />
          </div>
        </div>
      </div>
    </>
  );
}
