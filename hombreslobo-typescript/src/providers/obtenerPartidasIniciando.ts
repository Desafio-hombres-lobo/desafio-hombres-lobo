import { getToken } from "../autenticacion/ts/auth";
import { getJSONHeaders } from "../autenticacion/ts/header";

export let partidas = [];

export const obtenerPartidas = async () => {
  const token = getToken();

  if (!token) {
    alert("Error: No estás autenticado. Por favor, inicia sesión.");
    return false;
  }

  try {
    const header = getJSONHeaders();
    const response = await fetch(
      "http://127.0.0.1:8000/api/partidasIniciando",
      {
        method: "GET",
        headers: header,
      }
    );

    const data = await response.json();
    partidas = data;

    if (!response.ok) {
      const errorDatos = data.message || "Error desconocido";
      alert("Error al mostrar las partidas: " + errorDatos);
      return null;
    }

    return partidas;
  } catch (error) {
    console.error("Error en la solicitud: " + error);
    return null;
  }
};
