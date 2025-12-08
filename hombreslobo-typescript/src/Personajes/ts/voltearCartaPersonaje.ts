import {
  ROL_ALDEANO,
  ROL_LOBO,
  ROL_NINIA,
  ROL_VIDENTE,
  ROL_BRUJA,
} from "./constantes_roles";
import {
  renderizarCartaAldeano,
  renderizarCartaBruja,
  renderizarCartaLobo,
  renderizarCartaNiña,
  renderizarCartaVidente,
} from "./crearCartaPersonaje";

export const voltearCartaPersonaje = async (
  nickname: string,
  idPersonaje: number,
  slotDiv: HTMLElement
) => {
  // const slotDiv = document.querySelector(
  //   `.jugador[data-jugador="${nickname}"]`
  // ) as HTMLElement;
  slotDiv.innerHTML = "";
  const id = Number(idPersonaje);

  if (id === ROL_ALDEANO) {
    await renderizarCartaAldeano(slotDiv, nickname);
  } else if (id === ROL_LOBO) {
    await renderizarCartaLobo(slotDiv, nickname);
  } else if (id === ROL_NINIA) {
    await renderizarCartaNiña(slotDiv, nickname);
  } else if (id === ROL_VIDENTE) {
    await renderizarCartaVidente(slotDiv, nickname);
  } else if (id === ROL_BRUJA) {
    await renderizarCartaBruja(slotDiv, nickname);
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

  if (idPersonaje === ROL_LOBO) {
    await renderizarCartaLobo(slotDiv, nickname);
    console.log(`Carta de lobo volteada para ${nickname}`);
  }
};
