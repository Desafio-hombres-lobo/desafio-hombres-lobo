const TOKEN = "auth_token";
const ROL_USUARIO = "auth_rol";
const CLAVE_USUARIO = "auth_usuario";
const CLAVE_JUGADOR = "auth_jugador";
const LOCALSTORAGE = "credenciales";
const PARTIDA = "id_partida";

export const getToken = () => {
  return sessionStorage.getItem(getTokenPath());
};

export const getUsuario = () => {
  return sessionStorage.getItem(getUsuarioPath());
};

export const getJugador = () => {
  return sessionStorage.getItem(getJugadorPath());
};

export const getRol = () => {
  return sessionStorage.getItem(getRolPath());
};

export const getCredenciales = () => {
  return localStorage.getItem(getCredencialesPath());
};

export const getPartidaId = () => {
  return sessionStorage.getItem(getPartidaIdPath());
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

export const getPartidaIdPath = () => {
  return PARTIDA;
};
