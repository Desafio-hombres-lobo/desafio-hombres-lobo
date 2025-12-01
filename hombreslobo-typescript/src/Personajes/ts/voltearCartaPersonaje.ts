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
  const id = Number(idPersonaje);

  if (id === 1) {
    await renderizarCartaAldeano(slotDiv);
  } else if (id === 2) {
    await renderizarCartaLobo(slotDiv);
  }

  slotDiv.classList.add("jugador-eliminado");
};
