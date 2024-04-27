
/**
 * Armazena um vetor de arrays com entrada e saida
 */
let linguagem_id_Global;
/**
 * Armazena um vetor de arrays com entrada e saida
 */
let extensaoGlobal;
/**
 * Armazena um vetor de arrays com entrada e saida
 */
let casosGlobal;
/**
 * Armazerna o codigo a ser compilado
 */
let codigoGlobal;
/**
 * Media do tempo de execução do código
 */
let tempo_de_execucaoGlobal;
/**
 * Armazerna o saida produzida pelo código do usuário
 */
let saidasUsuarioGlobal;
/**
 * Armazerna o resultado do código do usuário 
 */
let resultadoGlobal;

const diretorio = process.env.TMP_DIRECTORY || "/var/tmp";

const tmp = require('tmp');
const fs = require('fs')
const { execSync } = require("child_process");

/**
 * Construtor
 */
function construtor(casos, codigoFonte, linguagem_id) {
	casosGlobal = casos;

	switch (linguagem_id) {
		case 1: //C
			extensaoGlobal = ".c";
			break;
		case 2: //CPP
			extensaoGlobal = ".cpp";
			break;
		case 3: //JAVA
			extensaoGlobal = ".java";
			break;
		case 4: //LUA
			extensaoGlobal = ".lua";
			break;
		case 5: //PYTHON
			extensaoGlobal = ".py";
			break;
	}

	linguagem_id_Global = linguagem_id;
	codigoGlobal = criaArquivoTemporario(codigoFonte, extensaoGlobal);
	tempo_de_execucaoGlobal = [];
	saidasUsuarioGlobal = [];
	resultadoGlobal = true;
}

/**
 * Retorna o tempo de execução do código
 */
function getTempoDeExecucao() {
	return tempo_de_execucaoGlobal;
}

/**
 * Retorna o vetor de entradas armazenado no vetor de objetos $casos
 */
function getEntradas() {
	let entradas = [];
	casosGlobal["in"].forEach(caso => {
		entradas.push(caso)
	})
	return entradas;
}

/**
 * Retorna o vetor de saidas armazenado no vetor de objetos $casos
 */
function getSaidas() {
	let saidas = [];
	casosGlobal["out"].forEach(caso => {
		saidas.push(caso)
	})

	return saidas;
}

function microtime(getAsFloat) {
	let s, now = (Date.now ? Date.now() : new Date().getTime()) / 1000;

	// Getting microtime as a float is easy
	if (getAsFloat) {
		return now
	}

	// Dirty trick to only get the integer part
	s = now | 0

	return (Math.round((now - s) * 1000) / 1000) + ' ' + s
}

/**
 * Compila e executa o codigo passado, tendo como entrada $this->getEntradas()
 */
function executar(call) {

	let respostas = [];


	let executavel = "";
	let retornoExec = "";

	switch (linguagem_id_Global) {
		case 1: //C
			executavel = criaArquivoTemporario();
			try {
				retornoExec = execSync(`gcc "${codigoGlobal}" -o "${executavel}" -Wfatal-errors -w`).toString()
			} catch (ex) {
				retornoExec = ex.stderr.toString().trim();
			}
			break;
		case 2: //CPP
			executavel = criaArquivoTemporario();
			try {
				retornoExec = execSync(`g++ "${codigoGlobal}" -o "${executavel}" -Wfatal-errors -w -std=c++14`).toString()
			} catch (ex) {
				retornoExec = ex.stderr.toString().trim();
			}
			break;
		case 3: //JAVA
			executavel = codigoGlobal.replace(".java", "");
			try {
				retornoExec = execSync(`javac -d "teste" "${codigoGlobal}"`).toString()
			} catch (ex) {
				retornoExec = ex.stderr.toString().trim();
			}
			break;
		case 4: //LUA
			executavel = criaArquivoTemporario();
			try {
				retornoExec = execSync(`luac -o "${executavel}" "${codigoGlobal}"`).toString()
			} catch (ex) {
				retornoExec = ex.stderr.toString().trim();
			}
			break;
		case 5: //PYTHON
			try {
				retornoExec = execSync(`python -m py_compile "${codigoGlobal}"`).toString()
			} catch (ex) {
				retornoExec = ex.stderr.toString().trim();
			}
			break;
	}

	let res = {};

	if (retornoExec) {
		res = {
			resultado: retornoExec.replace(`${codigoGlobal}`, "codigo" + extensaoGlobal),
			tempo_inicial: null,
			tempo_final: null,
			tipo_resultado: 3
		}
	} else {

		respostas = criaArquivoSaidasUsuario(executavel, getEntradas);

		if (respostas !== null) {
			let result = resultado(respostas);

			if (resultadoGlobal) { // Se não ocorreu erro de execução
				res = {
					resultado: saidasUsuarioGlobal.join(""),
					tempo_inicial: tempo_de_execucaoGlobal["in"],
					tempo_final: tempo_de_execucaoGlobal["out"],
					tipo_resultado: 1
				}
			} else { // Se ocorreu erro de execução
				res = {
					resultado: saidasUsuarioGlobal.join(""),
					tempo_inicial: tempo_de_execucaoGlobal["in"],
					tempo_final: tempo_de_execucaoGlobal["out"],
					tipo_resultado: 2
				}
			}
		} else {
			res = {
				resultado: "ERRO: Tempo Limite Excedido!",
				tempo_inicial: null,
				tempo_final: null,
				tipo_resultado: 4
			}
		}

	}

	return res;
}

/**
 * Recebe o resultado da execução do código, e armazena em um arquivo temporario
 */
function criaArquivoSaidasUsuario(executavel, arquivosTeste) {
	const limitTime = 5000;
	let saidas = []
	let timeExpired = false;
	tempo_de_execucaoGlobal["in"] = microtime(true);

	arquivosTeste().forEach(entrada => {

		if (!timeExpired) {
			let arquivo = criaArquivoTemporario(entrada, ".txt");
			let nome_arquivo_temporario_saida = tmp.tmpNameSync({ prefix: '/COSMO_ARQUIVO_TEMP_SAIDA_USER_', postfix: ".txt", dir: diretorio });

			let retornoExec = "";

			switch (linguagem_id_Global) {
				case 1: //C
					try {
						retornoExec = execSync(`"${executavel}" < "${arquivo}"`, { timeout: limitTime }).toString();
						fs.writeFileSync(nome_arquivo_temporario_saida, retornoExec);
					} catch (ex) {
						timeExpired = true
					}
					break;
				case 2: //CPP
					try {
						retornoExec = execSync(`"${executavel}" < "${arquivo}"`, { timeout: limitTime }).toString();
						fs.writeFileSync(nome_arquivo_temporario_saida, retornoExec);
					} catch (ex) {
						timeExpired = true
					}
					break;
				case 3: //JAVA
					try {
						retornoExec = execSync(`java "${executavel}" < "${arquivo}"`, { timeout: limitTime }).toString();
						fs.writeFileSync(nome_arquivo_temporario_saida, retornoExec);
					} catch (ex) {
						timeExpired = true
					}
					break;
				case 4: //LUA
					try {
						retornoExec = execSync(`lua "${executavel}" < "${arquivo}"`, { timeout: limitTime }).toString();
						fs.writeFileSync(nome_arquivo_temporario_saida, retornoExec);
					} catch (ex) {
						timeExpired = true
					}
					break;
				case 5: //PYTHON
					try {
						retornoExec = execSync(`python "${codigoGlobal}" < "${arquivo}"`, { timeout: limitTime }).toString();
						fs.writeFileSync(nome_arquivo_temporario_saida, retornoExec);
						//console.log("try",retornoExec)
					} catch (ex) {
						//console.log("catch",ex.signal, ex.signal !== 'null')
						if (ex.signal === null) {
							//console.log("retorno", ex.stderr.toString().trim())
							fs.writeFileSync(nome_arquivo_temporario_saida, ex.stderr.toString().trim());
						} else {
							timeExpired = true
						}
					}
					break;
			}
			if (!timeExpired) {
				saidas.push(nome_arquivo_temporario_saida);
			}
		}

	})

	tempo_de_execucaoGlobal["out"] = microtime(true);
	if (timeExpired) {
		return null
	}
	return saidas;
}


/**
 * Verifica se os dois arquivos sao iguais
*/
function resultado(respostas) {

	const gabarito = getSaidas();
	for (let i in respostas) {
		respostas[i] = respostas[i].replace(/[\\]/g, '/')

		let resBuff = fs.readFileSync(respostas[i], "utf-8").toString()

		resBuff = resBuff.replace("\r", ""); // Adicionei essa linha. Dia 03/10

		saidasUsuarioGlobal.push(resBuff);
		saidasUsuarioGlobal.push("\r\n");

		//console.log(gabarito[i], resBuff);
		//console.log(resultadoGlobal);
		if (gabarito[i] !== resBuff) {
			resultadoGlobal = false;
		}
	}
}

/**
 * Cria um arquivo temporario do conteudo passado por parametro
 */
function criaArquivoTemporario(conteudo = "", extensao = "", complemento = "") {

	let tmpObject = tmp.fileSync({ discardDescriptor: true, prefix: '/COSMO_ARQUIVO_TEMP_', postfix: extensao, dir: diretorio })

	let retornoWrite = fs.writeFileSync(tmpObject.name, conteudo);

	return (tmpObject.name).replace(/[\\]/g, '/');
}

module.exports.main = function (casoTeste, codUsuario, linguagem_id) {

	construtor(casoTeste, codUsuario, linguagem_id)
	const resultFinal = executar()
	tmp.setGracefulCleanup()
	return resultFinal

}



