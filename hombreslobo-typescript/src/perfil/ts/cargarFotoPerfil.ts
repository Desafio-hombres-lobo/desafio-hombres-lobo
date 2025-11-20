import { obtenerFotoPerfil } from "../../providers/obtenerFotoPerfil";

export const cargarFoto = async () => {
  try {
    const respuestaFoto = await obtenerFotoPerfil();
    const fotoHTML = document.querySelector(
      ".profile-pic img"
    ) as HTMLImageElement;
    if (respuestaFoto && fotoHTML) {
      fotoHTML.src = respuestaFoto.foto;
    }
  } catch {}
};
