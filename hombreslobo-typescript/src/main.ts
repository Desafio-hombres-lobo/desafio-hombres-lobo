import "./css/base.css";
import "./css/index.css";
import { validarFormulario } from "./autenticacion/validarFormulario";

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.querySelector<HTMLFormElement>("#formulario");
  if (formulario) {
    validarFormulario(formulario);
  }
});
