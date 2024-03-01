document.addEventListener('DOMContentLoaded', function() {
  const listaBody = document.getElementById('lista-body');
  const btnGenerar = document.getElementById('btn-generar');
  const btnSorteo = document.getElementById('btn-sorteo'); // Nuevo botón de sorteo

  // Generar la lista
  for (let i = 1; i <= 2000; i++) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td>${i}</td>
      <td><input type="text" class="nombre-input" placeholder="Nombre"></td>
      <td><input type="checkbox" class="pagado-checkbox"></td>
      <td><input type="text" class="telefono-input" placeholder="Teléfono"></td>
      <td><button class="btn-eliminar">Eliminar</button></td>
    `;
    listaBody.appendChild(newRow);
  }

  // Función para guardar datos localmente
  function guardarDatosLocalmente() {
    const inputs = document.querySelectorAll('.nombre-input, .telefono-input');
    inputs.forEach((input, index) => {
      localStorage.setItem(`dato_${index}`, input.value);
    });

    // Guardar estado de pagado
    const checkboxes = document.querySelectorAll('.pagado-checkbox');
    checkboxes.forEach((checkbox, index) => {
      localStorage.setItem(`pagado_${index}`, checkbox.checked);
    });
  }

  // Función para cargar datos localmente
  function cargarDatosLocalmente() {
    const inputs = document.querySelectorAll('.nombre-input, .telefono-input');
    inputs.forEach((input, index) => {
      const savedValue = localStorage.getItem(`dato_${index}`);
      if (savedValue !== null) {
        input.value = savedValue;
      }
    });

    // Cargar estado de pagado
    const checkboxes = document.querySelectorAll('.pagado-checkbox');
    checkboxes.forEach((checkbox, index) => {
      const savedValue = localStorage.getItem(`pagado_${index}`);
      if (savedValue !== null) {
        checkbox.checked = savedValue === 'true';
      }
    });
  }

  // Cargar datos al cargar la página
  cargarDatosLocalmente();

  // Evento clic del botón "Máquina de la Suerte"
  btnGenerar.addEventListener('click', function() {
    const checkboxes = document.querySelectorAll('.pagado-checkbox');
    let boletosDisponibles = 0;
    checkboxes.forEach(checkbox => {
      if (!checkbox.checked) {
        boletosDisponibles++;
      }
    });

    if (boletosDisponibles === 0) {
      alert('¡No quedan más boletos disponibles!');
    } else {
      const cantidadBoletos = parseInt(prompt(`Quedan ${boletosDisponibles} boletos disponibles. Ingrese la cantidad de boletos a generar:`, ''));
      if (cantidadBoletos > 0) {
        const nombre = prompt('Ingrese el nombre para los boletos:', '');
        const telefono = prompt('Ingrese el teléfono para los boletos:', '');
        const numerosAleatorios = [];

        // Lógica de la máquina de la suerte...

        for (let i = 0; i < cantidadBoletos; i++) {
          const numeroAleatorio = Math.floor(Math.random() * boletosDisponibles) + 1;
          const boleto = listaBody.children[numeroAleatorio - 1];
          const nombreInput = boleto.querySelector('.nombre-input');
          const telefonoInput = boleto.querySelector('.telefono-input');
          const checkbox = boleto.querySelector('.pagado-checkbox');

          nombreInput.value = nombre;
          telefonoInput.value = telefono;
          checkbox.checked = true;

          numerosAleatorios.push(numeroAleatorio);
          boletosDisponibles--;
          if (boletosDisponibles === 0) break;
        }

        guardarDatosLocalmente();
        alert(`¡Boletos generados con éxito!\nNúmeros de boletos generados: ${numerosAleatorios.join(', ')}`);
      } else {
        alert('Ingrese una cantidad válida de boletos.');
      }
    }
  });

  // Evento clic del botón "Eliminar"
  listaBody.addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-eliminar')) {
      const row = event.target.closest('tr');
      const inputs = row.querySelectorAll('.nombre-input, .telefono-input');
      const checkboxes = row.querySelectorAll('.pagado-checkbox');

      inputs.forEach(input => input.value = '');
      checkboxes.forEach(checkbox => checkbox.checked = false);

      guardarDatosLocalmente();
    }
  });

  // Evento clic del botón "Sorteo"
  btnSorteo.addEventListener('click', function() {
    const checkboxes = document.querySelectorAll('.pagado-checkbox:checked');
    const boletosPagados = [];

    checkboxes.forEach((checkbox, index) => {
      const row = listaBody.children[index];
      const numero = row.querySelector('td').textContent;
      const nombre = row.querySelector('.nombre-input').value;
      const telefono = row.querySelector('.telefono-input').value;
      boletosPagados.push({ numero, nombre, telefono });
    });

    if (boletosPagados.length === 0) {
      alert('¡No hay boletos pagados para elegir un ganador!');
    } else {
      const ganadorIndex = Math.floor(Math.random() * boletosPagados.length);
      const ganador = boletosPagados[ganadorIndex];
      alert(`¡El ganador es:\nNúmero: ${ganador.numero}\nNombre: ${ganador.nombre}\nTeléfono: ${ganador.telefono}`);
    }
  });

  // Evento antes de cerrar la página para guardar datos localmente
  window.addEventListener('beforeunload', guardarDatosLocalmente);
});
