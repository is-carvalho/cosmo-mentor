import React, { Component } from "react";
import AceEditor from "react-ace";
import CodeQualityBox from "../Message/CodeQualityBox";


//import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-lua";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-text";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-monokai";

export default class Editor extends Component {
  render() {
    
    let mode;
    let linguagem_id = this.props.linguagem_id;

    let mensagens = this.props.suggestions 

    let hasMensagens = !(mensagens.length == 0)
    let sugestoes_complexidade = []
    let sugestoes_variaveis = []
    let sugestoes_refatoracao = []
    let allSuggestions = []

    function getSuggestionsAvailable(hasMensagens){

      if (hasMensagens){
        if (mensagens.variaveis.length > 0){
          sugestoes_variaveis = mensagens.variaveis
          allSuggestions = [...allSuggestions, ...sugestoes_variaveis]
        }
        if (mensagens.complexidade.length > 0){
          sugestoes_complexidade = mensagens.complexidade
        }
        if (mensagens.refatoracao.length > 0){
          sugestoes_refatoracao = mensagens.refatoracao
          allSuggestions = [...allSuggestions, ...sugestoes_refatoracao]
        }
      }
      return allSuggestions
    }


    // Função para mapear mensagens para classes (erro, aviso, info, aviso-info)
    function mapSuggestionsToClasses(suggestions) {
      const mappedSuggestions = suggestions.map((suggestion) => {
        const { type, message, line } = suggestion;

        let result = undefined;

        switch (type) {
          case "error":
            line != undefined ? result = { type: "error", message, line } : result = { type: "error", message };
            return result
          case "warning":
            line != undefined ? result = { type: "warning", message, line } : result = { type: "warning", message };
            return result
          case "info":
            line != undefined ? result = { type: "info", message, line } : result = { type: "info", message };
            return result
          case "info-warning":
            line != undefined ? result = { type: "info-warning", message, line } : result = { type: "info-warning", message };
            return result
          default:
            line != undefined ? result = { type: "info", message, line } : result = { type: "info", message };
            return result
        }
      });

      return mappedSuggestions;
    }

    // Função para criar objetos de anotações React Ace a partir de mensagens mapeadas
    function createReactAceAnnotations(messages) {
      const annotations = mapSuggestionsToClasses(messages);

      return annotations.map((annotation) => ({
        row: annotation.line != undefined ? annotation.line - 1: 0, // A linha na qual a anotação deve ser exibida
        column: 0,  // A coluna na qual a anotação deve ser exibida (geralmente 0)
        type: annotation.type, // O tipo de anotação (error, warning, info, warning-info)
        text: annotation.message, // O texto da anotação
      }));
    }

    switch (linguagem_id) {
      case "1": //C
        mode = "c_cpp";
        break;
      case "2": //CPP
        mode = "c_cpp";
        break;
      case "3": //JAVA
        mode = "java";
        break;
      case "4": //LUA
        mode = "lua";
        break;
      case "5": //PYTHON
        mode = "python";
        break;
      default: //TEXT
        mode = "text";
    }
    allSuggestions = getSuggestionsAvailable(hasMensagens)
    const annotations = createReactAceAnnotations(allSuggestions);
    // style={{ wordSpacing: "-20px" }}
    return (
      <>
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h5>Digite seu código aqui</h5>
            </div>
            <div className="card-body p-0" />
            <div className=""></div>
            <AceEditor
              placeholder="Placeholder Text"
              mode={mode}
              theme="github"
              name="blah2"
              fontSize={14}
              width="100%"
              showPrintMargin={true}
              showGutter={true}
              // highlightActiveLine={!this.props.readOnly}
              // highlightGutterLine={!this.props.readOnly}
              readOnly={this.props.readOnly}
              value={this.props.codigo}
              onChange={this.props.onChange}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 2,
                fontFamily: "Times",
                setShowInvisibles: false,
              }}
              annotations={annotations}
            />
            <CodeQualityBox  message = {!(sugestoes_complexidade.length === 0) ? sugestoes_complexidade : []} type = {"warning"}/>
          </div>
        </div>
      </>
    );
  }
}
