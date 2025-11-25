export const obtenerJugadorActual = async (token: string) => {
  return await fetch("http://127.0.0.1:8000/api/jugador", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
