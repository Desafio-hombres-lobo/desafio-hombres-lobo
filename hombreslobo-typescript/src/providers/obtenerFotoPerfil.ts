const API = "http://127.0.0.1:8000/api/cargarFoto";
const SESSIONSTORAGE = "auth_token";

export const obtenerFotoPerfil = async () => {
  const token = sessionStorage.getItem(SESSIONSTORAGE);
  const response = await fetch(API, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw response;
  }
  const foto = await response.json();

  return foto;
};
