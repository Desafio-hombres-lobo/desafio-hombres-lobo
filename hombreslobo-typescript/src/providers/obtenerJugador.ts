import { host,port } from "../autenticacion/ts/apiFetch";

export const obtenerJugador = async (id: string | number) => {
  const token = sessionStorage.getItem("auth_token");
  return fetch(`http://${host}:${port}/api/jugador/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  });
};
