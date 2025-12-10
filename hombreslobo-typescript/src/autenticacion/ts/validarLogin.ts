import "../css/login.css";
import { enviarDatosLogin } from "../../providers/enviarDatosLogin";
import { getCredenciales } from "./auth";

export const validarLogin = (formularioLogin: HTMLFormElement) => {
  if (!formularioLogin) return;
  const inputUsuario =
    formularioLogin.querySelector<HTMLInputElement>("#usuario")!;
  const inputPassword =
    formularioLogin.querySelector<HTMLInputElement>("#password")!;
  const togglePassword =
    formularioLogin.querySelector<HTMLElement>("#togglePassword");

  // 2. Lógica para alternar visibilidad
  if (togglePassword && inputPassword) {
    togglePassword.addEventListener("click", () => {
      // Alternar tipo de input
      const type =
        inputPassword.getAttribute("type") === "password" ? "text" : "password";
      inputPassword.setAttribute("type", type);

      // Alternar icono (ojo abierto / ojo tachado)
      togglePassword.classList.toggle("fa-eye");
      togglePassword.classList.toggle("fa-eye-slash");
    });
  }

  const inputRecordarme =
    formularioLogin.querySelector<HTMLInputElement>("#recordarme")!;
  const credencial = getCredenciales();
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
