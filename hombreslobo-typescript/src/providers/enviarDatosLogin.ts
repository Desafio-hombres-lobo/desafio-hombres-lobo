export const enviarDatosLogin = async (datosUsuario: any) => {
  try {
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
      const errorDatos = await response.json();
      alert("Error al intentar iniciar sesion. " + JSON.stringify(errorDatos));
      return false;
    }

    const data = await response.json();
    const SESSIONSTORAGE = "auth_token";
    const LOCALSTORAGE = "credenciales";
    if (datosUsuario["recordarme"]) {
      localStorage.setItem(LOCALSTORAGE, datosUsuario["usuario"]);
    }
    if (data.token) {
      sessionStorage.setItem(SESSIONSTORAGE, data.token);
      return true;
    }
  } catch (error) {
    console.error("Error en la solicitud. " + error);
    return false;
  }
};
