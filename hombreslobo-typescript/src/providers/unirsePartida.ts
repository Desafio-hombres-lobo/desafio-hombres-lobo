export const unirsePartida = async (token: string, payload: {
  game_id: string | number;
  player: string;
  timestamp: string;
}) => {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/game/join`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", 
        Accept: "application/json"
      },
      body: JSON.stringify(payload),
    });

    const datos = await res.json();
    return { ok: true, datos };

  } catch (error) {
    console.error("Error cargando partida:", error);
    return { ok: false, error };
  }
};