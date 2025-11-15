export const initModalUnirse = (): void => { 
  const unirseBtn = document.getElementById("unirsebtn") as HTMLButtonElement | null;
  const modalUnirse = document.getElementById("modalUnirse") as HTMLDivElement | null;
  const modalCrear = document.getElementById("modalCrear") as HTMLDivElement | null;
  const modal = document.getElementById('modalJuego');

  if (!unirseBtn || !modalUnirse) return;

  unirseBtn.addEventListener("click", () => {
    modalCrear.style.display = 'none'
    modalUnirse.innerHTML = "";
    modalUnirse.style.display = "block";

    
    const bloque = document.createElement("div");
    bloque.classList.add("unirse-modal");

    bloque.innerHTML = `
      <h3>Partidas disponibles</h3>
      <div class="input-contenedor">
        <input id="inputBuscarPartida" type="text" placeholder="Nombre o código de la partida">
        <button id="buscarPartida"><i class="fas fa-search"></i></button>
      </div>
      <ul id="listaPartidas"></ul>
    `;

    modalUnirse.appendChild(bloque);

    
    const lista = bloque.querySelector("#listaPartidas") as HTMLUListElement;
    const buscarBtn = bloque.querySelector("#buscarPartida") as HTMLButtonElement;
    const input = bloque.querySelector("#inputBuscarPartida") as HTMLInputElement;

    cargarPartidas("");

    buscarBtn.addEventListener("click", () => {
      cargarPartidas(input.value.trim().toLowerCase());
    });

    async function cargarPartidas(filtro: string) {
      try {
        const response = await fetch("http://localhost:8000/api/partidasIniciando");
        const partidas = await response.json();

        lista.innerHTML = "";

        partidas
          .filter((p: any) =>
            p.nombre.toLowerCase().includes(filtro) ||
            p.codigo.toLowerCase().includes(filtro)
          )
          .forEach((p: any) => {
            const item = document.createElement("li");
            item.textContent = `${p.nombre} (${p.codigo})`;
            lista.appendChild(item);
          });

        if (lista.children.length === 0) {
          lista.innerHTML = "<li>No se encontraron partidas</li>";
        }
      } catch (error) {
        console.error("Error al cargar partidas:", error);
        lista.innerHTML = "<li>Error al cargar partidas</li>";
      }
    }
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      if (modalUnirse) modalUnirse.style.display = 'none'; 
    }
  });

};



