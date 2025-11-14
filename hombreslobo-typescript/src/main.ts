import "./css/base.css";
import "./css/index.css";
import "/src/autenticacion/css/registro.css";
import "./Partida/css/elegirPartida.css"
import { initModal } from "./Partida/ts/mostrarModal";
import {initModalUnirse} from "./Partida/ts/unirsePartida"
import { initModalCrearPartida } from "./Partida/ts/crearPartida";

document.addEventListener("DOMContentLoaded", () => {
  initModal();
  initModalUnirse();
  initModalCrearPartida();
  import("./autenticacion/validarFormulario")
    .then(({ validarFormulario }) => {
      validarFormulario();
    })
    .catch((error) => {
      console.log("No hay formulario en esta página, saltando validación.");
    });
});

