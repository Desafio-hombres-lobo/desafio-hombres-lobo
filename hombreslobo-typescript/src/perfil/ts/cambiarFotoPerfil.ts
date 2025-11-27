import { getToken } from "../../autenticacion/ts/auth";
import { enviarFotoPerfil } from "../../providers/envioFotoPerfil";
import { cargarFoto } from "./cargarFotoPerfil";
export function subirFoto() {
  const inputFoto = document.getElementById("subir-foto") as HTMLInputElement;
  const btnCambiar = document.getElementById(
    "cambiar-foto-perfil"
  ) as HTMLButtonElement;

  const form = document.getElementById("form-cambiar-foto") as HTMLFormElement;

  const token = getToken();
  if (inputFoto && btnCambiar && form && token) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      let archivo = null;
      if (inputFoto.files) {
        archivo = inputFoto.files[0];
      }

      if (archivo) {
        try {
          document.body.style.cursor = "wait";
          const respuesta = await enviarFotoPerfil(archivo);
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
