import { getJSONHeaders } from "../../autenticacion/ts/header";
import { construirApi } from "../../autenticacion/ts/apiFetch";
import { enviarMensajeBotLobo } from "../enviarMensaje";
import { pintarMensaje } from "../../Partida/ts/chatAldea";

const esperar = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const votarYHablarBotLobo = async (
  idPartida: number | string,
  idBot: number,
  ronda: number,
  dia: boolean
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
      const plantillasMensajes = [
      "Creo que {nombre} sospecha demasiado de nosotros.",
      "Tenemos que acabar con {nombre} antes de que hable.",
      "Por descarte, yo iría a por {nombre} esta noche.",
      
      "Si matamos a {nombre}, creo que nadie sospechará.",
      "{nombre} está muy callado, quizás tiene un rol importante.",
      "Yo digo que eliminemos a {nombre}.",
      
      "Voto a {nombre}.",
      "Definitivamente {nombre}.",
      "¿Qué os parece {nombre}?",
      "Me da mala espina {nombre}, vamos a por él/ella.",
      
      "No sé... {nombre} parece aldeano simple, pero vale.",
      "Venga, acepto {nombre}, pero mañana cuidado.",
      "¿Seguro que {nombre}? Bueno, me fío de vosotros."
  ];

  for (let i = 0; i < cantidadMensajes; i++) {
      const plantilla = plantillasMensajes[Math.floor(Math.random() * plantillasMensajes.length)];

      const mensajeFinal = plantilla.replace("{nombre}", nicknameObjetivo);

      await esperar(Math.random() * 4000 + 1500);

      await enviarMensajeBotLobo({
          message: mensajeFinal,
          id_partida: idPartida.toString(),
          bot: idBot
      });
  }

    await fetch(construirApi(`/partida/${idPartida}/votar/${ronda}`), {
      method: "POST",
      headers: getJSONHeaders(),
      body: JSON.stringify({
        voto_bot: objetivo,
        id_bot: idBot,
        ronda: ronda,
        dia: dia
      }),
    });

    console.log(
      `Bot ${nicknameBot} ha votado correctamente a ${nicknameObjetivo}`
    );
  } catch (error) {
    console.error("Error en votarYHablarBot:", error);
  }
};
