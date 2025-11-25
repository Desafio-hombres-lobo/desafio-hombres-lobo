
export const obtenerPartida = async (token: string, partidaId: string) => {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/partida/${partidaId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    });

    const datos = await res.json();
    return { ok: true, datos };

  } catch (error) {
    console.error("Error cargando partida:", error);
    return { ok: false, error };
  }
};
