import "../css/perfil.css";

const formCambiarNickname =
  document.querySelector<HTMLFormElement>("#form-nickname")!;

const campoNuevoNickname = {
  nuevoNicknameUsuario: {
    input: formCambiarNickname.querySelector<HTMLInputElement>(
      'input[name="nuevo-nickname"]'
    )!,
    validar: (valor: string) => valor.trim().length <= 0,
    mensajeError: "El nuevo nickname no puede estar vacío.",
  },
};

formCambiarNickname.addEventListener("submit", (e) => {
  e.preventDefault();
  validarFormNickname();
});

const validarFormNickname = (): void => {
  if (!formCambiarNickname) return;
  validarCampoNickname();
};

const validarCampoNickname = (): void => {
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

  // enviarNicknameActualizado(datosNuevoNickname)
};

const mostrarError = (input: HTMLInputElement, mensaje: string): void => {
  const contenedor = input.parentElement; // .campo-con-boton
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
