import React, { Component } from 'react'
import api from '../../../../services/api';

export default class Information extends Component{

    constructor(){
        super()
		
		this.state = {
			linguagens: []
		};
	}
	
	componentDidMount(){
		api.get('/languages')
		.then( response => {
			return response.data.map(linguagem => ({
				id: `${linguagem.id}`,
				descricao: `${linguagem.descricao}`
			}));
		})
		.then( linguagens => {
			this.setState({
				linguagens
			});
		})
	}
	
    render(){

        return (
			<React.Fragment>
				<div className="col-md-6">
					<select name="lang" id="lang" className="form-control" value={this.props.value} onChange={this.props.onChange} disabled={this.props.disabled}>
						<option key="0" value="0">Selecione a linguagem...</option>
						{
							this.state.linguagens.map( function(linguagem) {
								return <option key={linguagem.id} value={linguagem.id}>{linguagem.descricao}</option>;
							})
						}
					</select>
				</div>
			</React.Fragment>
        )
    }
}