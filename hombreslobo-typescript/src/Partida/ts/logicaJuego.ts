import { votarYHablarBot } from "../../providers/votos/obtenerVotoBot";
import { votarYHablarBotLobo } from "../../providers/votos/obtenerVotoBotsLobo";
import { finalizarPartida } from "../../providers/finalPartida/cambiarEstadoPartidaFinalizada";
import { voltearCartaPorVidente } from "../../Personajes/ts/voltearCartaPersonaje";
import type { Jugador } from "./Jugador";
import { enviarAccionBruja } from "../../providers/enviarAccionBruja";

export class logicaJuego {
  private rondaGestionada: number = -1;
  public async gestionarBots(
    host: boolean,
    bots: Jugador[],
    botsLobos: Jugador[],
    idPartida: string,
    ronda: number,
    esDia: boolean
  ) {
    if (!host) return;
    if (this.rondaGestionada === ronda) {
      return;
    }

    this.rondaGestionada = ronda;
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

  public async gestionarTurnoBruja(
    soyBruja: boolean,
    estaViva: boolean,
    pocionRevivir: boolean,
    pocionMatar: boolean,
    idVictimaLobos: number,
    idPartida: string,
    ui: any
  ): Promise<void> {
    if (!soyBruja || !estaViva) return;

    return new Promise((resolve) => {
      let decidido = false;

      const finalizarTurno = async (
        accion: "revivir" | "matar" | "nada",
        objetivo: number | null
      ) => {
        if (decidido) return;
        decidido = true;

        ui.limpiarOpcionesBruja();
        ui.pintarMensajeSistema("Has tomado una decisión...");

        await enviarAccionBruja(idPartida, accion, objetivo);

        resolve();
      };

      ui.mostrarOpcionesBruja(idVictimaLobos, pocionRevivir, pocionMatar, {
        onRevivir: () => finalizarTurno("revivir", idVictimaLobos),
        onMatar: (id: number) => finalizarTurno("matar", id),
        onPasar: () => finalizarTurno("nada", null),
      });

      setTimeout(() => {
        if (!decidido) finalizarTurno("nada", null);
      }, 20000);
    });
  }

  public async comprobarVictoria(
    host: boolean,
    lobos: Jugador[],
    aliados: Jugador[],
    idPartida: string
  ): Promise<boolean> {
    if (!host) return false;

    if (lobos.length >= aliados.length) {
      await finalizarPartida(idPartida, "lobos");
      return true;
    }
    if (lobos.length === 0) {
      await finalizarPartida(idPartida, "aldeanos");
      return true;
    }
    return false;
  }
}
