// PRÉSTAMOS

const fecEnt = document.getElementById("fecEnt");
const fecDev = document.getElementById("fecDev");
const libID = document.getElementById("libID");
const aluID = document.getElementById("aluID");
const btnAgPres = document.getElementById("btnAgPres");
const btnActPres = document.getElementById("btnActPres");
const tblPres = document.getElementById("bodyTablePres");
const muestError = document.getElementById("muestError");

let prestAux;

listarPrestamos();
listasIDs();

async function validarPrestamo() {
    let val = true;
    let libSelect = libID.options[libID.selectedIndex].value;
    let aluSelect = aluID.options[aluID.selectedIndex].value;
    muestError.innerHTML = "";
    muestError.innerHTML += 'LibroSelect: '+libSelect+'    AluSelect: '+aluSelect+'<br>';

    if (fecEnt.value == "") {
        val = false;
        muestError.innerHTML += 'Debe agregar una Fecha de entrega.<br>';
        //alert("Debe agregar una Fecha de entrega.");
    }
    if (libSelect == "") {
        val = false;
        muestError.innerHTML += 'Debe agregar un libro.<br>';
        //alert("Debe agregar un libro.");
    }else{
        if(await LibroNoEsta(libSelect)){
            val = false;
            muestError.innerHTML += 'El libro no fue devuelto aún.<br>';
            // alert("El libro no fue devuelto aún.");
        }
    }
    if (aluSelect == "") {
        val = false;
        muestError.innerHTML += 'Debe agregar un alumno.<br>';
        // alert("Debe agregar un alumno.");
    }else{
        if (await alumnoConDeuda(aluSelect)){
            val = false;
            muestError.innerHTML += 'El alumno tiene deuda y no puede solicitar otro préstamo.<br>';
            // alert("El alumno tiene deuda y no puede solicitar otro préstamo.")
        }
    }
    
    return val;
}

async function guardarPrestamo() {
    if (await validarPrestamo()) {
        await axios.post("http://localhost:3000/prestamos", { fechaEntrega: fecEnt.value, fechaDevolucion: fecDev.value, libroId: libID.value, alumnoId: aluID.value });
    }
}

async function listasIDs() {
    resp = await axios.get("http://localhost:3000/libros");
    libID.innerHTML = "";
    resp.data.forEach(lib => {
        libID.innerHTML += '<option value=' + lib.id + '>' + lib.titulo + '</option>';
    })

    resp = await axios.get("http://localhost:3000/alumnos");
    aluID.innerHTML = "";
    resp.data.forEach(element => {
        aluID.innerHTML += '<option value=' + element.id + '>' + element.dni + '</option>';
    })
}

function limpiarFecDev() {
    fecDev.value = "";
}

async function listarPrestamos() {
    document.getElementById('headTablePres').innerHTML = "";
    tblPres.innerHTML = "";

    document.getElementById('headTablePres').innerHTML =
        '<th></th>' +
        '<th></th>' +
        '<th>Fecha entrega</th>' +
        '<th>Fecha devolución</th>' +
        '<th>Alumno</th>' +
        '<th>Libro</th>';

    // let dniAlu = await dniAlumno(5);
    // let titLib = await tituloLibro(6);

    resp = await axios.get("http://localhost:3000/prestamos");

    // alert("Alumno: " + dniAlu + "; Título: " + titLib);
    
    await resp.data.forEach(prestamo => {
       //let titLib = tituloLibro();
        if(prestamo.fechaDevolucion == ""){
            tblPres.insertRow(-1).innerHTML =
            '<td id="celdaRoja">' + '<button id="btnBorrar" onclick="borrarPrestamo(' + prestamo.id + ')">X</button>' + '</td>' +
            '<td id="celdaRoja">' + '<button id="btnModificar" onclick="mostrarPrestamo(' + prestamo.id + ')">E</button>' + '</td>' +
            '<td id="celdaRoja">' + prestamo.fechaEntrega + '</td>' +
            '<td id="celdaRoja">' + prestamo.fechaDevolucion + '</td>' +
            '<td id="celdaRoja">' + prestamo.alumnoId + '</td>' +
            '<td id="celdaRoja">' + prestamo.libroId + '</td>';
        }else{
            tblPres.insertRow(-1).innerHTML =
            '<td id="celdaAzul">' + '<button id="btnBorrar" onclick="borrarPrestamo(' + prestamo.id + ')">X</button>' + '</td>' +
            '<td id="celdaAzul">' + '<button id="btnModificar" onclick="mostrarPrestamo(' + prestamo.id + ')">E</button>' + '</td>' +
            '<td id="celdaAzul">' + prestamo.fechaEntrega + '</td>' +
            '<td id="celdaAzul">' + prestamo.fechaDevolucion + '</td>' +
            '<td id="celdaAzul">' + prestamo.alumnoId + '</td>' +
            '<td id="celdaAzul">' + prestamo.libroId + '</td>';
        }        
    });

}

async function dniAlumno(id) {
    let dni = "No se encontró DNI."
    resp = await axios.get("http://localhost:3000/alumnos");
    resp.data.forEach(alu => {
        if (alu.id == id) {
            dni = alu.dni;
        }
    })
    return dni;
}

async function tituloLibro(id) {
    let tit = "No se encontró Título";
    resp = await axios.get("http://localhost:3000/libros");
    resp.data.forEach(lib => {
        if (lib.id == id) {
            tit = lib.titulo;
        }
    })
    return tit;
}

async function borrarPrestamo(id) {
    try {
        await axios.delete("http://localhost:3000/prestamos/" + id);
    } catch (error) {
        alert("Error al borrar id: " + id + "   " + error);
    }
}

async function mostrarPrestamo(id) {
    btnAgPres.hidden = true;
    btnActPres.hidden = false;
    prestAux = id;
    resp = await axios.get("http://localhost:3000/prestamos/" + prestAux);
    fecEnt.value = resp.data.fechaEntrega;
    fecDev.value = resp.data.fechaDevolucion;
    libID.value = resp.data.libroId;
    aluID.value = resp.data.alumnoId;
}

async function actualizarPrestamo() {
    btnActPres.hidden = true;
    btnAgPres.hidden = false;
    await axios.put("http://localhost:3000/prestamos/" + prestAux, { fechaEntrega: fecEnt.value, fechaDevolucion: fecDev.value, libroId: libID.value, alumnoId: aluID.value });
}



async function alumnoConDeuda(id) {
    let band = false;
    
    resp = await axios.get("http://localhost:3000/prestamos");
    resp.data.forEach(element => {
        if (element.alumnoId == id  && element.fechaDevolucion == "") {
            band = true;
        }
    })
    return band;
}

async function LibroNoEsta(id) {
    let band = false;
    resp = await axios.get("http://localhost:3000/prestamos")
    resp.data.forEach(element => {
        if (element.libroId == id && element.fechaDevolucion == "") {
            band = true;
        }
    })
    return band;
}


