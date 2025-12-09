import { construirApi } from "../autenticacion/ts/apiFetch";
import { getToken } from "../autenticacion/ts/auth";
import { getJSONHeaders } from "../autenticacion/ts/header";

export const obtenerNuevaPassword = async () => {
  const token = getToken();

  if (!token) {
    return false;
  }

  try {
    const header = getJSONHeaders();
    const endpoint = "/cambiarPasswordJugador";
    const response = await fetch(construirApi(endpoint), {
      method: "POST",
      headers: header,
    });

    const data = await response.json();

    if (!response.ok) {
      const errorDatos = data.message || "Error desconodido";
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error en la solicitud: " + error);
    return null;
  }
};
