import { enviarFotoPerfil } from "../../providers/envioFotoPerfil";
import { cargarFoto } from "./cargarFotoPerfil";
export function subirFoto() {
  const inputFoto = document.getElementById(
    "cambiar-foto-perfil"
  ) as HTMLInputElement;
  const btnCambiar = document.getElementById(
    "cambiar-foto-perfil"
  ) as HTMLButtonElement;

  const form = document.getElementById("form-cambiar-foto") as HTMLFormElement;

  const token = sessionStorage.getItem("auth_token");
  if (inputFoto && btnCambiar && form && token) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      let archivo = null;
      if (inputFoto.files) {
        archivo = inputFoto.files[0];
      }

      if (archivo) {
        try {
          const respuesta = await enviarFotoPerfil(archivo, token);
          if (respuesta.exito) {
            cargarFoto();
          }
        } catch {
        } finally {
          document.body.style.cursor = "default";
        }
      }
    });
  }
}
