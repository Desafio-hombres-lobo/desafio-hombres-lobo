import { getJSONHeaders } from "../autenticacion/ts/header";
import { getToken } from "../autenticacion/ts/auth";
import { construirApi } from "../autenticacion/ts/apiFetch";
import { getPartidaId } from "../autenticacion/ts/auth";

export const obtenerRolPersonajeJugador = async () => {
  const token = getToken();
  const id_partida = getPartidaId();

  if (!token) {
    return false;
  }

  let miRolId = null;
  try {
    const headers = getJSONHeaders();
    const response = await fetch(construirApi(`/partida/miRol`), {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ id_partida: id_partida }),
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
