export const obtenerJugadoresPartida = async (token: string, partidaId: string) => {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/partida/${partidaId}/jugadores`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    });

    const datos = await res.json();

    return { 
      ok: true, 
      jugadoresActuales: datos.jugadores_actuales,
      jugadoresMaximos: datos.jugadores_maximos,
      partidaId: datos.partida_id,
      listaJugadores: datos.lista_jugadores || []
    };

  } catch (error) {
    console.error("Error cargando jugadores de la partida:", error);
    return { ok: false, error };
  }
};
