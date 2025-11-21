import { getJSONHeaders } from "../autenticacion/ts/header";

export let partidaActual: any = null;

export const obtenerPartida = async (partidaId: string) => {
  const token = sessionStorage.getItem("auth_token");

  if (!token) {
    console.error("No hay token de autenticación");
    return null;
  }

  try {
    const header = getJSONHeaders();
    const res = await fetch(`http://127.0.0.1:8000/api/partida/${partidaId}`, {
      headers: header,
    });

    const datos = await res.json();
    if (!res.ok) {
      console.error(datos.message || "Error desconocido");
      return null;
    }

    partidaActual = datos;
    return datos;
  } catch (error) {
    console.error("Error cargando partida:", error);
    return null;
  }
};
