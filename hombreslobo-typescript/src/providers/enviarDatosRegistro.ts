import { enviarDatosLogin } from "./enviarDatosLogin";

// Enviar objeto al backend
export const enviarDatosBackend = async (datosUsuario: any) => {
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
    const usuario = data.usuario;
    const password = datosUsuario.password;
    const login = {
      usuario: usuario,
      password: password,
    };
    enviarDatosLogin(login);
  } catch (error) {
    console.error("Error en la solicitud. " + error);
  }
};
