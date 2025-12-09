import { construirApi } from "../autenticacion/ts/apiFetch";
import { getJSONHeaders } from "../autenticacion/ts/header";
import { enviarDatosLogin } from "./enviarDatosLogin";

// Enviar objeto al backend
export const enviarDatosBackend = async (datosUsuario: any) => {
  try {
    document.body.style.cursor = "wait";
    const header = getJSONHeaders();
    const endpoint = "/registrar";
    const response = await fetch(construirApi(endpoint), {
      method: "POST",
      headers: header,
      body: JSON.stringify(datosUsuario),
    });

    // Verificar respuesta
    if (!response.ok) {
      const errorDatos = await response.json();
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
