import { getJSONHeaders } from "../autenticacion/ts/header";
import { enviarDatosLogin } from "./enviarDatosLogin";

// Enviar objeto al backend
export const enviarDatosBackend = async (datosUsuario: any) => {
  try {
    document.body.style.cursor = "wait";
    const header = getJSONHeaders();
    const response = await fetch("http://127.0.0.1:8000/api/registrar", {
      method: "POST",
      headers: header,
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
    const exito = await enviarDatosLogin(login);
    if (exito) {
      window.location.href = "/index.html";
    }
  } catch (error) {
  } finally {
    document.body.style.cursor = "default";
  }
};
