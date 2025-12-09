import { estadoJuego } from "./estadoJuego";
import { interfazJuego } from "./interfazJuego";
import { getJugador, getPartidaId } from "../../autenticacion/ts/auth";
import { pusher } from "./reverb";
import { enviarMensaje } from "../../providers/envioDatosChat";
import "../css/partida.css";
import "../../css/base.css";
import { cambiarFasePartida } from "../../providers/cambiarFasePartida";
import { verificarHost } from "../../providers/verificarHost";
import {
  renderizarCartaLobo,
  renderizarCartaAldeano,
  renderizarReverso,
  renderizarCartaVidente,
  renderizarCartaNiña,
} from "../../Personajes/ts/crearCartaPersonaje";
import { empezarPartida } from "../../providers/empezarPartida";
import { obtenerRolPersonajeJugador } from "../../providers/obtenerRolJugador";
import { chatLobos } from "./chatLobos";
import { enviarMensajeLobos } from "../../providers/envioDatosChatLobos";
import { votar } from "../../providers/votos/enviarDatosVoto";
import { obtenerJugadorActual } from "../../providers/obtenerJugadorActual";
import { cerrarVotacion, mostrarVotacion } from "./votacion";
import { finalizarVotacion } from "../../providers/votos/finalizarVotacion";
import { votarYHablarBot } from "../../providers/votos/obtenerVotoBot";
import {
  voltearCartaPersonaje,
  voltearCartaPorVidente,
} from "../../Personajes/ts/voltearCartaPersonaje";
import { votarYHablarBotLobo } from "../../providers/votos/obtenerVotoBotsLobo";
import { obtenerDatosJugadoresPartida } from "../../providers/obtenerDatosJugadores";
import type { Jugador } from "./Jugador";
import { finalizarPartida } from "../../providers/finalPartida/cambiarEstadoPartidaFinalizada";
import { verChatLobos } from "./funcionNinia";
import {
  ROL_ALDEANO,
  ROL_LOBO,
  ROL_NINIA,
  ROL_VIDENTE,
} from "../../Personajes/ts/constantes_roles";

let temporizador: number | null = null;
let host = false;
//Interfaz
export const ui = new interfazJuego();
//Estado
const id_partida = getPartidaId()!;
const miNickname = getJugador()!;
export const estado = new estadoJuego(id_partida, miNickname);

const jugadorActual = await obtenerJugadorActual();
const idJugador = jugadorActual.datos?.id;
const datosServidor = await obtenerDatosJugadoresPartida(id_partida);
estado.setJugadores(datosServidor);

host = await verificarHost(id_partida);
if (host) {
  ui.toggleBtnIniciar;
}

const repartirCartasJugadores = async (): Promise<void> => {
  const miRolId = await obtenerRolPersonajeJugador();
  estado.setRol(miRolId);

  for (let i = 0; i < estado.jugadores.length; i++) {
    const jugador = estado.jugadores[i];
    const nombreJugador = String(jugador.nickname).trim();
    const numSlot = i + 1;
    const idJugadorCarta = jugador.id_jugador;

    const slotDiv = document.createElement("div");
    slotDiv.className = `jugador slot-${numSlot}`;
    slotDiv.dataset.jugador = nombreJugador;
    slotDiv.dataset.id = idJugadorCarta.toString();

    const esMiUsuario = nombreJugador === miNickname;

    if (esMiUsuario) {
      slotDiv.classList.add("mi-jugador");
      if (miRolId == ROL_LOBO) {
        await renderizarCartaLobo(slotDiv, miNickname);
        await chatLobos(estado.lobos);
      } else if (miRolId === ROL_ALDEANO) {
        await renderizarCartaAldeano(slotDiv, miNickname);
      } else if (miRolId === ROL_VIDENTE) {
        await renderizarCartaVidente(slotDiv, miNickname);
      } else if (miRolId === ROL_NINIA) {
        await renderizarCartaNiña(slotDiv, miNickname);
      } else {
        renderizarReverso(slotDiv, nombreJugador);
      }
    } else {
      renderizarReverso(slotDiv, nombreJugador);
    }

    slotDiv.addEventListener("click", async () => {
      if (esMiUsuario) return;
      // Votar si es de día, o si es de noche y soy lobo
      if (!estado.dia && !estado.soyLobo) return;
      if (estado.yaHasVotado) return;
      if (estado.estoyMuerto) return;
      const idVotado = parseInt(slotDiv.dataset.id!);
      const payload = {
        id_jugador: idJugador,
        id_jugador_votado: idVotado,
        ronda: estado.ronda,
        dia: estado.dia,
        idPersonaje: miRolId,
      };

      const resultado = await votar(id_partida, payload);
      estado.yaHasVotado = true;
      if (!resultado.ok) {
        console.log(resultado);
      }
    });
    contenedorCarta.appendChild(slotDiv);
  }
};

function actualizarFaseVisual() {
  const btnNiña = document.getElementById("btn-niña")! as HTMLInputElement;
  if (estado.estoyMuerto) {
    inputMensaje.disabled = true;
    inputMensaje.placeholder = "No puedes hablar, estás muerto.";
  }
  if (estado.dia) {
    spanFase.innerHTML = "FASE: DÍA";
    headerChat.innerHTML = "CHAT DE LA ALDEA";
    centroInfo.classList.remove("fase-noche");
    centroInfo.classList.add("fase-dia");
    listaMensajes.classList.remove("chat-noche");
    btnNiña.classList.add("oculto");
    if (!estado.estoyMuerto) {
      inputMensaje.disabled = false;
      inputMensaje.placeholder = "Escribe en la aldea...";
    }
  } else {
    if (estado.soyNinia && !estado.estoyMuerto) {
      btnNiña.classList.remove("oculto");
      btnNiña.onclick = function () {
        verChatLobos(btnNiña, listaMensajes);
      };
    }
    spanFase.innerHTML = "FASE: NOCHE";
    headerChat.innerHTML = "CHAT DE LOS LOBOS";
    centroInfo.classList.remove("fase-dia");
    centroInfo.classList.add("fase-noche");
    if (!estado.soyLobo) {
      listaMensajes.classList.add("chat-noche");
      inputMensaje.disabled = true;
      inputMensaje.placeholder = "Solo los lobos pueden hablar de noche.";
    } else {
      listaMensajes.classList.remove("chat-noche");
    }
    if (estado.soyLobo && !estado.estoyMuerto) {
      inputMensaje.disabled = false;
      inputMensaje.placeholder = "Habla con los lobos...";
    }
  }
  estado.yaHasVotado = false;
  estado.rondaFinalizada = false;
  estado.ronda++;
}

const canal = pusher.subscribe("aldea" + id_partida);

canal.bind("nuevo-mensaje", (data: any) => {
  const esMio = data.usuario === estado.miNickname;
  ui.pintarMensaje(data.usuario, data.mensaje, esMio);
});

canal.bind("cambio-fase", async (data: any) => {
  estado.setJugadores(await obtenerDatosJugadoresPartida(id_partida));

  if (data.fase === "dia") {
    estado.dia = true;
    ui.pintarMensajeSistema("La aldea despierta, es hora de debatir.");
    if (host) {
      for (const bot of estado.bots) {
        setTimeout(() => {
          votarYHablarBot(id_partida, bot.id_jugador, estado.ronda, estado.dia);
        }, Math.random() * 3000 + 1000);
      }
    }
  } else {
    estado.dia = false;
    ui.pintarMensajeSistema("Los aldeanos se duermen...");
    if (host) {
      for (const bot of estado.botsLobo) {
        setTimeout(() => {
          votarYHablarBotLobo(
            id_partida,
            bot.id_jugador,
            estado.ronda,
            estado.dia
          );
        }, Math.random() * 3000 + 1000);
      }
    }

    if (estado.soyVidente && !estado.estoyMuerto) {
      setTimeout(() => {
        const enemigosPosibles = estado.vivos.filter(
          (j) => j.nickname !== miNickname
        );

        if (enemigosPosibles.length > 0) {
          const indiceAleatorio = Math.floor(
            Math.random() * enemigosPosibles.length
          );
          const objetivo = enemigosPosibles[indiceAleatorio];

          ui.pintarMensajeSistema(
            `Tu bola de cristal te revela la identidad de ${objetivo.nickname}...`
          );
          voltearCartaPorVidente(objetivo.nickname, objetivo.id_personaje);
        }
      }, 2000);
    }
  }

  if (textoEspera) {
    textoEspera.classList.add("oculto");
  }
  actualizarFaseVisual();
  iniciarCuentaAtras(data.tiempoFin);
});
canal.bind("voto", (data: any) => {
  if (!estado.dia) return;
  ui.pintarMensajeSistema(`${data.idVotante} ha votado a ${data.idVotado}`);
  estado.votos++;
});

canal.bind("votacion-terminada", async (data: any) => {
  if (data.resultado === "eliminado") {
    mostrarVotacion(`¡${data.eliminado} ha sido eliminado!`);
    estado.setJugadores(datosServidor);

    if (data.idPersonaje) {
      await voltearCartaPersonaje(data.eliminado, data.idPersonaje);
    }
  } else {
    mostrarVotacion("¡Empate! Nadie ha sido eliminado.");
  }

  await comprobarVictoria();

  setTimeout(async () => {
    cerrarVotacion();
    if (host) {
      await cambiarFasePartida(id_partida, !estado.dia);
    }
  }, 3000);
});

canal.bind("fin-partida", async (data: any) => {
  const miRol = await obtenerRolPersonajeJugador();
  const textoTitulo = `¡HAN GANADO LOS ${data.equipo.toUpperCase()}!`;
  mostrarFinPartida(textoTitulo);
  let divFinal = document.getElementById("contenedor-final");
  let h2 = document.createElement("h2");

  if (miRol === 2) {
    if (data.equipo == "lobos") {
      h2.textContent = "¡Has ganado!";
    } else {
      h2.textContent = "¡Oh no! Perdiste";
    }
  } else {
    if (data.equipo == "aldeanos") {
      h2.textContent = "¡Has ganado!";
    } else {
      h2.textContent = "¡Oh no! Perdiste";
    }
  }

  divFinal?.appendChild(h2);

  setTimeout(() => {
    window.location.href = "/";
  }, 5000);
});

const iniciarCuentaAtras = (fechaFinIso: string) => {
  if (temporizador) {
    window.clearInterval(temporizador);
  }
  const fechaObjetivo = new Date(fechaFinIso).getTime();
  temporizador = window.setInterval(async () => {
    const ahora = new Date().getTime();
    const distancia = fechaObjetivo - ahora;

    if (distancia < 0) {
      if (temporizador) {
        window.clearInterval(temporizador);
        temporizador = null;
        reloj.innerHTML = '<i class="fas fa-clock"></i> 00:00';
        estado.rondaFinalizada = true;
        if (host) {
          try {
            await finalizarVotacion(id_partida, estado.ronda);
          } catch (error) {
            console.error("Error al cambiar fase por tiempo:", error);
          }
        }
      }
      return;
    }
    const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((distancia % (1000 * 60)) / 1000);
    const minStr = minutos < 10 ? "0" + minutos : minutos;
    const segStr = segundos < 10 ? "0" + segundos : segundos;
    reloj.innerHTML = `<i class="fas fa-clock"></i> ${minStr}:${segStr}`;
  }, 1000);
};

formChat.addEventListener("submit", async (e) => {
  e.preventDefault();
  const mensaje = ui.mensajeInput;
  if (!mensaje) return;
  ui.limpiarInput;

  if (mensaje === "/cambiar") {
    if (host) {
      try {
        await finalizarVotacion(id_partida, estado.ronda);
        await cambiarFasePartida(id_partida, !estado.dia);
        estado.ronda++;
        return;
      } catch (e) {
        console.error("Error al cambiar fase manual:", e);
      }
    }
  }
  try {
    if (!estado.dia && estado.soyLobo && !estado.estoyMuerto) {
      await enviarMensajeLobos(mensaje, id_partida);
    } else {
      if (!estado.estoyMuerto) await enviarMensaje(mensaje, id_partida);
    }
  } catch (error) {
    console.error(error);
  }
});
canal.bind("iniciar-partida", async () => {
  await repartirCartasJugadores();
  if (host) {
    await cambiarFasePartida(id_partida, !estado.dia);
  }
});

if (btnIniciar) {
  btnIniciar.addEventListener("click", async () => {
    btnIniciar.disabled = true;
    btnIniciar.innerText = "Iniciando...";
    await empezarPartida(id_partida);
    //await repartirCartasJugadores();
    //await cambiarFasePartida(id_partida, !dia);
    btnIniciar.classList.add("oculto");
  });
}

async function comprobarVictoria() {
  if (host) {
    if (estado.lobos.length >= estado.aliados.length) {
      finalizarPartida(id_partida, "lobos");
    }
    if (estado.lobos.length === 0) {
      finalizarPartida(id_partida, "aldeanos");
    }
  }
}

function mostrarFinPartida(texto: string) {
  const overlay = document.createElement("div");
  overlay.classList.add("fin-overlay");
  overlay.innerHTML = `
    <div class="fin-contenedor" id="contenedor-final">
      <h1>${texto}</h1>
    </div>
  `;
  document.body.appendChild(overlay);
}
