export const salirPartida = async (token: string, partidaId: string) => {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/partida/abandonar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        partida_id: partidaId
      })
    });

    const datos = await res.json();
    return { ok: true, datos };

  } catch (error) {
    console.error("Error al abandonar la partida:", error);
    return { ok: false, error };
  }
};