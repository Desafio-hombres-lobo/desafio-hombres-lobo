import { construirApi } from "../autenticacion/ts/apiFetch";
import { getJugadorPath, getToken } from "../autenticacion/ts/auth";
import { getJSONHeaders } from "../autenticacion/ts/header";

export const enviarNicknameActualizado = async (datosNuevoNickname: any) => {
  // Obtener token usuario
  const token = getToken();

  if (!token) {
    return false;
  }

  try {
    const header = getJSONHeaders();
    const endpoint = "/cambiarNicknameUsuario";
    const response = await fetch(construirApi(endpoint), {
      method: "POST",
      headers: header,
      body: JSON.stringify(datosNuevoNickname),
    });

    const data = await response.json();

    // Verificar respuesta
    if (!response.ok) {
      //const errorDatos = await response.json();
      const errorDatos = data.errors
        ? JSON.stringify(data.errors)
        : data.message;
      return false;
    }

    alert("¡Nickname actualizado con éxito a: " + data.nickname + "!");

    // Actualizar el nickname guardado en sesión
    sessionStorage.setItem(getJugadorPath(), data.nickname);

    return true;
  } catch (error) {
    console.error("Error en la solicitud. " + error);
    return false;
  }
};
