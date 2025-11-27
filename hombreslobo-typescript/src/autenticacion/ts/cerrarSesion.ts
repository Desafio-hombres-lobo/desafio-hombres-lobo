import { getToken, getRol, getUsuario, getJugador, getRolPath } from "./auth";
import {
  getTokenPath,
  getJugadorPath,
  getUsuarioPath,
  getCredencialesPath,
} from "./auth";

export const cerrarSesion = () => {
  borrarJugador();
  borrarRol();
  borrarToken();
  borrarUsuario();
  window.location.href = "/index.html";
};

const borrarToken = () => {
  const token = getToken();
  if (token) sessionStorage.removeItem(getTokenPath());
};
const borrarUsuario = () => {
  const usuario = getUsuario();
  if (usuario) sessionStorage.removeItem(getUsuarioPath());
};
const borrarJugador = () => {
  const jugador = getJugador();
  if (jugador) sessionStorage.removeItem(getJugadorPath());
};
const borrarRol = () => {
  const rol = getRol();
  if (rol) sessionStorage.removeItem(getRolPath());
};
