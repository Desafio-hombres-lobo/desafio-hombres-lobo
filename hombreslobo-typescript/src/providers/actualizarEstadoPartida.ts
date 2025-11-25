export const actualizarEstadoPartida = async (
  token: string,
  partidaId: string,
  estado: 0|1|2|3
) => {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/${partidaId}/llena`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ estado }),
    });

    if (!res.ok) {
      throw new Error(`Error al actualizar estado: ${res.status}`);
    }

    console.log(`Estado actualizado a ${estado}`, await res.json());
    return { ok: true };
  } catch (error) {
    console.error("Error actualizando estado de la partida:", error);
    return { ok: false, error };
  }
};
