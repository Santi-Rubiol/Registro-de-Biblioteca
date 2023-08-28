// ALUMNOS
const dni = document.getElementById("dni");
const nombre = document.getElementById("nom");
const direc = document.getElementById("direc");
const btnAgAlumno = document.getElementById("btnAgAlumno");
const btnActAlumno = document.getElementById("btnActAlumno");
let alumAux;

// ALUMNOS

listarAlumnos();

function validarAlumno() {
    let val = true;
    if (dni.value == "") {
        val = false;
        alert("Debe agregar un DNI.");
    }
    if (nombre.value == "") {
        val = false;
        alert("Debe agregar un nombre.");
    }
    if (direc.value == "") {
        val = false;
        alert("Debe agregar una dirección.");
    }
    return val;
}

async function guardarAlumno() {
    if (validarAlumno()) {
        await axios.post("http://localhost:3000/alumnos", { dni: dni.value, nombre: nombre.value, direccion: direc.value });
    }
}

async function listarAlumnos() {
    resp = await axios.get("http://localhost:3000/alumnos");

    document.getElementById('headTableAlu').innerHTML = "";
    document.getElementById('bodyTableAlu').innerHTML = "";
    document.getElementById('headTableAlu').innerHTML =
        '<th></th>' +
        '<th></th>' +
        '<th>DNI</th>' +
        '<th>Nombre</th>' +
        '<th>Dirección</th>';

    resp.data.forEach(element => {
        document.getElementById('bodyTableAlu').insertRow(-1).innerHTML =
            '<td>' + '<button id="btnBorrar" onclick="borrarAlumno(' + element.id + ')">X</button>' + '</td>' +
            '<td>' + '<button id="btnModificar" onclick="mostrarAlumno(' + element.id + ')">E</button>' + '</td>' +
            '<td>' + element.dni + '</td>' +
            '<td>' + element.nombre + '</td>' +
            '<td>' + element.direccion + '</td>';
    });
}

async function alumnoConDeuda(id) {
    let band = false;
    try {
        resp = await axios.get("http://localhost:3000/prestamos");
        resp.data.forEach(element => {
            if (element.alumnoId == id && element.fechaDevolucion == "") {
                band = true;
            }
        })
    } catch (er) {
        alert("Error: " + er);
    }

    return band;
}

async function borrarAlumno(id) {
    if (!await alumnoConDeuda(id)) {
        try {
            
            await axios.delete('http://localhost:3000/alumnos/' + id);
            
        } catch (error) {
            alert("Error al borrar id: " + id + "   " + error);
        }
    } else {
        alert("No puede borrar un alumno deudor.");
    }
}

async function mostrarAlumno(id) {
    btnAgAlumno.hidden = true;
    btnActAlumno.hidden = false;
    alumAux = id;
    resp = await axios.get("http://localhost:3000/alumnos/" + alumAux);
    dni.value = resp.data.dni;
    nombre.value = resp.data.nombre;
    direc.value = resp.data.direccion;
}

async function actualizarAlumno() {
    btnActAlumno.hidden = true;
    btnAgAlumno.hidden = false;
    await axios.put("http://localhost:3000/alumnos/" + alumAux, { dni: dni.value, nombre: nombre.value, direccion: direc.value });
}
