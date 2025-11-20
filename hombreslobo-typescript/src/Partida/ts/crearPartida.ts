import { enviarDatosCrearPartida } from "../../providers/enviarDatosPartida";

export const initModalCrearPartida = (): void => {
  const crearBtn = document.getElementById("crear-partidabtn") as HTMLButtonElement | null;
  const modalCrear = document.getElementById("modalCrear") as HTMLDivElement | null;
  const modalUnirse = document.getElementById("modalUnirse") as HTMLDivElement | null;

  const MIN_JUGADORES = 15;
  const MAX_JUGADORES = 30;
  const MAX_NOMBRE = 20;

  if (!crearBtn || !modalCrear) return;

  const mostrarError = (input: HTMLInputElement, mensaje: string): void => {
    let errorSpan = input.parentElement?.querySelector<HTMLSpanElement>(".error");
    if (!errorSpan) {
      errorSpan = document.createElement("span");
      errorSpan.className = "error";
      input.parentElement?.appendChild(errorSpan);
    }
    errorSpan.textContent = mensaje;
  };

  const limpiarError = (input: HTMLInputElement): void => {
    const errorSpan = input.parentElement?.querySelector<HTMLSpanElement>(".error");
    if (errorSpan) errorSpan.textContent = "";
  };

  crearBtn.addEventListener("click", () => {
    if (modalUnirse) modalUnirse.style.display = "none";
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
      <p id="mensajeExito" class="exito"></p>
    `;

    modalCrear.appendChild(bloque);

    const crearPartidaBtn = document.getElementById("crearPartidaBtn");
    const mensajeExito = document.getElementById("mensajeExito") as HTMLParagraphElement;

    crearPartidaBtn?.addEventListener("click", async () => {
      const nombreInput = document.getElementById("nombrePartida") as HTMLInputElement;
      const numJugadoresInput = document.getElementById("numJugadores") as HTMLInputElement;

      mensajeExito.textContent = "";
      let hayError = false;

      if (!nombreInput.value.trim()) {
        mostrarError(nombreInput, "Debes introducir un nombre.");
        hayError = true;
      } else limpiarError(nombreInput);

      const num = parseInt(numJugadoresInput.value);
      if (!num || num <= 0) {
        mostrarError(numJugadoresInput, "Introduce un número válido.");
        hayError = true;
      } else if (num < MIN_JUGADORES) {
        mostrarError(numJugadoresInput, `El número mínimo de jugadores es ${MIN_JUGADORES}.`);
        hayError = true;
      } else if (num > MAX_JUGADORES) {
        mostrarError(numJugadoresInput, `El número máximo permitido es ${MAX_JUGADORES}.`);
        hayError = true;
      } else limpiarError(numJugadoresInput);

      if (nombreInput.value.length > MAX_NOMBRE) {
        mostrarError(nombreInput, `El nombre no puede exceder los ${MAX_NOMBRE} caracteres.`);
        hayError = true;
      }

      if (hayError) return;

      const datosPartida = {
        nombre: nombreInput.value,
        num_jugadores: num,
      };

      const token = sessionStorage.getItem("auth_token") ?? "";


      const resultado = await enviarDatosCrearPartida(token, datosPartida);

      if (!resultado.ok) {
        mostrarError(numJugadoresInput, resultado.mensaje);
        return;
      }

      mensajeExito.textContent = resultado.mensaje;

      if (resultado.partida?.id != null) {
        localStorage.setItem("partida_id", resultado.partida.id.toString());
      }

      window.location.href = "src/Lobby/html/lobby.html";
    });
  });
};
