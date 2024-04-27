import React, { Component } from 'react';
import "../css/ListCursosTurmas.css";
import api from '../services/api';
import Navbar from './components/Navbar';
import jwt_decode from 'jwt-decode';
import Spinner from './components/Spinner';
import Alert from './components/Alert'
import Sidebar2 from './components/Sidebar'
const jwt = require('jsonwebtoken')


export default class Course extends Component {
    userId = this.getUserId();
    btnWrapperClicked = this.btnWrapperClicked.bind(this)

    state = {
        cursos: [],
        loading: true,
        classeWrapper: "wrapper active",
        alerts: []
    }

    showAlert(msg, status) {
        let alerts = this.state.alerts
        alerts.push(<Alert msg={msg} status={status} hide={this.closeAlert.bind(this)} />)
        this.setState({ alerts: alerts })
    }

    closeAlert() {
        let alerts = this.state.alerts
        alerts.shift()
        this.setState({ alerts: alerts })
    }

    componentDidMount() {
        api.get('courses').then(res => {
            const cursos = res.data;
            this.setState({ cursos: cursos, loading: false })
        }).catch(err => {
            this.showAlert("Erro ao carregar os cursos", "error")
        })
    }

    getUserId() {
        const token = localStorage.usertoken
        const decoded = jwt_decode(token)
        return decoded.id
    }

    goClasses(e, id) {
        e.preventDefault()

        let data = jwt.sign(id, this.userId.toString())
        // console.log("Criptografado: ", data)
        this.props.history.push(`/${data}/turmas`)
    }

    btnWrapperClicked(e) {
        if (e.target.className === "hamburger" || e.target.className === "hamburger__inner") {
            if (this.state.classeWrapper === 'wrapper active') {
                this.setState({
                    classeWrapper: "wrapper"
                })
            } else {
                this.setState({
                    classeWrapper: "wrapper active"
                })
            }
        }
    }

    render() {//aqui começa a renderizar(desenha) //
        if (this.state.loading) {
            return <Spinner />
        }

        const cursos = this.state.cursos; //puxa as informaçoes do state nessesarias para a geração dinamica do html 
        let lista = [];

        for (let i in cursos) {

            lista.push(
                <div className="col-4" key={cursos[i].id} >
                    <div className="image-flip">
                        <div className="mainflip">
                            <div className="frontside">
                                <div className="card">
                                    <div className="card-body text-center" >
                                        <div className="course-icon">
                                            <a href=""><i className="fas fa-graduation-cap"></i></a>
                                        </div>
                                        <h4 className="card-title">{cursos[i].nome}</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="backside">
                                <div className="card">
                                    <div className="card-body text-center">
                                        <div className="custom-scrollbar-css p-2">
                                            <section className="backside-head">
                                                <h5 className="card-title">{cursos[i].nome}</h5>
                                            </section>
                                            <section className="backside-body">
                                                <p className="card-text">{cursos[i].descricao}</p>
                                                <small className="form-text text-muted">Criado por {cursos[i].userNameCriador}</small>
                                            </section>
                                        </div>
                                        <section className="backside-footer">
                                            <button onClick={e => this.goClasses(e, cursos[i].id)} className="btn btn-cursos"><i className="fas fa-sign-in-alt"></i> Ir para o curso</button>
                                        </section>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        //console.log('state render',this.state)

        const retorno =
            <React.Fragment>
                <div className="fundo-bg fundo-gray" />
                <section className="section-titulo-cursos">
                    <h1>Cursos</h1>
                    <p></p>
                    <h5>Todos os nossos cursos são interativos, combinando teoria com exercícios práticos. É hora de arregaçar as mangas e aprender fazendo. </h5>
                </section>
                <section>
                    <div className="row">
                        {lista}

                    </div>
                </section>
            </React.Fragment>

        return (
            <React.Fragment>
                <div className={this.state.classeWrapper} onClick={this.btnWrapperClicked}>
                    <Navbar />

                    <div className="main_container">
                        <Sidebar2 activeOption="cursos" />

                        <div className="container-fluid">
                            <div className="row">
                                <div className="col">
                                    {retorno}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.alerts.length > 0 ? this.state.alerts[0] : null}
            </React.Fragment>
        )
    }
}
//foram 3 divs pos eu acho mais facil de organizar e futuramente fica mais facil de customizar com o css 