// LIBROS
const titulo = document.getElementById("tit");
const autor = document.getElementById("aut");
const btnAgLibro = document.getElementById("btnAgLibro");
const btnActLibro = document.getElementById("btnActLibro");
let libAux;

listarLibros();

function validarLibro() {
    let val = true;
    if (titulo.value == "") {
        val = false;
        alert("Debe agregar un título.");
    }
    if (autor.value == "") {
        val = false;
        alert("Debe agregar un autor.");
    }
    return val;
}

async function guardarLibro() {
    if (validarLibro()) {
        await axios.post("http://localhost:3000/libros", { titulo: titulo.value, autor: autor.value });
    }
}

async function listarLibros() {
    resp = await axios.get("http://localhost:3000/libros");

    document.getElementById('headTableLib').innerHTML = "";
    document.getElementById('bodyTableLib').innerHTML = "";
    document.getElementById('headTableLib').innerHTML =
        '<th></th>' +
        '<th></th>' +
        '<th>Titulo</th>' +
        '<th>Autor</th>';

    resp.data.forEach(element => {
        document.getElementById('bodyTableLib').insertRow(-1).innerHTML =
            '<td>' + '<button id="btnBorrar" onclick="borrarLibro(' + element.id + ')">X</button>' + '</td>' +


            '<td>' + '<button id="btnModificar" onclick="mostrarLibro(' + element.id + ')">E</button>' + '</td>' +

            
            '<td>' + element.titulo + '</td>' +
            '<td>' + element.autor + '</td>';
    });
}

async function LibroPrestado(id) {
    let band = false;
    try {
        resp = await axios.get("http://localhost:3000/prestamos")
        resp.data.forEach(element => {
            if (element.libroId == id) {
                band = true;
                // alert("El libro es: " + element.libroId);
            }
        })
    } catch (er) {
        alert("Error"+er);
    }

    return band;
}

async function borrarLibro(id) {
    if (!await LibroPrestado(id)) {
        try {
            await axios.delete("http://localhost:3000/libros/" + id);
        } catch (error) {
            alert("Error al borrar id: " + id + "   " + error);
        }
    }
    else {
        alert("No puede borrar un libro que fue prestado.")
    }
}

async function mostrarLibro(id) {
    btnAgLibro.hidden = true;
    btnActLibro.hidden = false;
    libAux = id;
    resp = await axios.get("http://localhost:3000/libros/" + libAux);
    titulo.value = resp.data.titulo;
    autor.value = resp.data.autor;
}

async function actualizarLibro() {
    btnActLibro.hidden = true;
    btnAgLibro.hidden = false;
    await axios.put("http://localhost:3000/libros/" + libAux, { titulo: titulo.value, autor: autor.value });
}

