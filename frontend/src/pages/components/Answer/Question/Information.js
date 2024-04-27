import React, { Component } from 'react'
import api from '../../../../services/api';
import InformationDetails from "./InformationItem/Details";
//import InformationProperties from "./InformationItem/Properties";
import '../../../../css/ResolucaoProblema.css'

export default class Information extends Component{
    state = {value:''}
	
	componentDidMount(){

		const questao_id = this.props.questao_id;
		const turma_id = this.props.turma_id;

		api.get(`/question/${questao_id}`)
		.then( response => {
			return response.data;
		})
		.then( questao => {
			this.setState({
				id: questao_id,
				turma_id: turma_id,
				titulo: questao.titulo,
				enunciado: questao.enunciado,
				descricao_entrada: questao.descricao_entrada,
				descricao_saida: questao.descricao_saida,
				observacao: questao.observacao,
				autor: questao.autor,
				categoria: questao.categoria,
				moedas: questao.moedas,
				custo: questao.custo,
				xp: questao.xp,
				dificuldade: questao.dificuldade,
				limite_tempo: questao.limite_tempo,
				data_criacao: questao.data_criacao
			});
		})

		api.get(`/testCasesFromQuestion`, {
			headers: {
				question: questao_id,
				visible: true
			}
		})
		.then( response => {
			return response.data;
		})
		.then( exemplos => {
			this.setState({
				exemplos_entradas: exemplos.entradas,
				exemplos_saidas: exemplos.saidas
			});
		})			
	}
	
    render(){

        return (
			<React.Fragment>

				<div className="col-md-12 question-box">
					<InformationDetails
						titulo={this.state.titulo}
						enunciado={this.state.enunciado}
						descricao_entrada={this.state.descricao_entrada}
						descricao_saida={this.state.descricao_saida}
						exemplos_entradas={this.state.exemplos_entradas}
						exemplos_saidas={this.state.exemplos_saidas}
						observacao={this.state.observacao}
					/>
				</div>
			</React.Fragment>
        )
    }
}