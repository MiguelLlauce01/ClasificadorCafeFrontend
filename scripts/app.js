document.addEventListener("DOMContentLoaded", function () {
    const inputImagen = document.getElementById("inputImagen");
    const preview = document.getElementById("preview");
    const btnClasificar = document.getElementById("btnClasificar");

    inputImagen.addEventListener("change", function (event) {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                preview.innerHTML = `<img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: contain;">`;
            };
            reader.readAsDataURL(file);

            btnClasificar.disabled = false;
        }
    });
});
