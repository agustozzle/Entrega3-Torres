let diasInput = document.getElementById("dias");
  const dineroInicialInput = document.getElementById("dineroInicial");
  let resultadoDiv = document.getElementById("resultado");
  let opcionesDiv = document.getElementById("opciones");

  function restar(a, b) {
    return a - b;
  }

  function calcularGastos() {
    let dias;
    let dineroInicial;
    let saldoFinalDia;
    let gastosDiarios = [];

    dineroInicial = parseFloat(dineroInicialInput.value);
    dias = parseInt(diasInput.value);

    if (isNaN(dineroInicial) || isNaN(dias)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, ingrese valores numéricos válidos.'
      });
      return;
    }

    saldoFinalDia = dineroInicial;

    function ingresarGastoDia(i) {
      if (i >= dias) {
        // Si ya se ingresaron todos los gastos, calculamos y mostramos el ahorro
        let totalGastado = gastosDiarios.reduce((a, b) => a + b, 0);
        let ahorro = restar(dineroInicial, totalGastado);

        if (saldoFinalDia < 0) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Su capital es insuficiente, por favor recargue. Tiene que abonar: $${saldoFinalDia}`
          });
        } else {
          Swal.fire({
            icon: 'info',
            title: 'Información',
            html: `Su capital final en el día ${i} es de $${saldoFinalDia}. Usted pudo ahorrar este mes: $${ahorro}`,
            showConfirmButton: false,
            timer: 10000
          });
        }
        return;
      }

      Swal.fire({
        icon: 'question',
        title: `Día ${i + 1}`,
        html: `
          <label for="dineroGastado">Ingrese cuánto gastó en el día ${i + 1}:</label>
          <input type="text" id="dineroGastado" class="swal2-input" />
        `,
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
          const dineroGastado = document.getElementById('dineroGastado').value;
          if (isNaN(dineroGastado)) {
            Swal.showValidationMessage('Por favor, ingrese un número válido.');
          }
          return parseFloat(dineroGastado);
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const dineroGastado = result.value;
          gastosDiarios.push(dineroGastado);
          saldoFinalDia = restar(saldoFinalDia, dineroGastado);


if (saldoFinalDia < 0) {
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: `Su capital es insuficiente, por favor recargue. Tiene que abonar: $${saldoFinalDia}`
  });
  return; // Detener la recursión si el saldo es negativo
}


          
          ingresarGastoDia(i + 1);
        }
      });
    }

    ingresarGastoDia(0);
  }

  function mostrarOpciones() {
    let opcionesHTML = `
      <label for="menuOpciones">Seleccione una opción:</label>
      <select id="menuOpciones">
        <option value="buscar">Buscar un valor específico</option>
        <option value="filtrar">Buscar valores mayores filtrados</option>
      </select>
      <button onclick="ejecutarOpcion()">Ejecutar Opción</button>
    `;

    opcionesDiv.innerHTML = opcionesHTML;
  }

  function ejecutarOpcion() {
    let opcionSeleccionada = document.getElementById("menuOpciones").value;
    let resultadoOpcionDiv = document.createElement("div");

    switch (opcionSeleccionada) {
      case "buscar":
        let gastoBuscado = parseFloat(prompt("Ingrese el valor de un gasto a buscar:"));

        while (isNaN(gastoBuscado)) {
          gastoBuscado = parseFloat(prompt("Por favor, ingrese un número válido para el valor de gasto a buscar:"));
        }

        let gastosDiarios = JSON.parse(localStorage.getItem("informeMes")).gastosDiarios;
        let resultados = [];

        for (let i = 0; i < gastosDiarios.length; i++) {
          if (gastosDiarios[i] === gastoBuscado) {
            resultados.push(`Día ${i + 1}: $${gastosDiarios[i]}`);
          }
        }

        if (resultados.length > 0) {
          resultadoOpcionDiv.innerHTML = `Los gastos de valor ${gastoBuscado} fueron encontrados en los siguientes días:<br>${resultados.join("<br>")}`;
        } else {
          resultadoOpcionDiv.innerHTML = `No se encontraron gastos de valor ${gastoBuscado}.`;
        }
        break;

      case "filtrar":
        let valorFiltro = parseFloat(prompt("Ingrese un valor para filtrar los gastos mayores a él:"));

        while (isNaN(valorFiltro)) {
          valorFiltro = parseFloat(prompt("Por favor, ingrese un número válido para el valor de filtro:"));
        }

        let gastosDiariosFiltrados = JSON.parse(localStorage.getItem("informeMes")).gastosDiarios.filter(gasto => gasto > valorFiltro);
        let resultadosFiltrados = [];

        for (let i = 0; i < gastosDiariosFiltrados.length; i++) {
          resultadosFiltrados.push(`Día ${i + 1}: $${gastosDiariosFiltrados[i]}`);
        }

        if (resultadosFiltrados.length > 0) {
          resultadoOpcionDiv.innerHTML = `Los gastos mayores a ${valorFiltro} son:<br>${resultadosFiltrados.join("<br>")}`;
        } else {
          resultadoOpcionDiv.innerHTML = `No se encontraron gastos mayores a ${valorFiltro}.`;
        }
        break;

      default:
        resultadoOpcionDiv.innerHTML = "Opción inválida";
        break;
    }

    opcionesDiv.appendChild(resultadoOpcionDiv);
  }

  // const cardContent = document.getElementById("cardContent");

  // function showNextRequirement(content) {
  //   cardContent.innerHTML += content;
  // }

  dineroInicialInput.addEventListener("change", function () {
    // Mostramos los siguientes requisitos solo cuando el usuario ingrese el dinero inicial
    showNextRequirement('<br><label for="dias">Ingrese la cantidad de días para calcular su gasto (ingrese \'0\' para seleccionar por mes):</label>');
    showNextRequirement('<br><input type="text" id="dias">');
    showNextRequirement('<br><button onclick="calcularGastos()">Calcular Gastos</button>');
    showNextRequirement('<br><div id="resultado"></div>');
    showNextRequirement('<br><div id="menuOpciones"><button onclick="mostrarOpciones()">Mostrar Menú con Opciones</button><div id="opciones"></div></div>');

    // Quitamos el evento de escucha después de mostrar los requisitos para evitar repetición
    this.removeEventListener("change", arguments.callee);
  });

