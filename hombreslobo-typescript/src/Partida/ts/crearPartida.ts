export const initModalCrearPartida = (): void => {
  const crearBtn = document.getElementById("crear-partidabtn") as HTMLButtonElement | null;
  const modalCrear = document.getElementById("modalCrear") as HTMLDivElement | null;
  const modalUnirse = document.getElementById("modalUnirse") as HTMLDivElement | null;
  const modal = document.getElementById("modalJuego");

  if (!crearBtn || !modalCrear) return;

  
  crearBtn.addEventListener("click", () => {
    modalUnirse && (modalUnirse.style.display = "none");
    modalCrear.innerHTML = "";
    modalCrear.style.display = "block";

    const bloque = document.createElement("div");
    bloque.classList.add("unirse-modal");

    bloque.innerHTML = `
      <h3>Crea tu partida</h3>

      <div class="partida-contenedor">
          <label for="nombrePartida">Nombre de la partida:</label>
          <input id="nombrePartida" type="text" placeholder="Introduce un nombre">
      </div>

      <div class="partida-contenedor">
          <label for="numJugadores">Número de jugadores:</label>
          <input type="number" id="numJugadores" min="1">
      </div>

      <button id="crearPartidaBtn" class="btn-crear">Crear partida</button>
    `;

    modalCrear.appendChild(bloque);


    const crearPartidaBtn = document.getElementById("crearPartidaBtn");
    crearPartidaBtn?.addEventListener("click", async () => {
      const nombreInput = document.getElementById("nombrePartida") as HTMLInputElement;
      const numJugadoresInput = document.getElementById("numJugadores") as HTMLInputElement;

     
      if (!nombreInput.value || !numJugadoresInput.value || parseInt(numJugadoresInput.value) <= 0) {
        alert("Rellena todos los campos correctamente.");
        return;
      }

      const datosPartida = {
        nombre: nombreInput.value,
        num_jugadores: parseInt(numJugadoresInput.value),
      };

      const token = sessionStorage.getItem("auth_token");

      try {
        const response = await fetch("http://127.0.0.1:8000/api/crearPartida", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(datosPartida),
        });

        if (!response.ok) {
          const errorDatos = await response.json();
          alert("Error al registrar la partida: " + JSON.stringify(errorDatos));
          return;
        }

        const data = await response.json();
        alert("Partida creada correctamente");


        nombreInput.value = "";
        numJugadoresInput.value = "";
        modalCrear.style.display = "none";
      } catch (error) {
        console.error("Error en la solicitud: ", error);
      }
    });
  });


  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      modalCrear && (modalCrear.style.display = "none");
    }
  });
};

