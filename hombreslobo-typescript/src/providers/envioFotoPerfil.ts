export async function enviarFotoPerfil(file: File, token: string) {
  const tokenString = sessionStorage.getItem(token);
  const formData = new FormData();

  formData.append("photo", file);

  const headers = new Headers();
  headers.set("Authorization", `Bearer ${tokenString}`);
  headers.set("Accept", "application/json");

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/cambiarFoto`, {
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
