// Crea este archivo: src/providers/bruja/enviarAccionBruja.ts
import { construirApi } from "../autenticacion/ts/apiFetch";
import { getJSONHeaders } from "../autenticacion/ts/header";

export const enviarAccionBruja = async (
  idPartida: string,
  accion: "revivir" | "matar" | "nada",
  idObjetivo: number | null
) => {
  try {
    const respuesta = await fetch(
      construirApi(`/partidas/${idPartida}/bruja`),
      {
        method: "POST",
        headers: getJSONHeaders(),
        body: JSON.stringify({ accion, id_jugador_objetivo: idObjetivo }),
      }
    );

    if (!respuesta.ok) {
      throw new Error("Error en la acción de la bruja");
    }
    return await respuesta.json();
  } catch (error) {
    console.error(error);
    return { ok: false };
  }
};
