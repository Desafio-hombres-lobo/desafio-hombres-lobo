// import './style.css'
import { validarFormulario } from "./modules/validarFormulario";
import { enviarDatosBackend } from "./modules/enviarDatosRegistro";

document.addEventListener("DOMContentLoaded", () => {
  validarFormulario;
  enviarDatosBackend;
});
