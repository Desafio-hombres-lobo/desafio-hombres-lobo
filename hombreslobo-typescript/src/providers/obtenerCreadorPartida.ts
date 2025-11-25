export const obtenerCreador = async (token: string, idPartida: string | number) => {
  return fetch(`http://127.0.0.1:8000/api/creadorPartida/${idPartida}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  });
};