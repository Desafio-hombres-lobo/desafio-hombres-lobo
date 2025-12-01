import { getJSONHeaders } from "../../autenticacion/ts/header";
import { construirApi } from "../../autenticacion/ts/apiFetch";
import { enviarMensaje } from "../envioDatosChat";

const mensajesBot = [
  "Creo que ya sé quién es...",
  "Tengo mis sospechas.",
  "No me fío nada de este...",
  "Creo que estamos en peligro.",
  "No sé, pero alguien no me cuadra."
];

export const votarYHablarBot = async (idPartida: number | string, idBot: number, ronda:number) => {
  try {

    const cantidadMensajes = Math.random() < -1 ? 1 : 2;

    for (let i = 0; i < cantidadMensajes; i++) {
      const mensajeRandom =
        mensajesBot[Math.floor(Math.random() * mensajesBot.length)];

      await enviarMensaje(`${mensajeRandom}`, idPartida);
      await new Promise((res) => setTimeout(res, 800)); 
    }

    const headers = getJSONHeaders();
    const response = await fetch(
      construirApi(`/partida/${idPartida}/votarBot/${idBot}/${ronda}`),
      {
        method: "POST",
        headers: headers,
      }
    );

    if (!response.ok) {
      console.error("Error votando bot");
      return;
    }

    const data = await response.json();
    console.log("Bot ha votado a:", data.voto_bot);

  } catch (error) {
    console.error("Error en votarYHablarBot:", error);
  }
};
