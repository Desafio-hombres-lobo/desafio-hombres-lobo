import { obtenerPartida } from "../../providers/obtenerPartida";
import { obtenerCreador } from "../../providers/obtenerCreadorPartida";

export const initLobby = () => {
  const partidaId = localStorage.getItem("partida_id");

  if (!partidaId) {
    console.error("No existe esa partida");
    return;
  }

  const codigoPartida = document.getElementById("codigo-partida") as HTMLElement;
  const codigoLabel = document.querySelector(".code strong") as HTMLElement;
  const contadorEl = document.querySelector(".contador") as HTMLElement;
  const botonAbandonar = document.getElementById("abandonar") as HTMLButtonElement;
  const btnCopiarCodigo = document.getElementById("copiarCodigo") as HTMLButtonElement;

  const cargarPartida = async () => {
    const datos = await obtenerPartida(partidaId);
    if (!datos) return;

    const creador = await obtenerCreador(datos.creador_id);
    if (!creador) return;

    const nombreCreador = creador.nickname;
    codigoPartida.textContent = `Lobby de partida de: ${nombreCreador}`;
    codigoLabel.textContent = datos.codigo;
    contadorEl.textContent = `1/${datos.num_jugadores}`;
  };

  btnCopiarCodigo.addEventListener("click", async () => {
    const codigo = codigoLabel.textContent || "";
    await navigator.clipboard.writeText(codigo);
  });

  botonAbandonar.addEventListener("click", () => {
    localStorage.removeItem("partida_id");
    window.location.href = "/";
  });

  if (partidaId) {
    cargarPartida();
  }
};
