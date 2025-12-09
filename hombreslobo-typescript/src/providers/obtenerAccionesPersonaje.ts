import { construirApi } from "../autenticacion/ts/apiFetch";
import { getToken } from "../autenticacion/ts/auth";
import { getJSONHeaders } from "../autenticacion/ts/header";

let accionesPersonaje = {};

export const obtenerAccionesPersonaje = async (idPersonaje: number) => {
  const token = getToken();

  if (!token) {
    return false;
  }

  try {
    const header = getJSONHeaders();
    const endpoint = "/accionPersonaje";
    const response = await fetch(construirApi(endpoint), {
      method: "POST",
      headers: header,
      body: JSON.stringify({
        id_personaje: idPersonaje,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    accionesPersonaje = data;

    return accionesPersonaje;
  } catch (error) {
    console.error("Error en la solicitud: " + error);
    return null;
  }
};
