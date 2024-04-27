import React, { Component } from 'react'

export default class Properties extends Component{
	
    render(){

        return (
			<div>
				<div className="row">
					<span><i className="fas fa-user fa-lg ml-2 p-1"></i>Atividade cadastrada por: <i>{this.props.autor}</i></span>
				</div>
				<div className="row">
					<span><i className="fas fa-tags fa-lg ml-2 p-1"></i>Categoria: <i>{this.props.categoria}</i></span>
				</div>
				<div className="row">
					<span><i className="fas fa-clock fa-lg ml-2 p-1"></i>Limite de tempo: <i>{this.props.limite_tempo} ms</i></span>
				</div>											
				<div className="row">
					<span><i className="fas fa-coins fa-lg ml-2 p-1"></i>Prêmio: <i>{this.props.moedas} moedas</i></span>
				</div>
				<div className="row">
					<span><i className="fas fa-briefcase fa-lg ml-2 p-1"></i>Experiência: <i>{this.props.xp} xps</i></span>
				</div>	
				<div className="row">
					<span><i className="fas fa-brain fa-lg ml-2 p-1"></i>Nível de dificuldade: <i>{this.props.dificuldade}</i></span>
				</div>
			</div>
        )
    }
}