import { getJSONHeaders } from "../autenticacion/ts/header";
import { getToken } from "../autenticacion/ts/auth";
import { construirApi } from "../autenticacion/ts/apiFetch";
import { getPartidaId } from "../autenticacion/ts/auth";

export const obtenerIdJugadoresLobos = async (): Promise<any[]> => {
  const token = getToken();
  const id_partida = getPartidaId();

  if (!token) {
    return [];
  }

  let jugadoresLobo: any[] = [];

  try {
    const headers = getJSONHeaders();
    const response = await fetch(
      construirApi(`/partidas/${id_partida}/idLobos`),
      {
        method: "GET",
        headers: headers,
      }
    );

    if (response.ok) {
      const data = await response.json();
      jugadoresLobo = data;
    }

    return jugadoresLobo || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};
