import { votarYHablarBot } from "../../providers/votos/obtenerVotoBot";
import { votarYHablarBotLobo } from "../../providers/votos/obtenerVotoBotsLobo";
import { finalizarPartida } from "../../providers/finalPartida/cambiarEstadoPartidaFinalizada";
import { voltearCartaPorVidente } from "../../Personajes/ts/voltearCartaPersonaje";
import type { Jugador } from "./Jugador";

export class logicaJuego {
  // --- LÓGICA DE BOTS ---

  public async gestionarBots(
    host: boolean,
    bots: Jugador[],
    botsLobos: Jugador[],
    idPartida: string,
    ronda: number,
    esDia: boolean
  ) {
    if (!host) return;

    if (esDia) {
      for (const bot of bots) {
        setTimeout(() => {
          votarYHablarBot(idPartida, bot.id_jugador, ronda, esDia);
        }, Math.random() * 3000 + 1000);
      }
    } else {
      for (const bot of botsLobos) {
        setTimeout(() => {
          votarYHablarBotLobo(idPartida, bot.id_jugador, ronda, esDia);
        }, Math.random() * 3000 + 1000);
      }
    }
  }

  public ejecutarVidente(
    soyVidente: boolean,
    estoyMuerto: boolean,
    vivos: Jugador[],
    miNickname: string,
    callbackMensaje: (msg: string) => void
  ) {
    if (soyVidente && !estoyMuerto) {
      setTimeout(() => {
        const enemigosPosibles = vivos.filter((j) => j.nickname !== miNickname);

        if (enemigosPosibles.length > 0) {
          const indiceAleatorio = Math.floor(
            Math.random() * enemigosPosibles.length
          );
          const objetivo = enemigosPosibles[indiceAleatorio];

          callbackMensaje(
            `Tu bola de cristal te revela la identidad de ${objetivo.nickname}...`
          );
          voltearCartaPorVidente(objetivo.nickname, objetivo.id_personaje);
        }
      }, 4000);
    }
  }

  public async comprobarVictoria(
    host: boolean,
    lobos: Jugador[],
    aliados: Jugador[],
    idPartida: string
  ) {
    if (!host) return;

    if (lobos.length >= aliados.length) {
      await finalizarPartida(idPartida, "lobos");
    }
    if (lobos.length === 0) {
      await finalizarPartida(idPartida, "aldeanos");
    }
  }
}
