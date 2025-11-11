export const cerrarSesion = (sesion: string, usuario: string) => {
  sessionStorage.removeItem(sesion);
  window.location.href = "/index.html";
};
