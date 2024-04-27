function entradaInvalida(id) {
  const elementInput = document.getElementById(`txt${id}`);
  elementInput.style.background = "#dc3545";
}

function resultadoInvalido(index) {
  if (
    !window.confirm(
      "Entrada Inválida! Verifique as Marcações em Vermelho\nGostaria de tentar novamente?"
    )
  ) {
    window.location.href = "/cacabugs";
  }
}

function reactToAnswer(result, index, entries) {
  if (result === true) {
    alert("Parabéns! Você acertou!");
    window.location.href = "/cacabugs";
    return 1;
  } else {
    alert("Resposta incorreta! Tente novamente!");
    return 2;
  }
}

function test0() {
  var flag = false;
  var flagI = false;
  var flagI = false;
  var carlos = document.getElementById("txtcarlos").value;
  if (carlos == "") {
    var flag = true;
    var flagI = true;
  }
  var carlos = Number(document.getElementById("txtcarlos").value);
  if (isNaN(carlos) || !Number.isInteger(carlos)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("carlos");
  var flagI = false;
  var pedro = document.getElementById("txtpedro").value;
  if (pedro == "") {
    var flag = true;
    var flagI = true;
  }
  var pedro = Number(document.getElementById("txtpedro").value);
  if (isNaN(pedro) || !Number.isInteger(pedro)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("pedro");
  var flagI = false;
  var welton = document.getElementById("txtwelton").value;
  if (welton == "") {
    var flag = true;
    var flagI = true;
  }
  var welton = Number(document.getElementById("txtwelton").value);
  if (isNaN(welton) || !Number.isInteger(welton)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("welton");
  if (flag) {
    resultadoInvalido(0);
  } else {
    return reactToAnswer(
      correct0(carlos, pedro, welton) != wrong0(carlos, pedro, welton),
      0,
      "carlos: " +
        carlos +
        "; " +
        "pedro: " +
        pedro +
        "; " +
        "welton: " +
        welton
    );
  }

  return 2;
}
function correct0(carlos, pedro, welton) {
  var cont = 0;
  if (pedro < carlos) {
    cont++;
  }
  if (welton < carlos) {
    cont++;
  }
  return cont;
}
function wrong0(carlos, pedro, welton) {
  if (pedro < carlos) {
    if (welton < carlos) {
      return 2;
    }
    return 1;
  }
  return 0;
}
function test1() {
  var flag = false;
  var flagI = false;
  var flagI = false;
  var age = document.getElementById("txtage").value;
  if (age == "") {
    var flag = true;
    var flagI = true;
  }
  var age = Number(document.getElementById("txtage").value);
  if (isNaN(age) || !Number.isInteger(age)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("age");
  if (flag) {
    resultadoInvalido(1);
  } else {
    return reactToAnswer(correct1(age) != wrong1(age), 1, "age: " + age);
  }
  return 2;
}
function correct1(age) {
  return age >= 18;
}
function wrong1(age) {
  return age > 18;
}
function test2() {
  var flag = false;
  var flagI = false;
  var flagI = false;
  var a = document.getElementById("txta").value;
  if (a == "") {
    var flag = true;
    var flagI = true;
  }
  var a = Number(document.getElementById("txta").value);
  if (isNaN(a) || !Number.isInteger(a)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("a");
  var flagI = false;
  var b = document.getElementById("txtb").value;
  if (b == "") {
    var flag = true;
    var flagI = true;
  }
  var b = Number(document.getElementById("txtb").value);
  if (isNaN(b) || !Number.isInteger(b)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("b");
  if (flag) {
    resultadoInvalido(2);
  } else {
    return reactToAnswer(
      correct2(a, b) != wrong2(a, b),
      2,
      "a: " + a + "; " + "b: " + b
    );
  }
  return 2;
}
function correct2(a, b) {
  return a + b;
}
function wrong2(a, b) {
  if (a == b) return a;
  else return a + b;
}
function test3() {
  var flag = false;
  var flagI = false;
  var flagI = false;
  var a = document.getElementById("txta").value;
  if (a == "") {
    var flag = true;
    var flagI = true;
  }
  var a = Number(document.getElementById("txta").value);
  if (isNaN(a) || !Number.isInteger(a)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("a");
  var flagI = false;
  var b = document.getElementById("txtb").value;
  if (b == "") {
    var flag = true;
    var flagI = true;
  }
  var b = Number(document.getElementById("txtb").value);
  if (isNaN(b) || !Number.isInteger(b)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("b");
  if (flag) {
    resultadoInvalido(3);
  } else {
    return reactToAnswer(
      correct3(a, b) != wrong3(a, b),
      3,
      "a: " + a + "; " + "b: " + b
    );
  }
  return 2;
}
function correct3(a, b) {
  return a + b >= 32 || (a >= 16 && b >= 16);
}
function wrong3(a, b) {
  return a + b >= 32 && a >= 16 && b >= 16;
}
function test4() {
  var flag = false;
  var flagI = false;
  var flagI = false;
  var a = document.getElementById("txta").value;
  if (a == "") {
    var flag = true;
    var flagI = true;
  }
  var a = Number(document.getElementById("txta").value);
  if (isNaN(a) || !Number.isInteger(a)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("a");
  var flagI = false;
  var b = document.getElementById("txtb").value;
  if (b == "") {
    var flag = true;
    var flagI = true;
  }
  var b = Number(document.getElementById("txtb").value);
  if (isNaN(b) || !Number.isInteger(b)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("b");
  var flagI = false;
  var c = document.getElementById("txtc").value;
  if (c == "") {
    var flag = true;
    var flagI = true;
  }
  var c = Number(document.getElementById("txtc").value);
  if (isNaN(c) || !Number.isInteger(c)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("c");
  var flagI = false;
  var d = document.getElementById("txtd").value;
  if (d == "") {
    var flag = true;
    var flagI = true;
  }
  var d = Number(document.getElementById("txtd").value);
  if (isNaN(d) || !Number.isInteger(d)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("d");
  var flagI = false;
  var e = document.getElementById("txte").value;
  if (e == "") {
    var flag = true;
    var flagI = true;
  }
  var e = Number(document.getElementById("txte").value);
  if (isNaN(e) || !Number.isInteger(e)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("e");
  if (flag) {
    resultadoInvalido(4);
  } else {
    return reactToAnswer(
      correct4(a, b, c, d, e) != wrong4(a, b, c, d, e),
      4,
      "a: " +
        a +
        "; " +
        "b: " +
        b +
        "; " +
        "c: " +
        c +
        "; " +
        "d: " +
        d +
        "; " +
        "e: " +
        e
    );
  }
  return 2;
}
function correct4(a, b, c, d, e) {
  return (
    a == b ||
    a == c ||
    a == d ||
    a == e ||
    b == c ||
    b == d ||
    b == e ||
    c == d ||
    c == e ||
    d == e
  );
}
function wrong4(a, b, c, d, e) {
  return a == b || a == c || a == d || a == e || c == d || c == e || d == e;
}
function test5() {
  var flag = false;
  var flagI = false;
  var flagI = false;
  var a = document.getElementById("txta").value;
  if (a == "") {
    var flag = true;
    var flagI = true;
  }
  var a = Number(document.getElementById("txta").value);
  if (isNaN(a) || !Number.isInteger(a)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("a");
  var flagI = false;
  var b = document.getElementById("txtb").value;
  if (b == "") {
    var flag = true;
    var flagI = true;
  }
  var b = Number(document.getElementById("txtb").value);
  if (isNaN(b) || !Number.isInteger(b)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("b");
  var flagI = false;
  var c = document.getElementById("txtc").value;
  if (c == "") {
    var flag = true;
    var flagI = true;
  }
  var c = Number(document.getElementById("txtc").value);
  if (isNaN(c) || !Number.isInteger(c)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("c");
  if (flag) {
    resultadoInvalido(5);
  } else {
    return reactToAnswer(
      correct5(a, b, c) != wrong5(a, b, c),
      5,
      "a: " + a + "; " + "b: " + b + "; " + "c: " + c
    );
  }
  return 2;
}
function correct5(a, b, c) {
  return a + b > c && a + c > b && b + c > a;
}
function wrong5(a, b, c) {
  return a + b > c;
}
function test6() {
  var flag = false;
  var flagI = false;
  var flagI = false;
  var b = document.getElementById("txtb").value;
  if (b == "") {
    var flag = true;
    var flagI = true;
  }
  var b = Number(document.getElementById("txtb").value);
  if (isNaN(b) || !Number.isInteger(b)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("b");
  var flagI = false;
  var h = document.getElementById("txth").value;
  if (h == "") {
    var flag = true;
    var flagI = true;
  }
  var h = Number(document.getElementById("txth").value);
  if (isNaN(h) || !Number.isInteger(h)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("h");
  if (flag) {
    resultadoInvalido(6);
  } else {
    return reactToAnswer(
      correct6(b, h) != wrong6(b, h),
      6,
      "b: " + b + "; " + "h: " + h
    );
  }
  return 2;
}
function correct6(b, h) {
  return (b * h) / 2;
}
function wrong6(b, h) {
  if (b > h) {
    return ((b / 2) * h) / 2;
  } else {
    return (b * h) / 2;
  }
}
function test7() {
  var flag = false;
  var flagI = false;
  var flagI = false;
  var a = document.getElementById("txta").value;
  if (a == "") {
    var flag = true;
    var flagI = true;
  }
  var a = Number(document.getElementById("txta").value);
  if (isNaN(a) || !Number.isInteger(a)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("a");
  var flagI = false;
  var b = document.getElementById("txtb").value;
  if (b == "") {
    var flag = true;
    var flagI = true;
  }
  var b = Number(document.getElementById("txtb").value);
  if (isNaN(b) || !Number.isInteger(b)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("b");
  if (flag) {
    resultadoInvalido(7);
  } else {
    return reactToAnswer(
      correct7(a, b) != wrong7(a, b),
      7,
      "a: " + a + "; " + "b: " + b
    );
  }
  return 2;
}
function correct7(a, b) {
  if (a > b) {
    return a;
  }
  return b;
}
function wrong7(a, b) {
  if (a > b) {
    return a;
  }
  if (b > a) {
    return b;
  }
  return 0;
}
function test8() {
  var flag = false;
  var flagI = false;
  var flagI = false;
  var a = document.getElementById("txta").value;
  if (a == "") {
    var flag = true;
    var flagI = true;
  }
  var a = Number(document.getElementById("txta").value);
  if (isNaN(a) || !Number.isInteger(a)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("a");
  var flagI = false;
  var b = document.getElementById("txtb").value;
  if (b == "") {
    var flag = true;
    var flagI = true;
  }
  var b = Number(document.getElementById("txtb").value);
  if (isNaN(b) || !Number.isInteger(b)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("b");
  if (flag) {
    resultadoInvalido(8);
  } else {
    return reactToAnswer(
      correct8(a, b) != wrong8(a, b),
      8,
      "a: " + a + "; " + "b: " + b
    );
  }
  return 2;
}
function correct8(a, b) {
  return (a < b && a) || b;
}
function wrong8(a, b) {
  return (a < b && a) || (a > b && b);
}
function test9() {
  var flag = false;
  var flagI = false;
  var flagI = false;
  var channel = document.getElementById("txtchannel").value;
  if (channel == "") {
    var flag = true;
    var flagI = true;
  }
  var channel = Number(document.getElementById("txtchannel").value);
  if (isNaN(channel) || !Number.isInteger(channel)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("channel");
  if (flag) {
    resultadoInvalido(9);
  } else {
    return reactToAnswer(
      correct9(channel) != wrong9(channel),
      9,
      "channel: " + channel
    );
  }
  return 2;
}
function correct9(channel) {
  var flag = channel > 1 && channel < 1000;
  var flag = flag && channel % 11 == 0;
  return flag;
}
function wrong9(channel) {
  var flag = channel > 1 && channel < 1000;
  var flag = channel % 11 == 0;
  return flag;
}
function test10() {
  var flag = false;
  var flagI = false;
  var flagI = false;
  var a = document.getElementById("txta").value;
  if (a == "") {
    var flag = true;
    var flagI = true;
  }
  var a = Number(document.getElementById("txta").value);
  if (isNaN(a) || !Number.isInteger(a)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("a");
  var flagI = false;
  var b = document.getElementById("txtb").value;
  if (b == "") {
    var flag = true;
    var flagI = true;
  }
  var b = Number(document.getElementById("txtb").value);
  if (isNaN(b) || !Number.isInteger(b)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("b");
  var flagI = false;
  var c = document.getElementById("txtc").value;
  if (c == "") {
    var flag = true;
    var flagI = true;
  }
  var c = Number(document.getElementById("txtc").value);
  if (isNaN(c) || !Number.isInteger(c)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("c");
  if (flag) {
    resultadoInvalido(10);
  } else {
    return reactToAnswer(
      correct10(a, b, c) != wrong10(a, b, c),
      10,
      "a: " + a + "; " + "b: " + b + "; " + "c: " + c
    );
  }
  return 2;
}
function correct10(a, b, c) {
  var maior = a;
  if (b > maior) {
    var maior = b;
  }
  if (c > maior) {
    var maior = c;
  }
  return maior;
}
function wrong10(a, b, c) {
  if (a > b && a > c) {
    return a;
  } else if (b > a && b > c) {
    return b;
  } else {
    return c;
  }
}
function test11() {
  var flag = false;
  var flagI = false;
  var flagI = false;
  var a = document.getElementById("txta").value;
  if (a == "") {
    var flag = true;
    var flagI = true;
  }
  var a = Number(document.getElementById("txta").value);
  if (isNaN(a) || !Number.isInteger(a)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("a");
  var flagI = false;
  var b = document.getElementById("txtb").value;
  if (b == "") {
    var flag = true;
    var flagI = true;
  }
  var b = Number(document.getElementById("txtb").value);
  if (isNaN(b) || !Number.isInteger(b)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("b");
  var flagI = false;
  var c = document.getElementById("txtc").value;
  if (c == "") {
    var flag = true;
    var flagI = true;
  }
  var c = Number(document.getElementById("txtc").value);
  if (isNaN(c) || !Number.isInteger(c)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("c");
  if (flag) {
    resultadoInvalido(11);
  } else {
    return reactToAnswer(
      correct11(a, b, c) != wrong11(a, b, c),
      11,
      "a: " + a + "; " + "b: " + b + "; " + "c: " + c
    );
  }
  return 2;
}
function correct11(a, b, c) {
  var count = 0;
  if (a % 2 == 0) {
    count++;
  }
  if (b % 2 == 0) {
    count++;
  }
  if (c % 2 == 0) {
    count++;
  }
  return count;
}
function wrong11(a, b, c) {
  var count = 0;
  if (a % 2 == 0) {
    count++;
  } else if (b % 2 == 0) {
    count++;
  } else if (c % 2 == 0) {
    count++;
  }
  return count;
}
function test12() {
  var flag = false;
  var flagI = false;
  var flagI = false;
  var a = document.getElementById("txta").value;
  if (a == "") {
    var flag = true;
    var flagI = true;
  }
  var a = Number(document.getElementById("txta").value);
  if (isNaN(a) || !Number.isInteger(a)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("a");
  var flagI = false;
  var b = document.getElementById("txtb").value;
  if (b == "") {
    var flag = true;
    var flagI = true;
  }
  var b = Number(document.getElementById("txtb").value);
  if (isNaN(b) || !Number.isInteger(b)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("b");
  if (flag) {
    resultadoInvalido(12);
  } else {
    return reactToAnswer(
      correct12(a, b) != wrong12(a, b),
      12,
      "a: " + a + "; " + "b: " + b
    );
  }
  return 2;
}
function correct12(a, b) {
  if (a % 2 == 1 || b % 2 == 1) return 1;
  return 0;
}
function wrong12(a, b) {
  if ((a + b) % 2 == 0) {
    return 0;
  } else {
    return 1;
  }
}
function test13() {
  var flag = false;
  var flagI = false;
  var flagI = false;
  var a = document.getElementById("txta").value;
  if (a == "") {
    var flag = true;
    var flagI = true;
  }
  var a = Number(document.getElementById("txta").value);
  if (isNaN(a) || !Number.isInteger(a)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("a");
  var flagI = false;
  var b = document.getElementById("txtb").value;
  if (b == "") {
    var flag = true;
    var flagI = true;
  }
  var b = Number(document.getElementById("txtb").value);
  if (isNaN(b) || !Number.isInteger(b)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("b");
  var flagI = false;
  var c = document.getElementById("txtc").value;
  if (c == "") {
    var flag = true;
    var flagI = true;
  }
  var c = Number(document.getElementById("txtc").value);
  if (isNaN(c) || !Number.isInteger(c)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("c");
  if (flag) {
    resultadoInvalido(13);
  } else {
    return reactToAnswer(
      correct13(a, b, c) != wrong13(a, b, c),
      13,
      "a: " + a + "; " + "b: " + b + "; " + "c: " + c
    );
  }
  return 2;
}
function correct13(a, b, c) {
  if (a == 0) {
    if (b == 0 && c == 0) {
      return true;
    }
    return false;
  }
  return b / a == c / b;
}

function wrong13(a, b, c) {
  return b / a == c / b;
}
function test14() {
  var flag = false;
  var flagI = false;
  var flagI = false;
  var a = document.getElementById("txta").value;
  var flagI = false;
  var b = document.getElementById("txtb").value;
  var flagI = false;
  var c = document.getElementById("txtc").value;
  if (flag) {
    resultadoInvalido(14);
  } else {
    return reactToAnswer(
      correct14(a, b, c) != wrong14(a, b, c),
      14,
      "a: " + a + "; " + "b: " + b + "; " + "c: " + c
    );
  }
  return 2;
}
function correct14(a, b, c) {
  var count = 0;
  if (a == "cosmos") count++;
  if (b == "cosmos") count++;
  if (c == "cosmos") count++;
  return count;
}
function wrong14(a, b, c) {
  if (a == "cosmos") {
    if (b == "cosmos") {
      if (c == "cosmos") {
        return 3;
      } else {
        return 2;
      }
    } else if (c == "cosmos") {
      return 2;
    } else {
      return 1;
    }
  } else {
    if (b == "cosmos") {
      return 1;
    } else if (c == "cosmos") {
      return 1;
    } else {
      return 0;
    }
  }
  return 0;
}
function test15() {
  var flag = false;
  var flagI = false;
  var flagI = false;
  var a = document.getElementById("txta").value;
  if (a == "") {
    var flag = true;
    var flagI = true;
  }
  var a = Number(document.getElementById("txta").value);
  if (isNaN(a)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("a");
  var flagI = false;
  var b = document.getElementById("txtb").value;
  if (b == "") {
    var flag = true;
    var flagI = true;
  }
  var b = Number(document.getElementById("txtb").value);
  if (isNaN(b)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("b");
  var flagI = false;
  var c = document.getElementById("txtc").value;
  if (c == "") {
    var flag = true;
    var flagI = true;
  }
  var c = Number(document.getElementById("txtc").value);
  if (isNaN(c)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("c");
  if (flag) {
    resultadoInvalido(15);
  } else {
    return reactToAnswer(
      correct15(a, b, c) != wrong15(a, b, c),
      15,
      "a: " + a + "; " + "b: " + b + "; " + "c: " + c
    );
  }
  return 2;
}
function correct15(a, b, c) {
  //var delta = 0;
  var delta = b * b - 4 * a * c;
  if (delta < 0) {
    return null;
  }
  var x = (-b - Math.sqrt(delta)) / (2 * a);
  return x;
}
function wrong15(a, b, c) {
  //var delta = 0;
  var delta = b * b - 4 * a * c;
  if (delta < 0) {
    return null;
  }
  var x = ((-b - Math.sqrt(delta)) / 2) * a;
  return x;
}
function test16() {
  var flag = false;
  var flagI = false;
  var flagI = false;
  var a = document.getElementById("txta").value;
  if (a == "") {
    var flag = true;
    var flagI = true;
  }
  var a = Number(document.getElementById("txta").value);
  if (isNaN(a) || !Number.isInteger(a)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("a");
  var flagI = false;
  var b = document.getElementById("txtb").value;
  if (b == "") {
    var flag = true;
    var flagI = true;
  }
  var b = Number(document.getElementById("txtb").value);
  if (isNaN(b) || !Number.isInteger(b)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("b");
  if (flag) {
    resultadoInvalido(16);
  } else {
    return reactToAnswer(
      correct16(a, b) != wrong16(a, b),
      16,
      "a: " + a + "; " + "b: " + b
    );
  }
  return 2;
}
function correct16(a, b) {
  var total = 1;
  for (var i = 1; i <= b; i++) {
    var total = total * a;
  }
  return total;
}
function wrong16(a, b) {
  var total = a;
  for (var i = 1; i <= b - 1; i++) {
    var total = total * a;
  }
  return total;
}
function test17() {
  var flag = false;
  var flagI = false;
  var flagI = false;
  var n = document.getElementById("txtn").value;
  if (n == "") {
    var flag = true;
    var flagI = true;
  }
  var n = Number(document.getElementById("txtn").value);
  if (isNaN(n) || !Number.isInteger(n)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("n");
  if (flag) {
    resultadoInvalido(17);
  } else {
    return reactToAnswer(correct17(n) != wrong17(n), 17, "n: " + n);
  }

  return 2;
}
function correct17(n) {
  var total = 1;
  for (var i = 1; i <= n; i++) {
    var total = total * i;
  }
  return total;
}
function wrong17(n) {
  for (var i = n - 1; i >= 1; i--) {
    n = n * i;
  }
  return n;
}
function test18() {
  var flag = false;
  var flagI = false;
  var flagI = false;
  var v = document.getElementById("txtv").value.split(" ");
  for (var i = 0; i < v.length; i++) {
    if (v[i] == " " || v[i] == "") {
      var flag = true;
      var flagI = true;
      break;
    }
    v[i] = Number(v[i]);
    if (isNaN(v[i])) {
      var flag = true;
      var flagI = true;
      break;
    }
  }
  if (flagI == true) entradaInvalida("v");
  if (flag) {
    resultadoInvalido(18);
  } else {
    return reactToAnswer(correct18(v) != wrong18(v), 18, "v: " + v);
  }

  return 2;
}
function correct18(v) {
  var maior = v[0];
  for (var i = 1; i < 5; i++) {
    if (v[i] > maior) {
      var maior = v[i];
    }
  }
  return maior;
}
function wrong18(v) {
  var maior = 0;
  for (var i = 0; i < 5; i++) {
    if (v[i] > maior) {
      var maior = v[i];
    }
  }
  return maior;
}
function test19() {
  var flag = false;
  var flagI = false;
  var flagI = false;
  var num = document.getElementById("txtnum").value;
  if (num == "") {
    var flag = true;
    var flagI = true;
  }
  var num = Number(document.getElementById("txtnum").value);
  if (isNaN(num) || !Number.isInteger(num)) {
    var flag = true;
    var flagI = true;
  }
  if (flagI == true) entradaInvalida("num");
  if (flag) {
    resultadoInvalido(19);
  } else {
    return reactToAnswer(correct19(num) != wrong19(num), 19, "num: " + num);
  }
  return 2;
}
function correct19(num) {
  if (num > 1) {
    for (var i = 2; i <= num / 2; i++) {
      if (num % i == 0) {
        return false;
      }
    }
    return true;
  }
  return false;
}
function wrong19(num) {
  if (num > 0) {
    for (var i = 2; i <= num / 2; i++) {
      if (num % i == 0) {
        return false;
      }
    }
    return true;
  }
  return false;
}

function funcaoJuiz(idQuestao) {
  //console.log(idQuestao);
  if (idQuestao === 1) {
    return test0();
  } else if (idQuestao === 2) {
    return test1();
  } else if (idQuestao === 3) {
    return test2();
  } else if (idQuestao === 4) {
    return test3();
  } else if (idQuestao === 5) {
    return test4();
  } else if (idQuestao === 6) {
    return test5();
  } else if (idQuestao === 7) {
    return test6();
  } else if (idQuestao === 8) {
    return test7();
  } else if (idQuestao === 9) {
    return test8();
  } else if (idQuestao === 10) {
    return test9();
  } else if (idQuestao === 11) {
    return test10();
  } else if (idQuestao === 12) {
    return test11();
  } else if (idQuestao === 13) {
    return test12();
  } else if (idQuestao === 14) {
    return test13();
  } else if (idQuestao === 15) {
    return test14();
  } else if (idQuestao === 16) {
    return test15();
  } else if (idQuestao === 17) {
    return test16();
  } else if (idQuestao === 18) {
    return test17();
  } else if (idQuestao === 19) {
    return test18();
  } else if (idQuestao === 20) {
    return test19();
  }
}

module.exports = {
  funcaoJuiz,
};
