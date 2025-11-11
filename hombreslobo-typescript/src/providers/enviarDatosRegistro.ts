import { camposFormulario, formulario } from "../modules/validarFormulario";

// Enviar objeto al backend
export const enviarDatosBackend = async () => {
  const nombre = camposFormulario.nombreUsuario.input.value;
  const email = camposFormulario.emailUsuario.input.value;
  const nickname = camposFormulario.nickUsuario.input.value;
  const password = camposFormulario.passwordUsuario.input.value;
  const passwordConfirmar = camposFormulario.passwordConfirmar.input.value;

  const datosUsuario = {
    name: nombre,
    email: email,
    nickname: nickname,
    password: password,
    password_confirmation: passwordConfirmar,
  };

  try {
    const response = await fetch("http://127.0.0.1:8000/api/registrar", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(datosUsuario),
    });

    // Verificar respuesta
    if (!response.ok) {
      const errorDatos = await response.json();
      alert("Error al registrar el usuario. " + JSON.stringify(errorDatos));
      return;
    }

    const data = await response.json();
    formulario?.reset();
  } catch (error) {
    console.error("Error en la solicitud. " + error);
  }
};
