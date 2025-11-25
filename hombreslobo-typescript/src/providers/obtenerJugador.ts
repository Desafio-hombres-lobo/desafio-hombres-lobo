export const obtenerJugador = async (token: string, id: string | number) => {
  return fetch(`http://127.0.0.1:8000/api/jugador/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  });
};
