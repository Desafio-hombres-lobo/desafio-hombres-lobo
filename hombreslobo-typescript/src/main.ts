import "./css/base.css";
import "./css/index.css";
import "./Partida/css/elegirPartida.css";
import "./Personajes/css/styles.css";
import { initModal } from "./Partida/ts/mostrarModal.ts";
import { initLobby } from "./Lobby/ts/lobby";
import { validarFormulario } from "./autenticacion/ts/validarFormulario";
import { validarLogin } from "./autenticacion/ts/validarLogin";
import { actualizarHeader } from "./autenticacion/ts/actualizarHeader";

document.addEventListener("DOMContentLoaded", () => {
  initModal();

  if (window.location.pathname.includes("lobby.html")) {
    initLobby();
  }
  const formulario = document.querySelector<HTMLFormElement>("#formulario");
  const formularioLogin =
    document.querySelector<HTMLFormElement>("#formulario-login");
  actualizarHeader();
  if (formulario) {
    validarFormulario(formulario);
  }
  if (formularioLogin) {
    validarLogin(formularioLogin);
  }
});
