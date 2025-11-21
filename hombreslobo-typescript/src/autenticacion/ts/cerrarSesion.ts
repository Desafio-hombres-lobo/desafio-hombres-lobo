import { getToken, getRol, getUsuario, getJugador } from "./auth";

export const cerrarSesion = () => {
  borrarJugador();
  borrarRol();
  borrarToken();
  borrarUsuario();
  window.location.href = "/index.html";
};

const borrarToken = () => {
  const token = getToken();
  if (token) sessionStorage.removeItem(token);
};
const borrarUsuario = () => {
  const usuario = getUsuario();
  if (usuario) sessionStorage.removeItem(usuario);
};
const borrarJugador = () => {
  const jugador = getJugador();
  if (jugador) sessionStorage.removeItem(jugador);
};
const borrarRol = () => {
  const rol = getRol();
  if (rol) sessionStorage.removeItem(rol);
};
