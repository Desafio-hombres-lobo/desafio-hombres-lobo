export const obtenerNuevaPassword = async () => {
  const token = sessionStorage.getItem("auth_token");

  if (!token) {
    alert("Error: No estás autenticado. Por favor, inicia sesión.");
    return false;
  }

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/cambiarPasswordJugador",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    console.log("Cambio contraseña: " + JSON.stringify(data));

    if (!response.ok) {
      const errorDatos = data.message || "Error desconodido";
      alert("Error al cambiar la contraseña del usuario: " + errorDatos);
      return null;
    }

    return true;
  } catch (error) {
    console.error("Error en la solicitud: " + error);
    return null;
  }
};
