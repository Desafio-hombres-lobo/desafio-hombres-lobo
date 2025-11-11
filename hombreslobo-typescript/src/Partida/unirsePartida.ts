// unirsePartida.ts
export const initModalUnirse = (): void => { 
  const modalJuego = document.getElementById("modalJuego") as HTMLDivElement;
  const unirseBtn = document.getElementById("unirse") as HTMLButtonElement;
  const modalUnirse = document.getElementById("modalUnirse") as HTMLDivElement;
  const lista = document.getElementById("listaPartidas") as HTMLUListElement;
  const buscarBtn = document.getElementById("buscarPartida") as HTMLButtonElement;

  if (!modalJuego || !unirseBtn || !modalUnirse || !lista || !buscarBtn) return;


  unirseBtn.addEventListener("click", () => {
    modalJuego.style.display = "none";
    modalUnirse.style.display = "block";
    cargarPartidas();
  });


  window.addEventListener("click", (e) => {
    if (e.target === modalUnirse) {
      modalUnirse.style.display = "none";
    }
  });


  buscarBtn.addEventListener("click", () => {
    cargarPartidas();
  });


  async function cargarPartidas() {
    try {
      const response = await fetch("http://localhost:8000/api/partidas");
      const partidas = await response.json();

      lista.innerHTML = "";

      partidas.forEach((p: any) => {
        const item = document.createElement("li");
        item.textContent = `${p.nombre} (${p.codigo})`;
        lista.appendChild(item);
      });
    } catch (error) {
      console.error("Error al cargar partidas:", error);
      lista.innerHTML = "<li>Error al cargar partidas</li>";
    }
  }
};


