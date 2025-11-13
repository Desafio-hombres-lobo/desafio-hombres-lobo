export const enviarDatosLogin = async (datosUsuario: any) => {
  try {
    document.body.style.cursor = "wait";
    const response = await fetch("http://127.0.0.1:8000/api/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(datosUsuario),
    });

    // Verificar respuesta
    if (!response.ok) {
      throw response;
    }

    const data = await response.json();
    const SESSIONSTORAGE = "auth_token";
    const LOCALSTORAGE = "credenciales";
    const CLAVE_USUARIO = "auth_usuario";

    if (datosUsuario["recordarme"]) {
      localStorage.setItem(LOCALSTORAGE, datosUsuario["usuario"]);
    }
    if (data.token && data.usuario) {
      sessionStorage.setItem(SESSIONSTORAGE, data.token);
      sessionStorage.setItem(CLAVE_USUARIO, data.usuario);
      return true;
    }
  } finally {
    document.body.style.cursor = "default";
  }
};
