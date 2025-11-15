import "./css/login.css";
import { enviarDatosLogin } from "../providers/enviarDatosLogin";

export const validarLogin = (
  formularioLogin: HTMLFormElement,
  credencial: any
) => {
  if (!formularioLogin) return;
  const inputUsuario =
    formularioLogin.querySelector<HTMLInputElement>("#usuario")!;
  const inputPassword =
    formularioLogin.querySelector<HTMLInputElement>("#password")!;
  const inputRecordarme =
    formularioLogin.querySelector<HTMLInputElement>("#recordarme")!;
  if (credencial && inputUsuario) {
    inputUsuario.value = credencial;
  }
  const enviarDatos = async (e: SubmitEvent) => {
    e.preventDefault();
    const datosUsuario = {
      usuario: inputUsuario.value,
      password: inputPassword.value,
      recordarme: inputRecordarme.checked,
    };
    try {
      const exito = await enviarDatosLogin(datosUsuario);
      if (exito) {
        window.location.href = "/index.html";
      }
    } catch (error: any) {
      const errorUsuario =
        formularioLogin.querySelector<HTMLParagraphElement>("#error-usuario");
      const errorPassword =
        formularioLogin.querySelector<HTMLParagraphElement>("#error-password");
      const errorData = await error.json();
      if (errorData && errorData.error && errorUsuario && errorPassword) {
        switch (errorData.error) {
          case "usuario":
            errorUsuario.textContent = errorData.mensaje;
            break;
          case "password":
            errorPassword.textContent = errorData.mensaje;
            break;
        }
      }
    }
  };

  formularioLogin.addEventListener("submit", enviarDatos);
};
