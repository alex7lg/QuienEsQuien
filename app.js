async function cargarJuego() {

    const personajes = await fetch("personajes.json")
        .then(response => response.json());

    let personajeId = localStorage.getItem("personaje");

    if (!personajeId) {

        const aleatorio =
            personajes[Math.floor(Math.random() * personajes.length)];

        personajeId = aleatorio.id;

        localStorage.setItem(
            "personaje",
            personajeId
        );
    }

    const personajeAsignado =
        personajes.find(
            p => String(p.id) === String(personajeId)
        );

    document.getElementById(
        "mi-personaje-img"
    ).src = personajeAsignado.foto;

    document.getElementById(
        "mi-personaje-nombre"
    ).textContent = personajeAsignado.nombre;

    const tablero =
        document.getElementById("tablero");

    const descartados =
        JSON.parse(
            localStorage.getItem("descartados") || "[]"
        );

    personajes.forEach(personaje => {

        const card =
            document.createElement("div");

        card.className = "card";

        if (descartados.includes(personaje.id)) {
            card.classList.add("descartado");
        }

        card.innerHTML = `
            <img
                src="${personaje.foto}"
                alt="${personaje.nombre}"
            >

            <div class="nombre">
                ${personaje.nombre}
            </div>
        `;

        card.addEventListener("click", () => {

            card.classList.toggle("descartado");

            let descartadosActuales =
                JSON.parse(
                    localStorage.getItem("descartados") || "[]"
                );

            if (card.classList.contains("descartado")) {

                if (!descartadosActuales.includes(personaje.id)) {
                    descartadosActuales.push(personaje.id);
                }

            } else {

                descartadosActuales =
                    descartadosActuales.filter(
                        id => id !== personaje.id
                    );
            }

            localStorage.setItem(
                "descartados",
                JSON.stringify(descartadosActuales)
            );
        });

        tablero.appendChild(card);
    });

    document
        .getElementById("nuevo-personaje")
        .addEventListener("click", () => {

            localStorage.removeItem("personaje");
            localStorage.removeItem("descartados");

            location.reload();
        });
}

cargarJuego();