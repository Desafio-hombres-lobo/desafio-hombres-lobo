import { getToken } from "../autenticacion/ts/auth";
import { construirApi } from "../autenticacion/ts/apiFetch";

export const enviarMensaje = async (payload: { message: string; id_partida: string }) => {
  const token = getToken();
  const apiUrl = construirApi("/chat/send");

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return { ok: false, error: errorText };
    }

    const data = await res.json();
    return { ok: true, data };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
};

export const enviarMensajeBot = async (payload: { message: string; id_partida: string, bot:number }) => {
  const token = getToken();
  const apiUrl = construirApi(`/chat/send/${payload.bot}`);

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return { ok: false, error: errorText };
    }

    const data = await res.json();
    return { ok: true, data };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
};

export const enviarMensajeBotLobo = async (payload: {
  message: string;
  partida_id: number | string;
  bot: number;
}) => {
  const token = getToken();
  const apiUrl = construirApi(`/chat/send/${payload.bot}/lobo`);

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return { ok: false, error: errorText };
    }

    const data = await res.json();
    return { ok: true, data };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
};
