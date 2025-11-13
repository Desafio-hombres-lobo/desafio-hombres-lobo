export const cerrarSesion = (sesion: string, usuario: string) => {
  sessionStorage.removeItem(sesion);
  sessionStorage.removeItem(usuario);
  window.location.href = "/index.html";
};
