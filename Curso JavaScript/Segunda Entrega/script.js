class Estudiante {
    constructor(nombre) {
        this.nombre = nombre;
        this.notasParciales = [];
    }

    agregarNota(nota) {
        if (!isNaN(nota) && nota >= 1.0 && nota <= 7.0) {
            this.notasParciales.push(parseFloat(nota));
            return true;
        } else {
            return false;
        }
    }

    obtenerPromedio() {
        const sumaNotas = this.notasParciales.reduce((total, nota) => total + nota, 0);
        return this.notasParciales.length > 0 ? sumaNotas / this.notasParciales.length : 0;
    }
}

class CalcularPromedio {
    constructor() {
        this.estudiantes = [];
    }

    validarNombre(nombre) {
        return /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]+(?:\s[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]+)*$/.test(nombre);
    }

    obtenerEstudiante(nombre) {
        return this.estudiantes.find(estudiante => estudiante.nombre === nombre);
    }

    eliminarEstudiante(nombre) {
        const indiceEstudiante = this.estudiantes.findIndex(estudiante => estudiante.nombre === nombre);

        if (indiceEstudiante !== -1) {
            this.estudiantes.splice(indiceEstudiante, 1);
            console.log(`Estudiante ${nombre} eliminado con éxito.`);
            alert(`Estudiante ${nombre} eliminado con éxito.`);
        } else {
            console.log(`No se encontró un estudiante con el nombre ${nombre}.`);
        }
    }

    mostrarEstudiantes() {
        if (this.estudiantes.length === 0) {
            console.log("No se ha ingresado ningún estudiante.");
        } else {
            console.log("Estudiantes ingresados:\n");
            this.estudiantes.forEach(estudiante => {
                const promedioFinal = this.calcularPromedioFinal(estudiante);
                console.log(`${estudiante.nombre}: Promedio Final ${promedioFinal.toFixed(2)}`);
            });
        }
    }

    filtrarEstudiantes(filtro) {
        const estudiantesFiltrados = this.estudiantes.filter(estudiante =>
            estudiante.nombre.toLowerCase().includes(filtro.toLowerCase())
        );

        return estudiantesFiltrados;
    }

    mostrarEstudiantesFiltrados(estudiantes) {
        if (estudiantes.length === 0) {
            console.log("No existe el estudiante que está buscando.");
        } else {
            console.log("Estudiantes encontrados:\n");
            estudiantes.forEach(estudiante => {
                const promedioFinal = this.calcularPromedioFinal(estudiante);
                console.log(`${estudiante.nombre}: Promedio Final ${promedioFinal.toFixed(2)}`);
            });
        }
    }

    obtenerNombre() {
        do {
            this.nombre = prompt("Este software fue desarrollado para calcular el promedio de notas de tu curso actual. Ingrese su nombre para comenzar:");

            if (this.nombre === null) {
                return false;
            }

            if (!this.validarNombre(this.nombre)) {
                alert("Nombre inválido. Por favor, ingresa un nombre válido sin caracteres especiales.");
            }
        } while (!this.validarNombre(this.nombre));

        return true;
    }

    obtenerNotasParciales(estudiante) {
        let notasIngresadas = 0;

        for (let solicitud = 1; solicitud <= 4; solicitud++) {
            let mensaje = '';
            switch (solicitud) {
                case 1:
                    mensaje = 'Perfecto, ahora ingrese la primera nota de su curso por favor:';
                    break;
                case 2:
                    mensaje = 'Ingrese la segunda nota de su curso por favor:';
                    break;
                case 3:
                    mensaje = 'Ingrese la tercera nota de su curso por favor:';
                    break;
                case 4:
                    mensaje = 'Ingrese la cuarta nota de su curso por favor:';
                    break;
            }

            let nota = prompt(mensaje);

            while (true) {
                if (nota === null) {
                    if (confirm("¿Estás seguro que deseas cancelar el ingreso de notas? Esto borrará las notas ingresadas previamente")) {
                        return false;
                    } else {
                        nota = prompt(`Continuemos. ${mensaje}`);
                    }
                }

                if (estudiante.agregarNota(parseFloat(nota))) {
                    notasIngresadas++;
                    break;
                } else {
                    nota = prompt(`La nota ingresada no es válida. Ingrese nuevamente por favor (Debe ser entre 1 a 7):`);
                }
            }
        }

        return notasIngresadas === 4;
    }

    calcularPromedioFinal(estudiante) {
        const promedioFinal = estudiante.obtenerPromedio();
        return promedioFinal;
    }

    mostrarResultado(estudiante) {
        const promedioFinal = this.calcularPromedioFinal(estudiante);
        alert(`Hola ${estudiante.nombre}, tu promedio final luego de haber terminado el curso es un ${promedioFinal}.`);

        if (promedioFinal >= 4) {
            alert(`¡Felicitaciones ${estudiante.nombre}! Has aprobado el curso.`);
        } else {
            alert(`${estudiante.nombre}, reprobaste, debes realizar el curso nuevamente. Te recomiendo usar Coderhouse para estudiar.`);
        }
    }

    mostrarMensaje(mensaje) {
        return confirm(mensaje);
    }

    confirmarSalida() {
        return this.mostrarMensaje("¿Deseas salir del programa?");
    }

    ejecutar() {
        if (!this.obtenerNombre()) {
            return;
        }

        let estudiante = this.obtenerEstudiante(this.nombre);

        if (!estudiante) {
            estudiante = new Estudiante(this.nombre);
            this.estudiantes.push(estudiante);
        }

        if (!this.obtenerNotasParciales(estudiante)) {
            return;
        }

        this.mostrarResultado(estudiante);
    }

    ejecutarOpcion(opcion) {
        switch (opcion) {
            case "1":
                this.ejecutar();
                break;
            case "2":
                this.mostrarEstudiantes();
                break;
            case "3":
                const filtro = prompt("Ingresa el nombre del estudiante que desesas buscar:");
                const estudiantesFiltrados = this.filtrarEstudiantes(filtro);
                this.mostrarEstudiantesFiltrados(estudiantesFiltrados);
                break;
            case "4":
                const estudianteAEliminar = prompt("Ingresa el nombre del estudiante que deseas eliminar:");
                this.eliminarEstudiante(estudianteAEliminar);
                break;
            case "5":
                if (this.confirmarSalida()) {
                    alert("Muchas gracias por utilizar nuestro software. Hasta pronto.");
                    return true;
                }
                break;
            default:
                alert("Opción no válida. Inténtalo de nuevo.");
        }
        return false;
    }
}

function construirCalcularPromedio() {
    const simuladorPromedio = new CalcularPromedio();

    while (true) {
        const opcion = prompt("Bienvenido, elija una opción para continuar:\n1. Ingresar estudiante y promedio\n2. Mostrar estudiantes\n3. Filtrar estudiantes\n4. Eliminar estudiante\n5. Salir");

        if (simuladorPromedio.ejecutarOpcion(opcion)) {
            break;
        }
    }
}

construirCalcularPromedio();
