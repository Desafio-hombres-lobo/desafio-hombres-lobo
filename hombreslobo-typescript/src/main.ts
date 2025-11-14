import "./css/base.css";
import "./css/index.css";
import { validarFormulario } from "./autenticacion/validarFormulario";
import { validarLogin } from "./autenticacion/validarLogin";
import { actualizarHeader } from "./autenticacion/actualizarHeader";

const SESSIONSTORAGE = "auth_token";
const CLAVE_USUARIO = "auth_usuario";
const CLAVE_JUGADOR = "auth_jugador";
const LOCALSTORAGE = "credenciales";

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.querySelector<HTMLFormElement>("#formulario");
  const formularioLogin =
    document.querySelector<HTMLFormElement>("#formulario-login");
  actualizarHeader(SESSIONSTORAGE, CLAVE_USUARIO, CLAVE_JUGADOR);
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
