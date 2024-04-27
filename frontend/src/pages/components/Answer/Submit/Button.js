import React, { Component } from 'react'

export default class Button extends Component{

    render(){

		let button;
		let processingButton = <button key="botao1" name="submit" type="submit" className="btn btn-primary" id="submit2" disabled><span className="spinner-border spinner-border-sm mr-2"></span>Processando ...</button>;
		let submitButton = <button key="botao2" name="submit" type="submit" className="btn btn-primary" id="submit" data-toggle="modal" data-target="#modalPush"><span className="fa fa-paper-plane mr-2"></span>Submeter solução!</button>;

		if(this.props.isProcessing) {
			button = processingButton;
		} else {
			button = submitButton;
		}
		
        return (
			<React.Fragment>
				<div className="col-md-6 text-right">
					{button}
				</div>
			</React.Fragment>
        )
    }
}