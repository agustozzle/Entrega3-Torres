document.addEventListener("DOMContentLoaded", function () {
  const dineroInicialInput = document.getElementById("dineroInicial");
  const diasInput = document.getElementById("dias");
  const dividirGastosButton = document.getElementById("dividirGastosButton");
  const calcularGastosButton = document.getElementById("calcularGastosButton");
  const nuevoPresupuestoButton = document.getElementById("nuevoPresupuestoButton");
  const resultadoDiv = document.getElementById("resultado");
  const gastosContainer = document.getElementById("gastosContainer");

  let gastosDiarios = [];
  let dias = 0;
  let dividirGastosRealizado = false;

  function restar(a, b) {
    return a - b;
  }

  function mostrarResultado(dineroInicial, gastosDiarios) {
    const totalGastado = gastosDiarios.reduce((a, b) => a + b, 0);
    const ahorro = restar(dineroInicial, totalGastado);
    const dias = gastosDiarios.length;
    resultadoDiv.innerHTML = `Su capital final en el día ${dias} es de $${dineroInicial - totalGastado}. Usted pudo ahorrar este mes: $${ahorro}`;
  }

  function guardarDatosEnStorage(dineroInicial, gastosDiarios, dias) {
    const datos = {
      dineroInicial: dineroInicial,
      gastosDiarios: gastosDiarios,
      dias: dias,
      dividirGastosRealizado: dividirGastosRealizado,
    };
    localStorage.setItem("datosGastos", JSON.stringify(datos));
  }

  function obtenerDatosDeStorage() {
    const datosGuardados = localStorage.getItem("datosGastos");
    return datosGuardados ? JSON.parse(datosGuardados) : null;
  }

  function crearInputsGastos(dias) {
    gastosContainer.innerHTML = ""; 

    for (let i = 1; i <= dias; i++) {
      const inputDia = document.createElement("input");
      inputDia.type = "text";
      inputDia.placeholder = `Ingrese el gasto del día ${i}`;

   
      if (gastosDiarios.length >= i) {
        inputDia.value = gastosDiarios[i - 1].toString();
      }

      gastosContainer.appendChild(inputDia);
    }

    const calcularGastosButton = document.createElement("button");
    calcularGastosButton.innerText = "Calcular Gastos";
    gastosContainer.appendChild(calcularGastosButton);

    calcularGastosButton.addEventListener("click", function () {
      const inputsGastos = gastosContainer.querySelectorAll("input");
      let totalGastos = 0;

      inputsGastos.forEach((input) => {
        const gastoDia = parseFloat(input.value);
        if (!isNaN(gastoDia) && gastoDia >= 0) {
          totalGastos += gastoDia;
        }
      });

      const dineroInicial = parseFloat(dineroInicialInput.value);
      const ahorro = dineroInicial - totalGastos;

      resultadoDiv.innerHTML = `Gastos totales: $${totalGastos.toFixed(2)}<br>Ahorro: $${ahorro.toFixed(2)}`;

      gastosDiarios = [];
      inputsGastos.forEach((input) => {
        const gastoDia = parseFloat(input.value);
        if (!isNaN(gastoDia) && gastoDia >= 0) {
          gastosDiarios.push(gastoDia);
        }
      });
      guardarDatosEnStorage(dineroInicial, gastosDiarios, dias);

      
      nuevoPresupuestoButton.style.display = "block";

     
      dividirGastosRealizado = true;
    });
  }

  function calcularGastos() {
    const dineroInicial = parseFloat(dineroInicialInput.value);
    dias = parseInt(diasInput.value);

    if (isNaN(dineroInicial) || isNaN(dias) || dias <= 0) {
      alert("Por favor, ingrese valores numéricos válidos para dinero disponible y días.");
      return;
    }

    crearInputsGastos(dias); 
  }

  function nuevoPresupuesto() {
    gastosContainer.innerHTML = ""; 
    resultadoDiv.innerHTML = ""; 
    dineroInicialInput.value = ""; 
    diasInput.value = ""; 
    gastosDiarios = []; 

  
    nuevoPresupuestoButton.style.display = "none";

   
    localStorage.removeItem("datosGastos");
  }

  calcularGastosButton.addEventListener("click", calcularGastos);
  dividirGastosButton.addEventListener("click", calcularGastos);
  nuevoPresupuestoButton.addEventListener("click", nuevoPresupuesto);


  const datosGuardados = obtenerDatosDeStorage();
  if (datosGuardados && datosGuardados.dividirGastosRealizado) {
    dineroInicialInput.value = datosGuardados.dineroInicial;
    diasInput.value = datosGuardados.dias;
    gastosDiarios = datosGuardados.gastosDiarios;
    crearInputsGastos(datosGuardados.dias); // Recrear los inputs de gastos
    mostrarResultado(datosGuardados.dineroInicial, datosGuardados.gastosDiarios); // Mostrar el resultado

 
    nuevoPresupuestoButton.style.display = "block";

    dividirGastosRealizado = true;
  }
});

 

