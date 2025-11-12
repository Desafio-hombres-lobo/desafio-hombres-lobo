import "../css/perfil.css";
import {
  mostrarError,
  limpiarError,
} from "../../autenticacion/validarFormulario";

const formCambiarNickname =
  document.querySelector<HTMLFormElement>("#form-nickname");

const nuevoNicknameUsuario =
  formCambiarNickname?.querySelector<HTMLInputElement>(
    'input[name="nuevo-nickname"]'
  )!;

formCambiarNickname?.addEventListener("submit", () => {
  console.log("Botón cambiar nickname pulsado");

  if (nuevoNicknameUsuario.value.length <= 0) {
    alert("El nickname no puede estar vacío");
    return;
  } else {
    alert("Nickname cambiado correctamente");
  }
});

// const validarFormNickname = (): void => {
//   if (!formCambiarNickname) return;

//   formCambiarNickname.addEventListener("submit", validarCampoNickname);
// };

// const validarCampoNickname = (e: SubmitEvent): void => {
//   e.preventDefault();

//   const campo = nuevoNicknameUsuario.value;

//   if (campo.length < 0) {
//     mostrarError(
//       nuevoNicknameUsuario,
//       "El nuevo nickname no puede estar vacío."
//     );
//   } else {
//     limpiarError(nuevoNicknameUsuario);
//   }
// };
