function reactToAnswer(result){
    if (result === true) {
        alert("Parabéns! Você acertou!");
        return 1;
      } else {
        alert("Resposta incorreta! Tente novamente!");
        return 2;
      }
}

function entradaInvalida(id) {
    const elementInput = document.getElementById(`txt${id}`);
    elementInput.style.background = "#dc3545";
  }
  
  function resultadoInvalido() {
    if (
      !window.confirm(
        "Entrada Inválida! Verifique as Marcações em Vermelho\nGostaria de tentar novamente?"
      )
    ) 
    {
      window.location.href = "/menu";
    }
  }

function test1(){
  var flag = false;
  var flagI = false;
  var flagI = false;
  var valor_total = document.getElementById("txtvalor total").value;
  if (valor_total == "") {
    var flag = true;
    var flagI = true;
  }
  var valor_total = Number(document.getElementById("txtvalor total").value);
  if (isNaN(valor_total) || !Number.isInteger(valor_total)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("valor total");
  var flagI = false;

  

  var numero_alunos_10 = document.getElementById("txtnumero de alunos com 10").value;
  if (numero_alunos_10 == "") {
    var flag = true;
    var flagI = true;
  }
  var numero_alunos_10 = Number(document.getElementById("txtnumero de alunos com 10").value);
  if (isNaN(numero_alunos_10) || !Number.isInteger(numero_alunos_10)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("numero de alunos com 10");
  var flagI = false;

  if (flag) {
    resultadoInvalido();
  }

  
    var numero_alunos_10 = document.getElementById("txtnumero de alunos com 10").value;
    return reactToAnswer(correct1(valor_total,numero_alunos_10)!=wrong1(valor_total,numero_alunos_10));
}

function correct1(valor_total,numero_alunos_10){
    if(numero_alunos_10!=0){
    const valor_para_cada=valor_total/numero_alunos_10;
    return valor_para_cada;
    }
}

function wrong1(valor_total,numero_alunos_10){
    const valor_para_cada=valor_total/numero_alunos_10;
    return valor_para_cada;
}


function test2(){
    var flag = false;
  var flagI = false;
  var flagI = false;
  var temperatura = document.getElementById("txttemperatura").value;
  if (temperatura == "") {
    var flag = true;
    var flagI = true;
  }
  var temperatura = Number(document.getElementById("txttemperatura").value);
  if (isNaN(temperatura) || !Number.isInteger(temperatura)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("temperatura");
  if (flag) {
    resultadoInvalido();
  } else {
    return reactToAnswer(correct2(temperatura) != wrong2(temperatura));
  }

    var temperatura = document.getElementById("txttemperatura").value;
    return reactToAnswer(correct2(temperatura)!=wrong2(temperatura));
}

function correct2(temperatura){
    return (((temperatura**2)**0.5)*1.2).toFixed(2)
}
function wrong2(temperatura){
    return (((temperatura**0.5)**2)*1.2).toFixed(2)
}

function funcaoJuizEstiloCacabugs(idQuestao) {
    if (idQuestao === 1) {
      return test1();
    } else if (idQuestao === 2) {
      return test2();
    }
  }
  
  module.exports = {
    funcaoJuizEstiloCacabugs,
  };