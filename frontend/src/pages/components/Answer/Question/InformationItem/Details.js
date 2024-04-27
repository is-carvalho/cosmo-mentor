import React, { Component } from 'react';
import './Details.css';

export default class Details extends Component {
  render() {
    var exemplos_entradas = [];
    if (this.props.exemplos_entradas) {
      for (let i = 0; i < this.props.exemplos_entradas.length; i++) {
        exemplos_entradas.push(this.props.exemplos_entradas[i]);
      }
    }

    var exemplos_saidas = [];
    if (this.props.exemplos_saidas) {
      for (let i = 0; i < this.props.exemplos_saidas.length; i++) {
        exemplos_saidas.push(this.props.exemplos_saidas[i]);
      }
    }

    const tableExamples = exemplos_entradas.map((exemplos_entrada, index) => {
      return (
        <tr>
          <td>{exemplos_entrada}</td>
          <td className='list-2'>{this.props.exemplos_saidas[index]}</td>
        </tr>
      );
    });

    return (
      <div className='problem'>
        <div className='problem-content'>
          <div className='problem-content-column1'>
            <p
              className='problem-enunciado'
              align='justify'
              dangerouslySetInnerHTML={{ __html: this.props.enunciado }}
            ></p>

            <h3>Entrada</h3>
            <p
              align='justify'
              dangerouslySetInnerHTML={{ __html: this.props.descricao_entrada }}
            ></p>

            <h3>Saída</h3>
            <p
              align='justify'
              dangerouslySetInnerHTML={{ __html: this.props.descricao_saida }}
            ></p>
          </div>
          <div className='problem-content-column2'>
            <h3>Exemplos</h3>
            <table className='table table-striped'>
              <thead>
                <tr>
                  <th scope='col'>Entradas</th>
                  <th scope='col'>Saídas</th>
                </tr>
              </thead>
              <tbody>{tableExamples}</tbody>
            </table>
            <p>
              {this.props.observacao !== null &&
              this.props.observacao !== '' ? (
                <strong
                  dangerouslySetInnerHTML={{
                    __html: 'Observação: ' + this.props.observacao,
                  }}
                ></strong>
              ) : null}
            </p>
          </div>
        </div>
      </div>
    );
  }
}
