import { construirApi } from "../autenticacion/ts/apiFetch";
import { getToken } from "../autenticacion/ts/auth";
import { getJSONHeaders } from "../autenticacion/ts/header";

export let datosEstadisticas = {};

export const obtenerEstadisticasJugador = async () => {
  const token = getToken();

  if (!token) {
    alert("Error: No estás autenticado. Por favor, inicia sesión.");
    return false;
  }

  try {
    const header = getJSONHeaders();
    const endpoint = "/obtenerEstadisticasJugador";
    const response = await fetch(construirApi(endpoint), {
      method: "GET",
      headers: header,
    });

    const data = await response.json();
    datosEstadisticas = data;

    if (!response.ok) {
      const errorDatos = data.message || "Error desconocido";
      alert("Error al mostrar las estadísticas: " + errorDatos);
      return null;
    }

    return datosEstadisticas;
  } catch (error) {
    console.error("Error en la solicitud: " + error);
    return null;
  }
};
