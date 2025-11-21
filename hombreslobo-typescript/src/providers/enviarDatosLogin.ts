import {
  getCredencialesPath,
  getJugadorPath,
  getRolPath,
  getTokenPath,
  getUsuarioPath,
} from "../autenticacion/ts/auth";
import { getJSONHeaders } from "../autenticacion/ts/header";

export const enviarDatosLogin = async (datosUsuario: any) => {
  try {
    document.body.style.cursor = "wait";
    const header = getJSONHeaders();
    const response = await fetch("http://127.0.0.1:8000/api/login", {
      method: "POST",
      headers: header,
      body: JSON.stringify(datosUsuario),
    });

    // Verificar respuesta
    if (!response.ok) {
      throw response;
    }

    const data = await response.json();

    if (datosUsuario["recordarme"]) {
      localStorage.setItem(getCredencialesPath(), datosUsuario["usuario"]);
    }
    if (data.token && data.usuario) {
      sessionStorage.setItem(getTokenPath(), data.token);
      sessionStorage.setItem(getUsuarioPath(), data.usuario);
      sessionStorage.setItem(getRolPath(), data.rol);
      sessionStorage.setItem(getJugadorPath(), data.jugador);
      return true;
    }
  } finally {
    document.body.style.cursor = "default";
  }
};
