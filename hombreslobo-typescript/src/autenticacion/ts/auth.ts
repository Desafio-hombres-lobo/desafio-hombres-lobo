const TOKEN = "auth_token";
const ROL_USUARIO = "auth_rol";
const CLAVE_USUARIO = "auth_usuario";
const CLAVE_JUGADOR = "auth_jugador";
const LOCALSTORAGE = "credenciales";

export const getToken = () => {
  return sessionStorage.getItem(TOKEN);
};

export const getUsuario = () => {
  return sessionStorage.getItem(CLAVE_USUARIO);
};

export const getJugador = () => {
  return sessionStorage.getItem(CLAVE_JUGADOR);
};

export const getRol = () => {
  return sessionStorage.getItem(ROL_USUARIO);
};

export const getCredenciales = () => {
  return localStorage.getItem(LOCALSTORAGE);
};

export const getTokenPath = () => {
  return TOKEN;
};

export const getUsuarioPath = () => {
  return CLAVE_USUARIO;
};

export const getJugadorPath = () => {
  return CLAVE_JUGADOR;
};

export const getRolPath = () => {
  return ROL_USUARIO;
};

export const getCredencialesPath = () => {
  return LOCALSTORAGE;
};
