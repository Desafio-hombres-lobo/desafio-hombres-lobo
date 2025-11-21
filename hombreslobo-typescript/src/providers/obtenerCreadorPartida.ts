import { getToken } from "../autenticacion/ts/auth";
import { getJSONHeaders } from "../autenticacion/ts/header";

export const obtenerCreador = async (creadorId: string) => {
  const token = getToken();

  if (!token) {
    console.error("No hay token de autenticación");
    return null;
  }

  try {
    const header = getJSONHeaders();
    const res = await fetch(`http://127.0.0.1:8000/api/jugador/${creadorId}`, {
      headers: header,
    });

    const creador = await res.json();
    if (!res.ok) {
      console.error(creador.message || "Error desconocido");
      return null;
    }

    return creador;
  } catch (error) {
    console.error("Error cargando creador de la partida:", error);
    return null;
  }
};
