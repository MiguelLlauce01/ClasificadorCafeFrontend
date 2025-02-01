document.addEventListener("DOMContentLoaded", function () {
    // Referencias a los elementos del DOM
    const inputImagen = document.getElementById("inputImagen");
    const preview = document.getElementById("preview");
    const btnClasificar = document.getElementById("btnClasificar");
    const errorMensaje = document.getElementById("errorMensaje"); // Mensaje de error
    const resultadoEtiqueta = document.getElementById("resultadoEtiqueta"); // Etiqueta de resultado
    const resultadoTexto = document.getElementById("resultadoTexto"); // Texto del resultado

    // Formatos permitidos para la imagen
    const formatosPermitidos = ["image/jpeg", "image/png", "image/webp"];
    const imagenError = "assets/algo salio mal.png"; // Ruta de la imagen de error

    // Evento al seleccionar una imagen
    inputImagen.addEventListener("change", function (event) {
        const file = event.target.files[0];

        if (file) {
            // Validar el tipo de archivo
            if (!formatosPermitidos.includes(file.type)) {
                errorMensaje.textContent = "Error: Formato de imagen incompatible. Solo se permiten imágenes con extensión .jpg, .jpeg, .png y .webp.";
                errorMensaje.style.display = "block"; // Mostrar mensaje de error
                preview.innerHTML = `<img src="${imagenError}" style="width: 100%; height: 100%; object-fit: contain;">`; // Mostrar imagen de error
                btnClasificar.disabled = true; // Deshabilitar botón de clasificación
                return;
            }

            // Si el formato es válido, ocultar mensaje de error
            errorMensaje.style.display = "none";

            // Cargar la imagen en la vista previa
            const reader = new FileReader();
            reader.onload = function (e) {
                preview.innerHTML = `<img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: contain;">`;
            };
            reader.readAsDataURL(file);

            // Habilitar el botón de clasificar
            btnClasificar.disabled = false;
        }
    });

    // Evento al hacer clic en el botón "Clasificar"
    btnClasificar.addEventListener("click", function () {
        const file = inputImagen.files[0];

        if (!file) {
            return; // No hacer nada si no hay imagen cargada
        }

        // Crear un objeto FormData para enviar la imagen al backend
        const formData = new FormData();
        formData.append("imagen", file);

        // Realizar la petición al backend
        fetch("http://localhost:5000/clasificar", {
            method: "POST",
            body: formData
        })
        .then(response => response.json()) // Convertir la respuesta a JSON
        .then(data => {
            // Manejar la respuesta del backend
            if (data.resultado === "0") {
                errorMensaje.textContent = "Error: La imagen que intentó subir no es un grano de café, o está dañada o borrosa. Por favor corrobore el estado de la imagen e inténtelo nuevamente.";
                errorMensaje.style.display = "block"; // Mostrar mensaje de error
                preview.innerHTML = `<img src="${imagenError}" style="width: 100%; height: 100%; object-fit: contain;">`; // Mostrar imagen de error
                btnClasificar.disabled = true; // Deshabilitar el botón hasta que se suba una nueva imagen
                resultadoEtiqueta.style.display = "none"; // Ocultar resultado anterior
                resultadoTexto.style.display = "none";
            } else {
                // Mostrar el resultado de la clasificación
                errorMensaje.style.display = "none"; // Ocultar mensaje de error
                resultadoEtiqueta.style.display = "block";
                resultadoTexto.style.display = "block";
                resultadoTexto.textContent = data.resultado; // Mostrar "Normal" o "Con defecto"
            }
        })
        .catch(error => {
            // Manejar errores de conexión
            console.error("Error en la petición:", error);
            errorMensaje.textContent = "Error: No se pudo conectar con el servidor. Por favor, intente nuevamente más tarde.";
            errorMensaje.style.display = "block"; // Mostrar mensaje de error
            console.log("Error en la petición:", error);
        });
    });
});
