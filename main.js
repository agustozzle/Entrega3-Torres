const dineroInicialInput = document.getElementById("dineroInicial");
const calcularGastosButton = document.getElementById("calcularGastosButton");
const resultadoDiv = document.getElementById("resultado");

let gastosDiarios = [];

function restar(a, b) {
  return a - b;
}

function mostrarResultado(dineroInicial, gastosDiarios) {
  const totalGastado = gastosDiarios.reduce((a, b) => a + b, 0);
  const ahorro = restar(dineroInicial, totalGastado);
  const dias = gastosDiarios.length;
  resultadoDiv.textContent = `Su capital final en el día ${dias} es de $${dineroInicial - totalGastado}. Usted pudo ahorrar este mes: $${ahorro}`;

  // Guardar los gastos en localStorage
  localStorage.setItem("informeMes", JSON.stringify({ gastosDiarios }));
}

function calcularGastos() {
  let dineroInicial = parseFloat(dineroInicialInput.value);
  let dias = parseInt(document.getElementById("dias").value);

  if (isNaN(dineroInicial) || isNaN(dias)) {
    alert('Por favor, ingrese valores numéricos válidos.');
    return;
  }

  let saldoFinalDia = dineroInicial;
  gastosDiarios = []; // Limpiar gastosDiarios

  function ingresarGastoDia(i) {
    if (i > dias) {
      let totalGastado = gastosDiarios.reduce((a, b) => a + b, 0);
      let ahorro = restar(dineroInicial, totalGastado);

      if (saldoFinalDia < 0) {
        alert(`Su capital es insuficiente, por favor recargue. Tiene que abonar: $${saldoFinalDia}`);
      } else {
        mostrarResultado(dineroInicial, gastosDiarios);
      }
      return;
    }

    const dineroGastado = parseFloat(prompt(`Día ${i}: Ingrese cuánto gastó:`));
    if (isNaN(dineroGastado)) {
      alert('Por favor, ingrese un número válido.');
      return;
    }

    gastosDiarios.push(dineroGastado);
    saldoFinalDia = restar(saldoFinalDia, dineroGastado);

    if (saldoFinalDia < 0) {
      alert(`Su capital es insuficiente, por favor recargue. Tiene que abonar: $${saldoFinalDia}`);
      return;
    }

    ingresarGastoDia(i + 1);
  }

  ingresarGastoDia(1);
}

calcularGastosButton.addEventListener("click", calcularGastos);

dineroInicialInput.addEventListener("change", function () {
  const savedData = localStorage.getItem("informeMes");
  if (savedData) {
    const parsedData = JSON.parse(savedData);
    if (parsedData.gastosDiarios) {
      gastosDiarios = parsedData.gastosDiarios;
    }
  }

  mostrarResultado(parseFloat(dineroInicialInput.value), gastosDiarios);
});


