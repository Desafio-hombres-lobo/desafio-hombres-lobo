import {
  ROL_ALDEANO,
  ROL_LOBO,
  ROL_NINIA,
  ROL_VIDENTE,
} from "./constantes_roles";
import {
  renderizarCartaAldeano,
  renderizarCartaLobo,
  renderizarCartaVidente,
  renderizarReverso,
  renderizarCartaNiña,
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

  if (id === ROL_ALDEANO) {
    await renderizarCartaAldeano(slotDiv, nickname);
  } else if (id === ROL_LOBO) {
    await renderizarCartaLobo(slotDiv, nickname);
  } else if (id === ROL_VIDENTE) {
    await renderizarCartaVidente(slotDiv, nickname);
  } else if (id === ROL_NINIA) {
    await renderizarCartaNiña(slotDiv, nickname);
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

export const voltearCartaPorVidente = async (
  nickname: string,
  idPersonaje: number
) => {
  console.log(`👁 La vidente está viendo a ${nickname}... 👁`);

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

  if (idPersonaje === 3) {
    return;
  } else if (idPersonaje === 1) {
    await renderizarCartaAldeano(slotDiv, nickname);
  } else if (idPersonaje === 2) {
    await renderizarCartaLobo(slotDiv, nickname);
  }
  // else if para niña

  setTimeout(() => {
    slotDiv.innerHTML = "";
    renderizarReverso(slotDiv, nickname);
    console.log(`La visión sobre ${nickname} se ha desvanecido.`);
  }, 4000);
};
