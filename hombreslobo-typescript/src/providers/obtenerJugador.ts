export const obtenerJugador = async (id: string | number) => {
  const token = sessionStorage.getItem("auth_token");
  return fetch(`http://127.0.0.1:8000/api/jugador/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  });
};
