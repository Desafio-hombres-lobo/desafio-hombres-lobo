import "../css/perfil.css";
import { enviarNicknameActualizado } from "../../providers/actualizarNickname";
import { cambiarPasswordUsuario } from "./cambiarPassword";

const formCambiarNickname =
  document.querySelector<HTMLFormElement>("#form-nickname")!;

const formCambiarPassword =
  document.querySelector<HTMLFormElement>("#form-password")!;

const campoNuevoNickname = {
  nuevoNicknameUsuario: {
    input: formCambiarNickname.querySelector<HTMLInputElement>(
      'input[name="nickname"]'
    )!,
    validar: (valor: string) => valor.trim().length <= 0,
    mensajeError: "El nuevo nickname no puede estar vacío.",
  },
};

formCambiarNickname.addEventListener("submit", (e) => {
  e.preventDefault();
  validarFormNickname();
});

formCambiarPassword.addEventListener("submit", cambiarPasswordUsuario);

const validarFormNickname = (): void => {
  if (!formCambiarNickname) return;
  validarCampoNickname();
};

const validarCampoNickname = async (): Promise<void> => {
  let formularioValido = true;

  const campo = campoNuevoNickname.nuevoNicknameUsuario;
  const valor = campo.input.value.trim();

  if (campo.validar(valor)) {
    mostrarError(campo.input, campo.mensajeError);
    formularioValido = false;
  } else {
    limpiarError(campo.input);
  }

  if (!formularioValido) return;

  const datosNuevoNickname = {
    nickname: campo.input.value,
  };

  await enviarNicknameActualizado(datosNuevoNickname);
  campo.input.value = "";
};

const mostrarError = (input: HTMLInputElement, mensaje: string): void => {
  const contenedor = input.parentElement;
  if (!contenedor) return;

  let errorSpan = contenedor.querySelector<HTMLSpanElement>(".error");

  if (!errorSpan) {
    errorSpan = document.createElement("span");
    errorSpan.className = "error";
    contenedor.insertAdjacentElement("afterend", errorSpan);
  }

  errorSpan.textContent = mensaje;
};

const limpiarError = (input: HTMLInputElement): void => {
  const contenedor = input.parentElement;
  const errorSpan = contenedor?.nextElementSibling as HTMLSpanElement;
  if (errorSpan?.classList.contains("error")) errorSpan.textContent = "";
};
