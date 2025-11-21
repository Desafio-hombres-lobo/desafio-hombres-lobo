import { getToken } from "../autenticacion/ts/auth";

export let datosEstadisticas = {};

export const obtenerEstadisticasJugador = async () => {
  const token = getToken();

  if (!token) {
    alert("Error: No estás autenticado. Por favor, inicia sesión.");
    return false;
  }

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/obtenerEstadisticasJugador",
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

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
