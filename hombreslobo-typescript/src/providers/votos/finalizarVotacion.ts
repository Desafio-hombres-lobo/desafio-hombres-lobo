import { construirApi } from "../../autenticacion/ts/apiFetch";
import { getJSONHeaders } from "../../autenticacion/ts/header";

export const finalizarVotacion = async (partidaId: string, ronda: number) => {
  try {
    const res = await fetch(construirApi(`/partida/${partidaId}/finalizar-votacion/${ronda}`), {
      method: "POST",
      headers: getJSONHeaders(),
    });

    const data = await res.json();

    if (!res.ok) {
      return { ok: false, error: data };
    }

    return { ok: true, resultado: data.resultado, eliminado: data.eliminado };
  } catch (error) {
    console.error("Error finalizando votación:", error);
    return { ok: false, error };
  }
};
