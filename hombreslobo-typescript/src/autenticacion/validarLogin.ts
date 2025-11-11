import "./css/login.css";
import { enviarDatosLogin } from "../providers/enviarDatosLogin";

export const validarLogin = (formularioLogin: HTMLFormElement) => {
  if (!formularioLogin) return;
  const enviarDatos = async (e: SubmitEvent) => {
    e.preventDefault();
    const inputUsuario =
      formularioLogin.querySelector<HTMLInputElement>("#usuario");
    const inputPassword =
      formularioLogin.querySelector<HTMLInputElement>("#password");
    const inputRecordarme =
      formularioLogin.querySelector<HTMLInputElement>("#recordarme");

    const datosUsuario = {
      usuario: inputUsuario?.value,
      password: inputPassword?.value,
      recordarme: inputRecordarme?.checked,
    };
    const exito = await enviarDatosLogin(datosUsuario);
    if (exito) {
      window.location.href = "/index.html";
    }
  };

  formularioLogin.addEventListener("submit", enviarDatos);
};
