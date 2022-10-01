class Persona {
  get nombreClase() {
    return this.constructor.name;
  }

  constructor(id, nombre, apellido, edad) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.edad = edad;
  }
}

class Heroe extends Persona {
  constructor(id, nombre, apellido, edad, alterEgo, ciudad, publicado) {
    super(id, nombre, apellido, edad);
    this.alterEgo = alterEgo;
    this.ciudad = ciudad;
    this.publicado = publicado;
  }
}

class Villano extends Persona {
  constructor(id, nombre, apellido, edad, enemigo, robos, asesinatos) {
    super(id, nombre, apellido, edad);
    this.enemigo = enemigo;
    this.robos = robos;
    this.asesinatos = asesinatos;
  }
}

const listaPersonas = [
  new Heroe(1, 'Clark', 'Kent', 45, 'Superman', 'Metropolis', 2002),
  new Heroe(2, 'Bruce', 'Wayne', 35, 'Batman', 'Gotica', 2012),
  new Heroe(3, 'Bart', 'Alen', 30, 'Flash', 'Central', 2017),
  new Villano(4, 'Lex', 'Luthor', 18, 'Superman', 500, 7),
  new Villano(5, 'Harvey', 'Dent', 20, 'Batman', 750, 2),
  new Villano(666, 'Celina', 'Kyle', 23, 'Batman', 25, 1)
];

// form datos
const formDatosContainer = document.querySelector('.form-datos_container');
const tablaHeaders = document.querySelectorAll('.tabla-header')
const filtro = document.getElementById('select-datos');
const calcularEdad = document.getElementById('calcular');
const campoEdad = document.getElementById('edad-promedio');
const columnasCbox = document.querySelectorAll('.cbox');
const tablaPersonas = document.getElementById('tabla-personas');
const botonAgregar = document.getElementById('agregar');
// form abm
const formABMContainer = document.querySelector('.form-abm_container');
const id = document.getElementById('id');
const nombre = document.getElementById('nombre');
const apellido = document.getElementById('apellido');
const edad = document.getElementById('edad');
const alterEgo = document.getElementById('alterEgo');
const ciudad = document.getElementById('ciudad');
const publicado = document.getElementById('publicado');
const enemigo = document.getElementById('enemigo');
const robos = document.getElementById('robos');
const asesinatos = document.getElementById('asesinatos');
const selectABM = document.getElementById('select-abm');
const botonAlta = document.getElementById('alta');
const botonModificar = document.getElementById('modificar');
const botonEliminar = document.getElementById('eliminar');
const botonCancelar = document.getElementById('cancelar');
const mensajeError = document.querySelector('.mensaje-error');

function limpiarTabla() {
  const largoTabla = tablaPersonas.rows.length;
  for (let i = largoTabla - 1; i > 0; i--) {
    tablaPersonas.deleteRow(i);
  }

  campoEdad.value = '';
}

function refrescarTabla(filtro) {
  let criterio = 'Persona';

  if (filtro == 'Heroes') criterio = 'Heroe';
  if (filtro == 'Villanos') criterio = 'Villano';

  limpiarTabla();

  let listaFiltrada = [];

  if (criterio == 'Persona') {
    listaFiltrada = [...listaPersonas];
  } else {
    listaFiltrada = listaPersonas.filter(persona => persona.nombreClase == criterio);
  }

  if (listaFiltrada.length == 0) {
    const nuevaFila = tablaPersonas.insertRow();

    for (let i = 0; i < tablaPersonas.rows[0].cells.length; i++) {
      const nuevaCelda = nuevaFila.insertCell(i);
      nuevaCelda.appendChild(document.createTextNode('--'));
    }
  } else {
    const columnas = Array.from(columnasCbox);
    let propiedades = [];

    listaFiltrada.forEach(persona => {
      propiedades.push(persona);

      const nuevaFila = tablaPersonas.insertRow();
      nuevaFila.addEventListener('dblclick', () => {
        botonAlta.style.display = 'none';
        selectABM.setAttribute('disabled', '');
        cargarFormularioABM(nuevaFila);
      });
      nuevaFila.addEventListener('click', () => seleccionarFila(nuevaFila));

      for (let i = 0; i < columnas.length; i++) {
        nuevaFila.insertCell(i);
      }
    });

    let j = 0;
    for (let i = 1; i < tablaPersonas.rows.length; i++ && j++) {
      const filas = Array.from(tablaPersonas.rows[i].cells);

      filas[0].innerHTML = propiedades[j].id;
      filas[1].innerHTML = propiedades[j].nombre;
      filas[2].innerHTML = propiedades[j].apellido;
      filas[3].innerHTML = propiedades[j].edad;

      if (propiedades[j].nombreClase == 'Heroe') {
        filas[4].innerHTML = propiedades[j].alterEgo;
        filas[5].innerHTML = propiedades[j].ciudad;
        filas[6].innerHTML = propiedades[j].publicado;
        filas[7].innerHTML = '--';
        filas[8].innerHTML = '--';
        filas[9].innerHTML = '--';
      } else {
        filas[4].innerHTML = '--';
        filas[5].innerHTML = '--';
        filas[6].innerHTML = '--';
        filas[7].innerHTML = propiedades[j].enemigo;
        filas[8].innerHTML = propiedades[j].robos;
        filas[9].innerHTML = propiedades[j].asesinatos;
      }
    }
  }
}

function calcularEdadPromedio() {
  const listaEdades = [];

  Array.from(tablaPersonas.rows).forEach(row => {
    listaEdades.push(parseInt(row.cells[3].innerHTML));
  });

  listaEdades.shift();

  const sumaEdades = listaEdades.reduce((a, b) => a + b, 0);
  const promedioEdades = sumaEdades / listaEdades.length;

  campoEdad.value = promedioEdades.toFixed(2);
}

function toggleColumnas(cbox) {
  const campoAModificar = {
    'columna-id': 0,
    'columna-nombre': 1,
    'columna-apellido': 2,
    'columna-edad': 3,
    'columna-alterEgo': 4,
    'columna-ciudad': 5,
    'columna-publicado': 6,
    'columna-enemigo': 7,
    'columna-robos': 8,
    'columna-asesinatos': 9,
  };

  Array.from(tablaPersonas.rows).forEach(row => {
    if (cbox.checked) {
      row.cells[campoAModificar[cbox.id]].style.display = 'table-cell';
    } else {
      row.cells[campoAModificar[cbox.id]].style.display = 'none';
    }
  });
}

function seleccionarFila(fila) {
  fila.id = 'clicked';
  fila.style.backgroundColor = '#f17f3d';

  const filas = Array.from(tablaPersonas.rows);
  filas.shift();

  filas.forEach(item => {
    if (item != fila) {
      item.id = '';
      item.style.backgroundColor = '#383838';
    }
  });
}

function cargarFormularioABM(fila = undefined) {
  formDatosContainer.style.display = 'none';
  formABMContainer.style.display = 'block';

  if (fila != undefined) {
    const { childNodes } = fila;

    id.value = childNodes[0].innerHTML;
    nombre.value = childNodes[1].innerHTML;
    apellido.value = childNodes[2].innerHTML;
    edad.value = childNodes[3].innerHTML;

    if (childNodes[4].innerHTML != '--') {
      selectABM.value = 'Heroe';
      alterEgo.value = childNodes[4].innerHTML;
      ciudad.value = childNodes[5].innerHTML;
      publicado.value = childNodes[6].innerHTML;
      enemigo.value = '';
      robos.value = '';
      asesinatos.value = '';
    } else {
      selectABM.value = 'Villano';
      alterEgo.value = '';
      ciudad.value = '';
      publicado.value = '';
      enemigo.value = childNodes[7].innerHTML;
      robos.value = childNodes[8].innerHTML;
      asesinatos.value = childNodes[9].innerHTML;
    }
  }
}

function validarCampos(persona) {
  const {
    nombre,
    apellido,
    edad,
    alterEgo = undefined,
    ciudad = undefined,
    publicado = undefined,
    enemigo = undefined,
    robos = undefined,
    asesinatos = undefined
  } = persona;

  if (nombre != '' && isNaN(nombre)
    && apellido != '' && isNaN(apellido)
    && edad != '' && !isNaN(edad) && edad > 0
  ) {
    if (alterEgo == undefined) {
      if (enemigo != '' && isNaN(enemigo)
        && robos != '' && !isNaN(robos) && robos > 0
        && asesinatos != '' && !isNaN(asesinatos) && asesinatos > 0
      ) {
        return true;
      }
    } else {
      if (alterEgo != '' && isNaN(alterEgo)
        && ciudad != '' && isNaN(ciudad)
        && publicado != '' && !isNaN(publicado) && publicado > 1940
      ) {
        return true;
      }
    }
  }
  return false;
}

filtro.addEventListener('change', () => refrescarTabla(filtro.value));

calcularEdad.addEventListener('click', calcularEdadPromedio);

columnasCbox.forEach(nodoCbox => {
  nodoCbox.addEventListener('change', () => toggleColumnas(nodoCbox));
});

botonAgregar.addEventListener('click', () => {
  const filas = Array.from(tablaPersonas.rows);
  const filaConID = filas.find(fila => fila.id === 'clicked');

  if (filaConID != undefined) {
    cargarFormularioABM(filaConID);
  }
});

botonAlta.addEventListener('click', () => {
  const listaIDs = listaPersonas.map(persona => persona.id);
  const nuevoID = listaIDs.reduce((a, b) => a + b);

  if (selectABM.value == 'Villano') {
    const persona = {
      nombre: nombre.value,
      apellido: apellido.value,
      edad: parseInt(edad.value),
      enemigo: enemigo.value,
      robos: parseInt(robos.value),
      asesinatos: parseInt(asesinatos.value)
    }

    if (validarCampos(persona)) {
      const villano = new Villano(nuevoID, nombre.value, apellido.value, parseInt(edad.value), enemigo.value, parseInt(robos.value), parseInt(asesinatos.value));
      listaPersonas.push(villano);

      formABMContainer.style.display = 'none';
      formDatosContainer.style.display = 'block';
      mensajeError.innerHTML = '';
      refrescarTabla(filtro.value);
    } else {
      mensajeError.innerHTML = 'Error en los campos.';
    }
  } else {
    const persona = {
      nombre: nombre.value,
      apellido: apellido.value,
      edad: parseInt(edad.value),
      alterEgo: alterEgo.value,
      ciudad: ciudad.value,
      publicado: parseInt(publicado.value)
    }

    if (validarCampos(persona)) {
      const heroe = new Heroe(nuevoID, nombre.value, apellido.value, parseInt(edad.value), alterEgo.value, ciudad.value, parseInt(publicado.value));
      listaPersonas.push(heroe);
      formABMContainer.style.display = 'none';
      formDatosContainer.style.display = 'block';
      mensajeError.innerHTML = '';
      refrescarTabla(filtro.value);
    } else {
      mensajeError.innerHTML = 'Error en los campos.';
    }
  }
});

botonModificar.addEventListener('click', () => {
  const personaAModificar = listaPersonas.find(persona => persona.id == id.value)

  let persona = {};

  if (selectABM.value == 'Villano') {
    persona = {
      nombre: nombre.value,
      apellido: apellido.value,
      edad: parseInt(edad.value),
      enemigo: enemigo.value,
      robos: parseInt(robos.value),
      asesinatos: parseInt(asesinatos.value)
    }
  } else {
    persona = {
      nombre: nombre.value,
      apellido: apellido.value,
      edad: parseInt(edad.value),
      alterEgo: alterEgo.value,
      ciudad: ciudad.value,
      publicado: parseInt(publicado.value)
    }
  }

  if (validarCampos(persona)) {
    personaAModificar.nombre = nombre.value;
    personaAModificar.apellido = apellido.value;
    personaAModificar.edad = edad.value;
    personaAModificar.alterEgo = alterEgo.value == '' ? '--' : alterEgo.value;
    personaAModificar.ciudad = ciudad.value == '' ? '--' : ciudad.value;
    personaAModificar.publicado = publicado.value == '' ? '--' : publicado.value;
    personaAModificar.enemigo = enemigo.value == '' ? '--' : enemigo.value;
    personaAModificar.robos = robos.value == '' ? '--' : robos.value;
    personaAModificar.asesinatos = asesinatos.value == '' ? '--' : asesinatos.value;

    formABMContainer.style.display = 'none';
    formDatosContainer.style.display = 'block';
    mensajeError.innerHTML = '';
    refrescarTabla(filtro.value);
  } else {
    mensajeError.innerHTML = 'Error en los campos.';
  }
});

botonEliminar.addEventListener('click', () => {
  const persona = listaPersonas.find(persona => persona.id == id.value)
  const indice = listaPersonas.indexOf(persona);

  listaPersonas.splice(indice, 1);

  formABMContainer.style.display = 'none';
  formDatosContainer.style.display = 'block';
  refrescarTabla(filtro.value);
});

botonCancelar.addEventListener('click', () => {
  formABMContainer.style.display = 'none';
  formDatosContainer.style.display = 'block';
  botonAlta.style.display = 'inline';
  selectABM.removeAttribute('disabled');
  refrescarTabla(filtro.value);
});

tablaHeaders.forEach(nodoHeader => {
  nodoHeader.addEventListener('click', () => {
    let criterio = nodoHeader.value.charAt(0).toLowerCase() + nodoHeader.value.slice(1);
    if (criterio.length == 2) {
      criterio = 'id';
    }

    listaPersonas.sort((a, b) => {
      if (a[criterio] > b[criterio]) return 1;
      if (b[criterio] > a[criterio]) return -1;
    
      return 0;
    });

    refrescarTabla(filtro.value);
  });
});

refrescarTabla(filtro.value);
