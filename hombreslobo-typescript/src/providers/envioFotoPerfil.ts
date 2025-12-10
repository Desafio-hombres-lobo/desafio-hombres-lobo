import { construirApi } from "../autenticacion/ts/apiFetch";
import { getFileHeaders } from "../autenticacion/ts/header";

export async function enviarFotoPerfil(file: File) {
  const formData = new FormData();

  formData.append("foto", file);

  const headers = getFileHeaders();
  const endpoint = "/cambiarFoto";
  try {
    const response = await fetch(construirApi(endpoint), {
      method: "POST",
      headers: headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw response;
    }

    return data;
  } catch (error) {
    throw error;
  }
}
