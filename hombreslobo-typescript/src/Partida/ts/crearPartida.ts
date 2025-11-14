export const initModalCrearPartida = (): void => { 
  const crearBtn = document.getElementById("crear-partidabtn") as HTMLButtonElement | null;
  const modalCrear = document.getElementById("modalCrear") as HTMLDivElement | null;
  const modalUnirse = document.getElementById("modalUnirse") as HTMLDivElement | null;
  const modal = document.getElementById('modalJuego');

  if (!crearBtn || !modalCrear) return;

  crearBtn.addEventListener("click", () => {
    modalUnirse.style.display = 'none'
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
        <input type="number" id="numJugadores"></input>
    </div>

    <button id="crearPartidaBtn" class="btn-crear">Crear partida</button>
    `;

    modalCrear.appendChild(bloque);

    
  });
    window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      if (modalCrear) modalCrear.style.display = 'none'; 
    }
  });

};
