import { obtenerPartidas } from "../../providers/obtenerPartidas";

export const initModalUnirse = (): void => {
  const unirseBtn = document.getElementById("unirsebtn") as HTMLButtonElement | null;
  const modalUnirse = document.getElementById("modalUnirse") as HTMLDivElement | null;
  const modalCrear = document.getElementById("modalCrear") as HTMLDivElement | null;

  if (!unirseBtn || !modalUnirse) return;

  unirseBtn.addEventListener("click", () => {
    if (modalCrear) modalCrear.style.display = "none";
    modalUnirse.innerHTML = "";
    modalUnirse.style.display = "block";

    const bloque = document.createElement("div");
    bloque.classList.add("unirse-modal");

    bloque.innerHTML = `
      <h3>Partidas disponibles</h3>
      <div class="input-contenedor">
        <input id="inputBuscarPartida" type="text" placeholder="Nombre o código de la partida">
        <i class="fas fa-search"></i>
      </div>
      <ul id="listaPartidas"></ul>
    `;

    modalUnirse.appendChild(bloque);

    const lista = bloque.querySelector("#listaPartidas") as HTMLUListElement;
    const input = bloque.querySelector("#inputBuscarPartida") as HTMLInputElement;

    cargarPartidas("");

    input.addEventListener("input", () => {
      cargarPartidas(input.value.trim().toLowerCase());
    });

    async function cargarPartidas(filtro: string) {
      try {
        const partidas = await obtenerPartidas();

        lista.innerHTML = "";

        if (!partidas) {
          lista.innerHTML = "<li>Error al cargar partidas</li>";
          return;
        }

        partidas
          .filter(
            (p: any) =>
              p.nombre.toLowerCase().includes(filtro) ||
              p.codigo.toLowerCase().includes(filtro)
          )
          .forEach((p: any) => {
            const item = document.createElement("li");
            item.textContent = `${p.nombre} (${p.codigo})`;

            const btnUnirse = document.createElement("button");
            btnUnirse.classList.add("btn-unirse");
            btnUnirse.textContent = "Unirse";

            btnUnirse.addEventListener("click", () => {
              localStorage.setItem("partida_id", p.id.toString());
              window.location.href = "src/Lobby/html/lobby.html";
            });

            item.appendChild(btnUnirse);
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
};

