import { enviarDatosBackend } from "../providers/enviarDatosRegistro";
import "./css/registro.css";

/**
 * =============== *
 */

export const validarFormulario = (formulario: HTMLFormElement): void => {
  if (!formulario) return;
  const camposFormulario = {
    nombreUsuario: {
      input: formulario.querySelector<HTMLInputElement>(
        'input[name="nombre-usuario"]'
      )!,

      validar: (valor: string) => /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s-]+$/.test(valor),

      mensajeError:
        "El nombre no puede contener números ni caracteres especiales.",
    },

    emailUsuario: {
      input: formulario.querySelector<HTMLInputElement>(
        'input[name="email-usuario"]'
      )!,

      validar: (valor: string) =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(valor),

      mensajeError:
        "Debes introducir un formato de email correcto (ej. abc@gmail.com).",
    },

    nickUsuario: {
      input: formulario.querySelector<HTMLInputElement>(
        'input[name="nick-usuario"]'
      )!,

      validar: (valor: string) => /^[a-zA-Z0-9_-]+$/.test(valor),

      mensajeError:
        "El nick solo puede contener letras, números, guiones (-) y guiones bajos (_).",
    },

    passwordUsuario: {
      input: formulario.querySelector<HTMLInputElement>(
        'input[name="password-usuario"]'
      )!,

      validar: (valor: string) =>
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(
          valor
        ),

      mensajeError:
        "La contraseña debe contener al menos 8 caracteres, una letra (MAY o min), un número y un caracter especial (ej: !, @, #, $)",
    },

    passwordConfirmar: {
      input: formulario.querySelector<HTMLInputElement>(
        'input[name="password-confirmar"]'
      )!,
      validar: (valor: string) => valor.length > 0,
      mensajeError: "Debes confirmar tu contraseña.",
    },
  };

  const validarCamposFormulario = (e: SubmitEvent): void => {
    e.preventDefault();

    let formularioValido = true;

    for (const key in camposFormulario) {
      const campo = camposFormulario[key as keyof typeof camposFormulario];
      const valor = campo.input.value;

      if (!campo.validar(valor)) {
        mostrarError(campo.input, campo.mensajeError);
        formularioValido = false;
      } else {
        limpiarError(campo.input);
      }
    }

    if (!formularioValido) return;
    const datosUsuario = {
      name: camposFormulario.nombreUsuario.input.value,
      email: camposFormulario.emailUsuario.input.value,
      nickname: camposFormulario.nickUsuario.input.value,
      password: camposFormulario.passwordUsuario,
      password_confirmation: camposFormulario.passwordConfirmar,
    };
    enviarDatosBackend(datosUsuario);
  };
  formulario.addEventListener("submit", validarCamposFormulario);
};

// Función para mostrar el mensaje de error
const mostrarError = (input: HTMLInputElement, mensaje: string): void => {
  let errorSpan = input.parentElement?.querySelector<HTMLSpanElement>(".error");

  if (!errorSpan) {
    errorSpan = document.createElement("span");
    errorSpan.className = "error";
    input.parentElement?.appendChild(errorSpan);
  }

  errorSpan.textContent = mensaje;
  errorSpan.style.color = "red";
};

// Función para limpiar el mensaje de error
const limpiarError = (input: HTMLInputElement): void => {
  const errorSpan =
    input.parentElement?.querySelector<HTMLSpanElement>(".error");
  if (errorSpan) errorSpan.textContent = "";
};
