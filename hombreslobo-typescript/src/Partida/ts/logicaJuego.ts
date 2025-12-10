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
    // Si no soy la bruja activa, no hago nada (el código esperará el evento)
    if (!soyBruja || !estaViva) return;

    return new Promise((resolve) => {
      let decidido = false;

      // Función que se ejecuta al pulsar cualquier botón
      const finalizarTurno = async (
        accion: "revivir" | "matar" | "nada",
        objetivo: number | null
      ) => {
        if (decidido) return;
        decidido = true;

        // 1. Limpieza visual inmediata
        ui.limpiarOpcionesBruja();
        ui.pintarMensajeSistema("Has tomado una decisión...");

        // 2. Llamada al Backend
        await enviarAccionBruja(idPartida, accion, objetivo);

        resolve();
      };

      // Mostramos los botones en la interfaz
      ui.mostrarOpcionesBruja(idVictimaLobos, pocionRevivir, pocionMatar, {
        // Callback REVIVIR: Revive a la víctima de los lobos
        onRevivir: () => finalizarTurno("revivir", idVictimaLobos),

        // Callback MATAR: Mata al jugador seleccionado (id)
        onMatar: (id: number) => finalizarTurno("matar", id),

        // Callback PASAR: No hace nada
        onPasar: () => finalizarTurno("nada", null),
      });

      // Temporizador de seguridad (20s) por si la bruja se duerme
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
