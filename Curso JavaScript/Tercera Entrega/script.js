class Estudiante {
    constructor(nombre) {
        this.nombre = nombre;
        this.notasParciales = [];
    }

    agregarNota = (nota) => {
        if (!isNaN(nota) && nota >= 1.0 && nota <= 7.0) {
            this.notasParciales.push(parseFloat(nota));
            return true;
        } else {
            return false;
        }
    }

    obtenerPromedio = () => {
        const sumaNotas = this.notasParciales.reduce((total, nota) => total + nota, 0);
        return this.notasParciales.length > 0 ? sumaNotas / this.notasParciales.length : 0;
    }
}

class CalcularPromedio {
    constructor() {
        this.estudiantes = [];
        this.recuperarEstudiantes();
        this.mostrarEstudiantes();
        window.addEventListener('beforeunload', () => this.limpiarLocalStorage());
    }

    guardarEstudiantes = () => {
        localStorage.setItem('estudiantes', JSON.stringify(this.estudiantes));
    }

    recuperarEstudiantes = () => {
        const estudiantesGuardados = JSON.parse(localStorage.getItem('estudiantes'));
        if (estudiantesGuardados) {
            this.estudiantes = estudiantesGuardados.map(estudiante => {
                const nuevoEstudiante = new Estudiante(estudiante.nombre);
                nuevoEstudiante.notasParciales = estudiante.notasParciales;
                return nuevoEstudiante;
            });
        }
    }

    agregarEstudiante = (estudiante) => {
        if (estudiante.notasParciales.length === 0) {
            alert('Debe agregar al menos una nota para el estudiante.');
            return;
        }

        this.estudiantes.push(estudiante);
        this.guardarEstudiantes();
        this.mostrarEstudiantes();
        alert(`Estudiante ${estudiante.nombre} agregado correctamente.`);
    }

    mostrarEstudiantes = () => {
        const listaEstudiantes = document.getElementById('listaEstudiantes');
        listaEstudiantes.innerHTML = '';

        if (this.estudiantes.length === 0) {
            listaEstudiantes.textContent = "No se ha ingresado ningún estudiante.";
        } else {
            this.estudiantes.forEach(estudiante => {
                const promedioFinal = estudiante.obtenerPromedio().toFixed(2);
                const estudianteHTML = `<p>${estudiante.nombre}: Promedio Final ${promedioFinal}</p>`;
                listaEstudiantes.insertAdjacentHTML('beforeend', estudianteHTML);
            });
        }
    }

    eliminarEstudiante = (nombre) => {
        const confirmacion = confirm(`¿Está seguro que desea eliminar al estudiante ${nombre}?`);
        if (confirmacion) {
            const indiceEstudiante = this.estudiantes.findIndex(estudiante => estudiante.nombre === nombre);
            if (indiceEstudiante !== -1) {
                this.estudiantes.splice(indiceEstudiante, 1);
                this.guardarEstudiantes();
                this.mostrarEstudiantes();
                alert(`Estudiante ${nombre} eliminado.`);
            } else {
                alert("Estudiante no encontrado");
            }
        }
    }

    eliminarTodosEstudiantes = () => {
        const confirmacion = confirm("¿Está seguro que desea eliminar a todos los estudiantes?");
        if (confirmacion) {
            this.estudiantes = [];
            this.guardarEstudiantes();
            this.mostrarEstudiantes();
            alert("Todos los estudiantes han sido eliminados.");
        }
    }

    limpiarLocalStorage = () => {
        localStorage.clear();
    }
}

const limpiarFormulario = () => {
    const elementos = ['nombre', 'nota1', 'nota2', 'nota3', 'nota4', 'filtroNombre', 'eliminarNombre'];
    elementos.forEach(elemento => document.getElementById(elemento).value = '');
}

const validarNombre = (nombre) => {
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+(?: [a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$/.test(nombre.trim());
};

const simuladorPromedio = new CalcularPromedio();

document.getElementById('estudianteForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    if (!validarNombre(nombre)) {
        alert('El nombre del estudiante no es válido. Por favor, ingrese nuevamente por favor.');
        return;
    }
    const nota1 = parseFloat(document.getElementById('nota1').value);
    const nota2 = parseFloat(document.getElementById('nota2').value);
    const nota3 = parseFloat(document.getElementById('nota3').value);
    const nota4 = parseFloat(document.getElementById('nota4').value);

    const estudiante = new Estudiante(nombre);
    estudiante.agregarNota(nota1);
    estudiante.agregarNota(nota2);
    estudiante.agregarNota(nota3);
    estudiante.agregarNota(nota4);

    simuladorPromedio.agregarEstudiante(estudiante);
    limpiarFormulario();
});

const filtrarEstudiantes = () => {
    const filtro = document.getElementById('filtroNombre').value.toLowerCase();
    const estudiantesFiltrados = simuladorPromedio.estudiantes.filter(estudiante =>
        estudiante.nombre.toLowerCase().includes(filtro)
    );
    mostrarEstudiantesFiltrados(estudiantesFiltrados);
    limpiarFormulario();
}

const mostrarEstudiantesFiltrados = (estudiantes) => {
    const listaEstudiantes = document.getElementById('listaEstudiantes');
    listaEstudiantes.innerHTML = '';

    if (estudiantes.length === 0) {
        listaEstudiantes.textContent = "Estudiante no encontrado";
    } else {
        estudiantes.forEach(estudiante => {
            const promedioFinal = estudiante.obtenerPromedio().toFixed(2);
            const estudianteHTML = `<p>${estudiante.nombre}: Promedio Final ${promedioFinal}</p>`;
            listaEstudiantes.insertAdjacentHTML('beforeend', estudianteHTML);
        });
    }
}

const confirmarEliminarEstudiante = () => {
    const nombre = document.getElementById('eliminarNombre').value;
    simuladorPromedio.eliminarEstudiante(nombre);
    limpiarFormulario();
}

const mostrarTodosEstudiantes = () => {
    mostrarEstudiantesFiltrados(simuladorPromedio.estudiantes);
    limpiarFormulario();
}