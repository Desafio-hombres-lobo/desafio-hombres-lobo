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

export const voltearCartasLobo = async (
  nickname: string,
  idPersonaje: number
) => {
  const slotDiv = document.querySelector(
    `.jugador[data-jugador="${nickname}"]`
  ) as HTMLElement;
  if (!slotDiv) {
    console.warn(
      `No se encontró la carta HTML para el jugador: "${nickname}". Tal vez aún no se ha renderizado.`
    );
    return;
  }
  slotDiv.innerHTML = "";

  if (idPersonaje === 2) {
    await renderizarCartaLobo(slotDiv);
    console.log(`Carta de lobo volteada para ${nickname}`);
  }
};
