import "./css/base.css";
import "./css/index.css";
import "/src/autenticacion/css/registro.css";
import { initModal } from "./Partida/mostrarModal";
import {initModalUnirse} from "./Partida/unirsePartida"

document.addEventListener("DOMContentLoaded", () => {
  initModal();
  initModalUnirse();
  import("./autenticacion/validarFormulario")
    .then(({ validarFormulario }) => {
      validarFormulario();
    })
    .catch((error) => {
      console.log("No hay formulario en esta página, saltando validación.");
    });
});

