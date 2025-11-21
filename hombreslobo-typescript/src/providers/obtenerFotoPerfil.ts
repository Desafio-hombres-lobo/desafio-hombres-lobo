import { getToken } from "../autenticacion/ts/auth";
import { getJSONHeaders } from "../autenticacion/ts/header";

const API = "http://127.0.0.1:8000/api/cargarFoto";

export const obtenerFotoPerfil = async () => {
  const token = getToken();
  const header = getJSONHeaders();
  const response = await fetch(API, {
    method: "GET",
    headers: header,
  });
  if (!response.ok) {
    throw response;
  }
  const foto = await response.json();

  return foto;
};
