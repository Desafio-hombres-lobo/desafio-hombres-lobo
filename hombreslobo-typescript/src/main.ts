import "./css/base.css";
import "./css/index.css";
import { validarFormulario } from "./autenticacion/validarFormulario";
import { validarLogin } from "./autenticacion/validarLogin";

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.querySelector<HTMLFormElement>("#formulario");
  const formularioLogin =
    document.querySelector<HTMLFormElement>("#formulario-login");
  if (formulario) {
    validarFormulario(formulario);
  }
  if (formularioLogin) {
    validarLogin(formularioLogin);
  }
});
