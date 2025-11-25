// Ejecutar acción
export const ejecutarAccion = async (
  contenedorCarta: HTMLElement,
  idAccion: number,
  idPersonaje: number
): Promise<void> => {
  switch (idPersonaje) {
    case 1:
      contenedorCarta.addEventListener("click", () => {
        console.log(`El Aldeano ${idPersonaje} ha sido votado.`);
      });
      break;

    case 2:
      contenedorCarta.addEventListener("click", () => {
        console.log(`El Lobo ${idPersonaje} ha sido votado.`);
      });
      break;

    default:
      console.warn("Acción no reconocida: ", idAccion);
  }
};
