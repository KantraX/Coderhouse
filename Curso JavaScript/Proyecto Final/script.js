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
        window.addEventListener('beforeunload', () => this.guardarEstudiantes());
        this.obtenerClimaActual();
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
        if (this.estudiantes.some(e => e.nombre === estudiante.nombre)) {
            alert('Estudiante ya agregado');
            return;
        }

        if (estudiante.notasParciales.length === 0) {
            alert('Debe agregar al menos una nota para el estudiante.');
            return;
        }

        this.estudiantes.push(estudiante);
        this.guardarEstudiantes();
        this.mostrarEstudiantes();
        alert(`Estudiante ${estudiante.nombre} agregado correctamente.`);
        this.renderizarGrafico();
    }

    mostrarEstudiantes = (estudiantes = this.estudiantes) => {
        const listaEstudiantes = document.getElementById('listaEstudiantes');
        listaEstudiantes.innerHTML = '';

        if (estudiantes.length === 0) {
            listaEstudiantes.textContent = "No se ha ingresado ningún estudiante.";
        } else {
            estudiantes.forEach(estudiante => {
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
                this.renderizarGrafico();
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
            this.renderizarGrafico();
        }
    }

    limpiarLocalStorage = () => {
        localStorage.clear();
    }

    renderizarGrafico = (estudiantes = this.estudiantes) => {
        const ctx = document.getElementById('graficoEstudiantes').getContext('2d');

        const nombresEstudiantes = estudiantes.map(estudiante => estudiante.nombre);
        const promedios = estudiantes.map(estudiante => estudiante.obtenerPromedio());
        const colores = promedios.map(promedio => promedio >= 4 ? 'rgba(54, 162, 235, 0.2)' : 'rgba(255, 99, 132, 0.2)');

        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: nombresEstudiantes,
                datasets: [{
                    label: 'Promedio Final',
                    data: promedios,
                    backgroundColor: colores,
                    borderColor: colores.map(color => color.replace('0.2', '1')),
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const index = context.dataIndex;
                                const promedio = context.dataset.data[index];
                                return `Promedio: ${promedio} - ${promedio >= 4 ? 'Aprobado' : 'Reprobado'}`;
                            }
                        }
                    }
                }
            }
        });
    }

    async obtenerClimaActual() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async position => {
                const latitud = position.coords.latitude;
                const longitud = position.coords.longitude;
                const apiKey = '4069fc5b299bfe878daa020c8c99e1a0';
                const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitud}&lon=${longitud}&appid=${apiKey}&units=metric`;

                try {
                    const response = await fetch(url);
                    const data = await response.json();
                    console.log('Información del clima actual:', data);
                    const temperaturaActual = data.main.temp;
                    console.log('Temperatura actual:', temperaturaActual);
                    document.getElementById('temperaturaUsuario').textContent = `Temperatura actual en tu ubicación: ${temperaturaActual}°C`;
                } catch (error) {
                    console.error('Error al obtener la información del clima:', error);
                }
            }, error => {
                console.error('Error al obtener la ubicación del usuario:', error);
            });
        } else {
            console.error('Geolocalización no es compatible con este navegador.');
        }
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

document.getElementById('filtrarEstudiantes').addEventListener('click', function() {
    filtrarEstudiantes();
});

document.getElementById('confirmarEliminarEstudiante').addEventListener('click', function() {
    confirmarEliminarEstudiante();
});

document.getElementById('mostrarTodosEstudiantes').addEventListener('click', function() {
    mostrarTodosEstudiantes();
});

document.getElementById('eliminarTodosEstudiantes').addEventListener('click', function() {
    eliminarTodosEstudiantes();
});

const filtrarEstudiantes = () => {
    const filtro = document.getElementById('filtroNombre').value.toLowerCase();
    const estudiantesFiltrados = simuladorPromedio.estudiantes.filter(estudiante =>
        estudiante.nombre.toLowerCase().includes(filtro)
    );
    simuladorPromedio.mostrarEstudiantes(estudiantesFiltrados);
    simuladorPromedio.renderizarGrafico(estudiantesFiltrados);
}

const confirmarEliminarEstudiante = () => {
    const nombre = document.getElementById('eliminarNombre').value;
    simuladorPromedio.eliminarEstudiante(nombre);
}

const mostrarTodosEstudiantes = () => {
    simuladorPromedio.mostrarEstudiantes();
    simuladorPromedio.renderizarGrafico();
}

const eliminarTodosEstudiantes = () => {
    simuladorPromedio.eliminarTodosEstudiantes();
}
