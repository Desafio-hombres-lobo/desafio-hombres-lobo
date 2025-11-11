import "./css/base.css";
import "./css/index.css";
import { validarFormulario } from "./autenticacion/validarFormulario";
import { validarLogin } from "./autenticacion/validarLogin";
const SESSIONSTORAGE = "auth_token";
const LOCALSTORAGE = "credenciales";

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.querySelector<HTMLFormElement>("#formulario");
  const formularioLogin =
    document.querySelector<HTMLFormElement>("#formulario-login");
  if (formulario) {
    validarFormulario(formulario);
  }
  if (formularioLogin) {
    validarLogin(formularioLogin, sacarCredenciales(LOCALSTORAGE));
  }
});

const sacarCredenciales = (storage: string) => {
  const credencial = localStorage.getItem(storage);
  if (credencial) {
    return credencial;
  } else {
    return false;
  }
};
