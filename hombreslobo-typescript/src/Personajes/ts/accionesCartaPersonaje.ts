// Ejecutar acción
export const ejecutarAccion = async (idAccion: number): Promise<void> => {
  switch (idAccion) {
    case 1:
      // método votar
      break;

    case 2:
      // método matar
      break;

    default:
      console.warn("Acción no reconocida: ", idAccion);
  }
};

// Matar

// Votar
