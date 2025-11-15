export const cerrarSesion = (sesion: string, usuario: string, rol: string) => {
  sessionStorage.removeItem(sesion);
  sessionStorage.removeItem(usuario);
  sessionStorage.removeItem(rol);
  window.location.href = "/index.html";
};
