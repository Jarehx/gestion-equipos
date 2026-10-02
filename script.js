// Recuperamos los equipos guardados en el navegador.
// Si no hay equipos guardados, empezamos con un arreglo vacio.
let equipos = JSON.parse(localStorage.getItem("equipos")) || [];

const formulario = document.getElementById("formularioEquipo");
const listaEquipos = document.getElementById("listaEquipos");
const buscador = document.getElementById("buscador");
const indiceEditar = document.getElementById("indiceEditar");
const botonGuardar = document.getElementById("botonGuardar");
const botonCancelar = document.getElementById("botonCancelar");
const mensajeVacio = document.getElementById("mensajeVacio");

const filtroEstado = document.getElementById("filtroEstado");
const botonExportar = document.getElementById("botonExportar");
const archivoImportar = document.getElementById("archivoImportar");

const contadorTotal = document.getElementById("contadorTotal");
const contadorOperativos = document.getElementById("contadorOperativos");
const contadorReparacion = document.getElementById("contadorReparacion");
const contadorDescartados = document.getElementById("contadorDescartados");
const botonModoOscuro = document.getElementById("botonModoOscuro");

const titularInput = document.getElementById("titular");
const ramInput = document.getElementById("ram");
const almacenamientoInput = document.getElementById("almacenamiento");

const errorTitular = document.getElementById("errorTitular");
const errorRam = document.getElementById("errorRam");
const errorAlmacenamiento = document.getElementById("errorAlmacenamiento");

let campoOrden = "";
let ordenAscendente = true;


// Guarda el arreglo en localStorage.
function guardarEnLocalStorage() {
    localStorage.setItem("equipos", JSON.stringify(equipos));
}


// Muestra los equipos en la tabla.
function mostrarEquipos(lista = equipos) {
    listaEquipos.innerHTML = "";

    if (lista.length === 0) {
        mensajeVacio.style.display = "block";
        return;
    }

    mensajeVacio.style.display = "none";

    lista.forEach((equipo) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${equipo.tipo}</td>
            <td>${equipo.titular}</td>
            <td>${equipo.marca}</td>
            <td>${equipo.procesador}</td>
            <td>${equipo.ram} GB</td>
            <td>${equipo.almacenamiento} GB</td>
            <td>${equipo.video}</td>
            <td>${equipo.pantalla}"</td>
            <td>${equipo.estado}</td>
            <td>${equipo.fecha}</td>
            <td>
                <button class="accion-editar" onclick="editarEquipo(${equipo.id})">Editar</button>
                <button class="accion-eliminar" onclick="eliminarEquipo(${equipo.id})">Eliminar</button>
            </td>
        `;

        listaEquipos.appendChild(fila);
    });

    actualizarContadores();
}


// Actualiza la cantidad total y la cantidad de equipos por estado.
function actualizarContadores() {
    contadorTotal.textContent = equipos.length;

    contadorOperativos.textContent = equipos.filter(function(equipo) {
        return equipo.estado === "Operativo";
    }).length;

    contadorReparacion.textContent = equipos.filter(function(equipo) {
        return equipo.estado === "En Reparación";
    }).length;

    contadorDescartados.textContent = equipos.filter(function(equipo) {
        return equipo.estado === "Descartado";
    }).length;
}


// Valida los datos antes de guardar.
function validarFormulario() {
    errorTitular.textContent = "";
    errorRam.textContent = "";
    errorAlmacenamiento.textContent = "";

    let valido = true;

    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(titularInput.value.trim())) {
        errorTitular.textContent = "El titular no puede contener numeros.";
        valido = false;
    }

    if (Number(ramInput.value) <= 0) {
        errorRam.textContent = "La RAM debe ser mayor a 0.";
        valido = false;
    }

    if (Number(almacenamientoInput.value) <= 0) {
        errorAlmacenamiento.textContent = "El almacenamiento debe ser mayor a 0.";
        valido = false;
    }

    return valido;
}


// Guardamos un equipo nuevo o modificamos uno existente.
formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();

    if (!validarFormulario()) {
        return;
    }

    const equipo = {
        tipo: document.getElementById("tipo").value,
        titular: titularInput.value.trim(),
        marca: document.getElementById("marca").value.trim(),
        procesador: document.getElementById("procesador").value.trim(),
        ram: Number(ramInput.value),
        almacenamiento: Number(almacenamientoInput.value),
        video: document.getElementById("video").value.trim(),
        pantalla: Number(document.getElementById("pantalla").value),
        estado: document.getElementById("estado").value
    };

    if (indiceEditar.value === "") {
        // Generamos un ID unico con Date.now().
        equipo.id = Date.now();
        equipo.fecha = new Date().toLocaleString();

        equipos.push(equipo);
    } else {
        const indice = equipos.findIndex(function(item) {
            return item.id === Number(indiceEditar.value);
        });

        // Conservamos el ID y la fecha original cuando editamos.
        equipo.id = equipos[indice].id;
        equipo.fecha = equipos[indice].fecha;

        equipos[indice] = equipo;
    }

    guardarEnLocalStorage();
    mostrarEquipos();

    formulario.reset();
    indiceEditar.value = "";
    botonGuardar.textContent = "Guardar equipo";

    Swal.fire({
        title: "Equipo guardado",
        text: "Los datos se guardaron correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar"
    });
});


// Carga los datos del equipo en el formulario para editarlo.
function editarEquipo(id) {
    const equipo = equipos.find(function(item) {
        return item.id === id;
    });

    if (!equipo) {
        return;
    }

    document.getElementById("tipo").value = equipo.tipo;
    titularInput.value = equipo.titular;
    document.getElementById("marca").value = equipo.marca;
    document.getElementById("procesador").value = equipo.procesador;
    ramInput.value = equipo.ram;
    almacenamientoInput.value = equipo.almacenamiento;
    document.getElementById("video").value = equipo.video;
    document.getElementById("pantalla").value = equipo.pantalla;
    document.getElementById("estado").value = equipo.estado;

    indiceEditar.value = equipo.id;
    botonGuardar.textContent = "Guardar cambios";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// Elimina un equipo usando un cuadro de confirmacion.
function eliminarEquipo(id) {
    const equipo = equipos.find(function(item) {
        return item.id === id;
    });

    if (!equipo) {
        return;
    }

    Swal.fire({
        title: "Eliminar equipo?",
        text: "Estas seguro de que deseas eliminar la computadora de " + equipo.titular + "? Esta accion no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Si, eliminar",
        cancelButtonText: "Cancelar"
    }).then(function(resultado) {
        if (resultado.isConfirmed) {
            equipos = equipos.filter(function(item) {
                return item.id !== id;
            });

            guardarEnLocalStorage();
            mostrarEquipos();

            Swal.fire({
                title: "Equipo eliminado",
                text: "El equipo fue eliminado correctamente.",
                icon: "success",
                confirmButtonText: "Aceptar"
            });
        }
    });
}


// Aplica la busqueda y el filtro de estado.
function aplicarFiltros() {
    const texto = buscador.value.toLowerCase();
    const estadoSeleccionado = filtroEstado.value;

    const equiposFiltrados = equipos.filter(function(equipo) {
        const coincideTexto =
            equipo.titular.toLowerCase().includes(texto) ||
            equipo.marca.toLowerCase().includes(texto);

        const coincideEstado =
            estadoSeleccionado === "" ||
            equipo.estado === estadoSeleccionado;

        return coincideTexto && coincideEstado;
    });

    mostrarEquipos(equiposFiltrados);
}

buscador.addEventListener("input", aplicarFiltros);

filtroEstado.addEventListener("change", aplicarFiltros);


// Cancelar una edicion.
botonCancelar.addEventListener("click", function() {
    formulario.reset();
    indiceEditar.value = "";
    botonGuardar.textContent = "Guardar equipo";

    errorTitular.textContent = "";
    errorRam.textContent = "";
    errorAlmacenamiento.textContent = "";
});


// Ordenamiento dinamico de la tabla.
document.querySelectorAll(".ordenar").forEach(function(boton) {
    boton.addEventListener("click", function() {
        const campo = boton.dataset.campo;

        if (campoOrden === campo) {
            ordenAscendente = !ordenAscendente;
        } else {
            campoOrden = campo;
            ordenAscendente = true;
        }

        equipos.sort(function(a, b) {
            if (typeof a[campo] === "number") {
                return ordenAscendente ? a[campo] - b[campo] : b[campo] - a[campo];
            }

            return ordenAscendente
                ? String(a[campo]).localeCompare(String(b[campo]))
                : String(b[campo]).localeCompare(String(a[campo]));
        });

        guardarEnLocalStorage();
        mostrarEquipos();
    });
});


// Modo oscuro.
function actualizarModoOscuro() {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        botonModoOscuro.textContent = "Modo claro";
        localStorage.setItem("modoOscuro", "true");
    } else {
        botonModoOscuro.textContent = "Modo oscuro";
        localStorage.setItem("modoOscuro", "false");
    }
}

botonModoOscuro.addEventListener("click", actualizarModoOscuro);


// Recuperamos el modo oscuro guardado.
if (localStorage.getItem("modoOscuro") === "true") {
    document.body.classList.add("dark-mode");
    botonModoOscuro.textContent = "Modo claro";
}


// Mostramos los equipos cuando se abre la pagina.
mostrarEquipos();


// Exporta todos los equipos a un archivo JSON.
botonExportar.addEventListener("click", function() {
    if (equipos.length === 0) {
        Swal.fire({
            title: "No hay equipos",
            text: "No hay registros para exportar.",
            icon: "info",
            confirmButtonText: "Aceptar"
        });
        return;
    }

    const datos = JSON.stringify(equipos, null, 4);
    const archivo = new Blob([datos], { type: "application/json" });
    const url = URL.createObjectURL(archivo);

    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = "equipos.json";
    enlace.click();

    URL.revokeObjectURL(url);

    Swal.fire({
        title: "Exportacion realizada",
        text: "Los equipos se guardaron en un archivo JSON.",
        icon: "success",
        confirmButtonText: "Aceptar"
    });
});


// Importa equipos desde un archivo JSON.
archivoImportar.addEventListener("change", function() {
    const archivo = archivoImportar.files[0];

    if (!archivo) {
        return;
    }

    const lector = new FileReader();

    lector.onload = function(evento) {
        try {
            const datos = JSON.parse(evento.target.result);

            if (!Array.isArray(datos)) {
                throw new Error("El archivo no contiene una lista de equipos.");
            }

            const datosValidos = datos.every(function(equipo) {
                return equipo.id &&
                       equipo.titular &&
                       equipo.marca &&
                       equipo.tipo &&
                       equipo.estado;
            });

            if (!datosValidos) {
                throw new Error("El archivo no tiene el formato esperado.");
            }

            equipos = datos;
            guardarEnLocalStorage();
            mostrarEquipos();
            aplicarFiltros();

            Swal.fire({
                title: "Importacion realizada",
                text: "Los equipos fueron cargados correctamente.",
                icon: "success",
                confirmButtonText: "Aceptar"
            });

        } catch (error) {
            Swal.fire({
                title: "Error al importar",
                text: error.message,
                icon: "error",
                confirmButtonText: "Aceptar"
            });
        }

        archivoImportar.value = "";
    };

    lector.readAsText(archivo);
});
