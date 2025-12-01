import {
  renderizarCartaAldeano,
  renderizarCartaLobo,
} from "./crearCartaPersonaje";

export const voltearCartaPersonaje = async (
  nickname: string,
  idPersonaje: number
) => {
  const slotDiv = document.querySelector(
    `.jugador[data-jugador="${nickname}"]`
  ) as HTMLElement;
  slotDiv.innerHTML = "";

  if (idPersonaje === 1) {
    await renderizarCartaAldeano(slotDiv);
  } else if (idPersonaje === 2) {
    await renderizarCartaLobo(slotDiv);
  }

  slotDiv.classList.add("jugador-eliminado");
};
