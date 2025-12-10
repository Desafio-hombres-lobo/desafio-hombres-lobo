import { construirApi } from "../autenticacion/ts/apiFetch";
import { getToken } from "../autenticacion/ts/auth";
import { getJSONHeaders } from "../autenticacion/ts/header";

export let partidas = [];

export const obtenerPartidas = async () => {
  const token = getToken();

  if (!token) {
    return false;
  }

  try {
    const header = getJSONHeaders();
    const endpoint = "/partidasIniciando";
    const response = await fetch(construirApi(endpoint), {
      method: "GET",
      headers: header,
    });

    const data = await response.json();
    partidas = data;

    if (!response.ok) {
      const errorDatos = data.message || "Error desconocido";
      return null;
    }

    return partidas;
  } catch (error) {
    console.error("Error en la solicitud: " + error);
    return null;
  }
};
