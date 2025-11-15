export const cerrarSesion = (sesion: string, claveUsuario: string, claveJugador: string, rol: string) => {
  sessionStorage.removeItem(sesion);
  sessionStorage.removeItem(claveUsuario);
  sessionStorage.removeItem(claveJugador);
  sessionStorage.removeItem(rol);
  window.location.href = "/index.html";
};
