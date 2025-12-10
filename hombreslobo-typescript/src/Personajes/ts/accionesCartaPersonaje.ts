// Ejecutar acción
export const ejecutarAccion = async (
  contenedorCarta: HTMLElement,
  idAccion: number,
  idJugador: number,
  idPersonaje: number
): Promise<void> => {
  switch (idPersonaje) {
    case 1:
      contenedorCarta.addEventListener("click", () => {
        console.log(
          `El Jugador con id ${idJugador}, que es Aldeano, ha sido votado.`
        );
      });
      break;

    case 2:
      contenedorCarta.addEventListener("click", () => {
        console.log(
          `El Jugador con id ${idJugador}, que es Lobo, ha sido votado.`
        );
      });
      break;

    default:
      console.warn("Acción no reconocida: ", idAccion);
  }
};
