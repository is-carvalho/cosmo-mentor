import React, { Component } from 'react'
// import iconeCard from '../../images/avatar128.png'
import '../../css/AvalieCard.css'
import '../../css/global.css'

class AvalieCard extends Component {
    render() {
        return (
            <div className="card-avalie">
                <div className="avalia-icon">
                    <a href="#"><i className="fab fa-python"></i></a>
                </div>
                <div className="card-text">
                    <p>{this.props.nomeCurso}Nome_Curso em {this.props.linguagem}Nome_Linguagem</p>
                </div>
                <div className="btn-continuar">Iniciar Avaliação</div>
            </div>
        )
    }
}

export default AvalieCard