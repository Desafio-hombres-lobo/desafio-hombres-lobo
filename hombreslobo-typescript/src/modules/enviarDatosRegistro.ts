import { camposFormulario, formulario } from "./validarFormulario";

const nombre = camposFormulario.nombreUsuario.input.value;
const email = camposFormulario.emailUsuario.input.value;
const nick = camposFormulario.nickUsuario.input.value;
const password = camposFormulario.passwordUsuario.input.value;

// Objeto con los datos del usuario (formulario)
const datosUsuario = { nombre, email, nick, password };

// Enviar objeto al backend
export const enviarDatosBackend = async () => {
  try {
    const response = await fetch("http://localhost:8000/api/registrar", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(datosUsuario),
    });

    // Verificar respuesta
    if (!response.ok) {
      const errorDatos = await response.json();
      alert("Error al registrar el usuario" + JSON.stringify(errorDatos));
    }

    const data = await response.json();
    alert("Usuario registrado correctamente." + JSON.stringify(data));
    formulario?.reset();
  } catch (error) {
    console.error("Error en la solicitud" + error);
  }
};
