import { construirApi } from "../autenticacion/ts/apiFetch";
import { getJSONHeaders } from "../autenticacion/ts/header";

export const obtenerFotoPerfil = async () => {
  const header = getJSONHeaders();
  const endpoint = "/cargarFoto";
  const response = await fetch(construirApi(endpoint), {
    method: "GET",
    headers: header,
  });
  if (!response.ok) {
    throw response;
  }
  const foto = await response.json();

  return foto;
};
