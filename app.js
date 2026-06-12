let personajes = [];
let personajeActual = null;

async function cargarJuego() {

    personajes = await fetch("personajes.json")
        .then(r => r.json());

    const saved = localStorage.getItem("personaje");

    if (saved) {
        personajeActual = personajes.find(p => String(p.id) === saved);
    }

    if (!personajeActual) {
        personajeActual = getRandomPersonaje();
        savePersonaje(personajeActual);
    }

    renderPersonaje();
    renderTablero();
    bindEvents();
}

function getRandomPersonaje() {
    return personajes[
        Math.floor(Math.random() * personajes.length)
    ];
}

function savePersonaje(p) {
    localStorage.setItem("personaje", p.id);
}

function renderPersonaje() {
    document.getElementById("mi-personaje-img").src =
        personajeActual.foto;

    document.getElementById("mi-personaje-nombre").textContent =
        personajeActual.nombre;
}

function renderTablero() {

    const tablero = document.getElementById("tablero");
    tablero.innerHTML = "";

    const descartados =
        JSON.parse(localStorage.getItem("descartados") || "[]");

    personajes.forEach(p => {

        const card = document.createElement("div");
        card.className = "card";

        if (descartados.includes(p.id)) {
            card.classList.add("descartado");
        }

        card.innerHTML = `
            <img src="${p.foto}" alt="${p.nombre}">
            <div class="nombre">${p.nombre}</div>
        `;

        card.addEventListener("click", () => {
            toggleDescartado(p.id, card);
        });

        tablero.appendChild(card);
    });
}

function toggleDescartado(id, card) {

    let descartados =
        JSON.parse(localStorage.getItem("descartados") || "[]");

    if (descartados.includes(id)) {
        descartados = descartados.filter(x => x !== id);
        card.classList.remove("descartado");
    } else {
        descartados.push(id);
        card.classList.add("descartado");
    }

    localStorage.setItem("descartados", JSON.stringify(descartados));
}

function bindEvents() {

    document.getElementById("nuevo-personaje")
        .addEventListener("click", () => {

            personajeActual = getRandomPersonaje();
            savePersonaje(personajeActual);
            renderPersonaje();
        });
    document.getElementById("reset-tablero")
        .addEventListener("click", () => {

            localStorage.removeItem("descartados");

            renderTablero();
        });
}

cargarJuego();