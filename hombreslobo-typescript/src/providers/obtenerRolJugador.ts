import { getJSONHeaders } from "../autenticacion/ts/header";
import { getToken } from "../autenticacion/ts/auth";
import { construirApi } from "../autenticacion/ts/apiFetch";
import { getPartidaId } from "../autenticacion/ts/auth";

export const obtenerRolPersonajeJugador = async () => {
  const token = getToken();
  const partida_id = getPartidaId();

  if (!token) {
    alert("Error: No estás autenticado. Por favor, inicia sesión.");
    return false;
  }

  let miRolId = null;
  try {
    const headers = getJSONHeaders();
    const response = await fetch(construirApi(`/partida/miRol`), {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ partida_id: partida_id }),
    });

    if (response.ok) {
      const data = await response.json();
      miRolId = data.rol_id;
    }

    return miRolId;
  } catch (error) {
    console.error(error);
  }
};
