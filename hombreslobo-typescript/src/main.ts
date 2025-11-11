import "./css/base.css";
import "./css/index.css";
import "/src/autenticacion/css/registro.css";
import { validarFormulario } from "./autenticacion/validarFormulario";

document.addEventListener("DOMContentLoaded", () => {
  validarFormulario();
});
