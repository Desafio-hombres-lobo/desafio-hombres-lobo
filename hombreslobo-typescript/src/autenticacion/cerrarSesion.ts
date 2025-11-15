export const cerrarSesion = (sesion: string, claveUsuario: string, claveJugador: string) => {
  sessionStorage.removeItem(sesion);
  sessionStorage.removeItem(claveUsuario);
  sessionStorage.removeItem(claveJugador);
  window.location.href = "/index.html";
};
