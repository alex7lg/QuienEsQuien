let personajes = [];
let personajeActual = null;

let modos = [];
let modoActual = null;

async function cargarJuego() {

    await cargarModos();

    await cargarPersonajes();

    bindEvents();
}

async function cargarModos() {

    modos = await fetch("json/modos.json")
        .then(r => r.json());

    modoActual =
        localStorage.getItem("modo") ||
        modos[0].archivo;

    renderTabs();
}

async function cargarPersonajes() {

    personajes = await fetch(`json/${modoActual}`)
        .then(r => r.json());

    personajeActual = null;

    const saved =
        localStorage.getItem("personaje");

    if (saved) {

        personajeActual =
            personajes.find(
                p => String(p.id) === saved
            );
    }

    if (!personajeActual) {

        personajeActual =
            getRandomPersonaje();

        savePersonaje(personajeActual);
    }

    renderPersonaje();
    renderTablero();
}

function renderTabs() {

    const container =
        document.getElementById("modos-tabs");

    container.innerHTML = "";

    modos.forEach(modo => {

        const btn =
            document.createElement("button");

        btn.className = "modo-tab";

        if (modo.archivo === modoActual) {
            btn.classList.add("activo");
        }

        btn.textContent = modo.nombre;

        btn.addEventListener("click", async () => {

            if (modo.archivo === modoActual) {
                return;
            }

            modoActual = modo.archivo;

            localStorage.setItem(
                "modo",
                modoActual
            );

            localStorage.removeItem("personaje");
            localStorage.removeItem("descartados");

            await cargarPersonajes();

            renderTabs();
        });

        container.appendChild(btn);
    });
}

function getRandomPersonaje() {

    if (personajes.length === 0) {
        return null;
    }

    let nuevo;

    do {

        nuevo =
            personajes[
                Math.floor(
                    Math.random() * personajes.length
                )
            ];

    } while (
        personajeActual &&
        personajes.length > 1 &&
        nuevo.id === personajeActual.id
    );

    return nuevo;
}

function savePersonaje(personaje) {

    localStorage.setItem(
        "personaje",
        personaje.id
    );
}

function renderPersonaje() {

    document.getElementById(
        "mi-personaje-img"
    ).src = personajeActual.foto;

    document.getElementById(
        "mi-personaje-nombre"
    ).textContent = personajeActual.nombre;
}

function renderTablero() {

    const tablero =
        document.getElementById("tablero");

    tablero.innerHTML = "";

    const descartados =
        JSON.parse(
            localStorage.getItem("descartados") || "[]"
        );

    personajes.forEach(personaje => {

        const card =
            document.createElement("div");

        card.className = "card";

        if (
            descartados.includes(personaje.id)
        ) {
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

            toggleDescartado(
                personaje.id,
                card
            );
        });

        tablero.appendChild(card);
    });
}

function toggleDescartado(id, card) {

    let descartados =
        JSON.parse(
            localStorage.getItem("descartados") || "[]"
        );

    if (descartados.includes(id)) {

        descartados =
            descartados.filter(
                x => x !== id
            );

        card.classList.remove(
            "descartado"
        );

    } else {

        descartados.push(id);

        card.classList.add(
            "descartado"
        );
    }

    localStorage.setItem(
        "descartados",
        JSON.stringify(descartados)
    );
}

function bindEvents() {

    document
        .getElementById("nuevo-personaje")
        .addEventListener("click", () => {

            personajeActual =
                getRandomPersonaje();

            savePersonaje(
                personajeActual
            );

            renderPersonaje();
        });

    document
        .getElementById("reset-tablero")
        .addEventListener("click", () => {

            localStorage.removeItem(
                "descartados"
            );

            renderTablero();
        });
}

cargarJuego();