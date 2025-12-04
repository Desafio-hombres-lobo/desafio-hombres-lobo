import { getJSONHeaders } from "../../autenticacion/ts/header";
import { construirApi } from "../../autenticacion/ts/apiFetch";
import { enviarMensajeBot } from "../enviarMensaje"; 
import { pintarMensaje } from "../../Partida/ts/chatAldea"; 

const esperar = (ms: number) => new Promise(res => setTimeout(res, ms));

export const votarYHablarBotLobo = async (
  idPartida: number | string,
  idBot: number,
  ronda: number
) => {
  try {
    const resVoto = await fetch(
      construirApi(`/partida/${idPartida}/calcularVotoNoche/${idBot}/${ronda}`),
      { method: "GET", headers: getJSONHeaders() }
    );

    if (!resVoto.ok) return console.error("Error calculando voto del bot");

    const dataVoto = await resVoto.json();
    const objetivo = dataVoto.voto_bot;
    const nicknameBot = dataVoto.nickname_bot;
    const nicknameObjetivo = dataVoto.nickname_votado;

    await esperar(3500);


    const cantidadMensajes = Math.floor(Math.random() * 3);
    const mensajesBot = [
      "Creo que sospecha",
      "Tenemos que acabar con",
      "A ver, por descarte para que no sospechen, yo digo que matemos a",
      "No sé, por decir a alguien digo",
      "Yo creo que la niña es",
      "Iba a por mí"
    ];

    for (let i = 0; i < cantidadMensajes; i++) {
      const mensajeRandom =
        mensajesBot[Math.floor(Math.random() * mensajesBot.length)];

      const mensajeFinal = `${mensajeRandom} ${nicknameObjetivo}`;

      await esperar(Math.random() * 6000 + 1000); 
      pintarMensaje(nicknameBot, mensajeFinal);

      await enviarMensajeBot({
        message: mensajeFinal,
        id_partida: idPartida.toString(),
        bot: idBot
      });
    }

    
  await fetch(
      construirApi(`/partida/${idPartida}/votar/${ronda}`),
      {
        method: "POST",
        headers: getJSONHeaders(),
        body: JSON.stringify({
          voto_bot: objetivo,
          id_bot: idBot,
          ronda: ronda
        })
      }
    );

    console.log(`Bot ${nicknameBot} ha votado correctamente a ${nicknameObjetivo}`);
  } catch (error) {
    console.error("Error en votarYHablarBot:", error);
  }

};
