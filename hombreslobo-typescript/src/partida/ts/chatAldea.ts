import { getJugador, getPartidaId } from "../../autenticacion/ts/auth";
import { getJSONHeaders } from "../../autenticacion/ts/header";
import { construirApi } from "../../autenticacion/ts/apiFetch";
import { pusher } from "./reverb";
import { enviarMensaje } from "../../providers/envioDatosChat";
import "../css/partida.css";
import "../../css/base.css";
import { cambiarFasePartida } from "../../providers/cambiarFasePartida";
import { verificarHost } from "../../providers/verificarHost";
import { obtenerJugadoresPartida } from "../../providers/obtenerJugadoresPartida";
import {
  renderizarCartaLobo,
  renderizarCartaAldeano,
  renderizarReverso,
  renderizarCartaVidente,
} from "../../Personajes/ts/crearCartaPersonaje";
import { obtenerRolPersonajeJugador } from "../../providers/obtenerRolJugador";
import { chatLobos } from "./chatLobos";
import { enviarMensajeLobos } from "../../providers/envioDatosChatLobos";
import { votar } from "../../providers/votos/enviarDatosVoto";
import { obtenerJugadorActual } from "../../providers/obtenerJugadorActual";
import { cerrarVotacion, mostrarVotacion } from "./votacion";
import { finalizarVotacion } from "../../providers/votos/finalizarVotacion";
import { votarYHablarBot } from "../../providers/votos/obtenerVotoBot";
import { voltearCartaPersonaje } from "../../Personajes/ts/voltearCartaPersonaje";
import { votarYHablarBotLobo } from "../../providers/votos/obtenerVotoBotsLobo";
import { obtenerDatosJugadoresPartida } from "../../providers/obtenerDatosJugadores";
import type { Jugador } from "./Jugador";
import { ganarPartida } from "../../providers/finalPartida/enviarDatosFinalPartida";
import { perderPartida } from "../../providers/finalPartida/enviarDatosFinalPartida";
import { finalizarPartida } from "../../providers/finalPartida/cambiarEstadoPartidaFinalizada";

const btnEnviar = document.getElementById("btn-enviar")! as HTMLButtonElement;
const listaMensajes = document.getElementById("lista-mensajes")!;
export const formChat = document.getElementById("form-chat") as HTMLFormElement;
export const inputMensaje = document.getElementById(
  "input-mensaje"
) as HTMLInputElement;
const centroInfo = document.querySelector(".centro-info") as HTMLElement;
const spanFase = document.getElementById("fase-partida")!;
const headerChat = document.getElementById("h3-chat")!;
const reloj = document.getElementById("reloj-partida")!;
const btnIniciar = document.getElementById("btn-iniciar")! as HTMLButtonElement;
const id_partida = getPartidaId()!;
const textoEspera = document.getElementById("texto-espera")!;
const contenedorCarta = document.querySelector(".grid-tablero") as HTMLElement;

let temporizador: number | null = null;
let dia: boolean = true;
let host = false;

export let jugadores: Jugador[] = [];
let yaHasVotado = false;
let muerto = false;
let ronda = 0;
let rondaFinalizada = false;
let votos = 0;
let lobo = false;

export let lobos: Jugador[] = [];
let aldeanos: Jugador[] = [];
let vivos: Jugador[] = [];
let muertos: Jugador[] = [];
let bots: Jugador[] = [];
let humanos: Jugador[] = [];
let botsLobo: Jugador[] = [];
let aliados: Jugador[] = [];
let aliadosTotales: Jugador[] = [];
let lobosTotales: Jugador[] = [];
let vidente: Jugador[] = [];

async function actualizarListas() {
  jugadores = await obtenerDatosJugadoresPartida(id_partida);
  vivos = jugadores.filter((j) => j.estado !== 0);
  muertos = jugadores.filter((j) => j.estado === 0);

  lobos = vivos.filter((j) => j.id_personaje === 2);
  aldeanos = vivos.filter((j) => j.id_personaje === 1);
  vidente = vivos.filter((j) => j.id_personaje === 3);

  bots = vivos.filter((j) => j.bot);
  humanos = vivos.filter((j) => !j.bot);

  botsLobo = bots.filter((j) => j.id_personaje === 2);

  aliados = vivos.filter((j) => j.id_personaje !== 2);
  if (miNickname in muertos) {
    muerto = true;
  }

  aliadosTotales = jugadores.filter((j) => j.id_personaje !== 2);
  lobosTotales = jugadores.filter((j) => j.id_personaje == 2);
  console.log(
    "vivos",
    vivos,
    "muertos,",
    muertos,
    "lobos",
    lobos,
    "aldeanos",
    aldeanos,
    "vidente",
    vidente,
    "bots",
    bots,
    "humanos",
    humanos,
    "botsLobo",
    botsLobo,
    "aliados",
    aliados
  );
}

const datosJugadoresPartida = await obtenerJugadoresPartida(id_partida);
const numeroJugadoresPartida = datosJugadoresPartida.jugadoresActuales;
if (Array.isArray(datosJugadoresPartida)) {
  jugadores = datosJugadoresPartida as Jugador[];
  console.log(
    "Lista de jugadores cargada (snapshot):",
    JSON.stringify(jugadores)
  );
} else {
  console.warn("No se pudieron obtener jugadores: respuesta vacía o inválida");
  jugadores = [];
}

const miNickname = getJugador()!;
const jugadorActual = await obtenerJugadorActual();
const idJugador = jugadorActual.datos?.id;

actualizarListas();

host = await verificarHost(id_partida);
if (host) {
  btnIniciar.classList.remove("oculto");
}

const repartirCartasJugadores = async (
  numeroJugadoresPartida: number
): Promise<void> => {
  const miRolId = await obtenerRolPersonajeJugador();
  actualizarListas();
  for (let i = 0; i < jugadores.length; i++) {
    const jugador = jugadores[i];
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
      if (miRolId == 2) {
        lobo = true;
        await renderizarCartaLobo(slotDiv, miNickname);
        await chatLobos(jugadores, lobos);
      } else if (miRolId === 1) {
        await renderizarCartaAldeano(slotDiv, miNickname);
      } else if (miRolId === 3) {
        await renderizarCartaVidente(slotDiv, miNickname);
      } else {
        renderizarReverso(slotDiv, nombreJugador);
      }
    } else {
      renderizarReverso(slotDiv, nombreJugador);
    }

    slotDiv.addEventListener("click", async () => {
      if (esMiUsuario) return;
      // Votar si es de día, o si es de noche y soy lobo
      if (!dia && !lobo) return;

      if (yaHasVotado) return;
      if (muerto) return;
      const idVotado = parseInt(slotDiv.dataset.id!);
      const payload = {
        id_jugador: idJugador,
        id_jugador_votado: idVotado,
        ronda,
        fase: dia,
      };

      const resultado = await votar(id_partida, payload);
      yaHasVotado = true;
      if (!resultado.ok) {
        alert(`Error al votar: ${resultado.error}`);
      }
    });

    contenedorCarta.appendChild(slotDiv);
  }
};

function actualizarFaseVisual() {
  if (muerto) {
    inputMensaje.disabled = true;
    inputMensaje.placeholder = "No puedes hablar, estás muerto.";
  }
  if (dia) {
    spanFase.innerHTML = "FASE: DÍA";
    headerChat.innerHTML = "CHAT DE LA ALDEA";
    centroInfo.classList.remove("fase-noche");
    centroInfo.classList.add("fase-dia");
    listaMensajes.classList.remove("chat-noche");
    if (!muerto) {
      inputMensaje.disabled = false;
      inputMensaje.placeholder = "Escribe en la aldea...";
    }
  } else {
    spanFase.innerHTML = "FASE: NOCHE";
    headerChat.innerHTML = "CHAT DE LOS LOBOS";
    centroInfo.classList.remove("fase-dia");
    centroInfo.classList.add("fase-noche");
    if (!lobo) {
      listaMensajes.classList.add("chat-noche");
      inputMensaje.disabled = true;
      inputMensaje.placeholder = "Solo los lobos pueden hablar de noche.";
    } else if (!muerto) {
      inputMensaje.disabled = false;
      inputMensaje.placeholder = "Habla con los lobos...";
    }
  }
  yaHasVotado = false;
  rondaFinalizada = false;
  ronda++;
}

const canal = pusher.subscribe("aldea" + id_partida);

canal.bind("nuevo-mensaje", (data: any) => {
  pintarMensaje(data.usuario, data.mensaje);
});

canal.bind("cambio-fase", async (data: any) => {
  actualizarListas();

  if (data.fase === "dia") {
    dia = true;
    pintarMensajeSistema("La aldea despierta, es hora de debatir.");
    if (host) {
      for (const bot of bots) {
        setTimeout(() => {
          votarYHablarBot(id_partida, bot.id_jugador, ronda, dia);
        }, Math.random() * 3000 + 1000);
      }
    }
  } else {
    dia = false;
    pintarMensajeSistema("Los aldeanos se duermen...");
    if (host) {
      for (const bot of botsLobo) {
        setTimeout(() => {
          votarYHablarBotLobo(id_partida, bot.id_jugador, ronda, dia);
        }, Math.random() * 3000 + 1000);
      }
    }
  }

  const cartaYaRepartida = contenedorCarta.querySelector(".carta-rol");
  if (!cartaYaRepartida) {
    await repartirCartasJugadores(numeroJugadoresPartida);
  }

  if (textoEspera) {
    textoEspera.classList.add("oculto");
  }
  actualizarFaseVisual();
  iniciarCuentaAtras(data.tiempoFin);
});

canal.bind("voto", (data: any) => {
  if (!dia) return;
  pintarMensajeSistema(`${data.idVotante} ha votado a ${data.idVotado}`);
  votos++;
});

canal.bind("votacion-terminada", async (data: any) => {
  if (data.resultado === "eliminado") {
    mostrarVotacion(`¡${data.eliminado} ha sido eliminado!`);
    actualizarListas();

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
      await cambiarFasePartida(id_partida, !dia);
    }
  }, 3000);
});

canal.bind("fin-partida", async (data: any) => {
  const miRol = await obtenerRolPersonajeJugador();
  mostrarFinPartida(data.equipo);
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

  setTimeout((window.location.href = "/"), 3500);
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
        rondaFinalizada = true;
        if (host) {
          try {
            await finalizarVotacion(id_partida, ronda);
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
  const mensaje = inputMensaje.value.trim();
  if (!mensaje) return;
  inputMensaje.value = "";

  if (mensaje === "/cambiar") {
    if (host) {
      try {
        await finalizarVotacion(id_partida, ronda);
        await cambiarFasePartida(id_partida, !dia);
        ronda++;
        return;
      } catch (e) {
        console.error("Error al cambiar fase manual:", e);
      }
    }
  }
  try {
    if (!dia && lobo && !muerto) {
      await enviarMensajeLobos(mensaje, id_partida);
    } else {
      if (!muerto) await enviarMensaje(mensaje, id_partida);
    }
  } catch {
    alert("Error");
  }
});

if (btnIniciar) {
  btnIniciar.addEventListener("click", async () => {
    btnIniciar.disabled = true;
    btnIniciar.innerText = "Iniciando...";
    try {
      const headers = getJSONHeaders();
      const response = await fetch(construirApi(`/${id_partida}/iniciar`), {
        method: "POST",
        headers: headers,
      });
      if (!response.ok) throw new Error("Error al iniciar en servidor");

      await repartirCartasJugadores(numeroJugadoresPartida);
      await cambiarFasePartida(id_partida, !dia);
      const jugadoresResp = await obtenerDatosJugadoresPartida(id_partida);
      if (Array.isArray(jugadoresResp)) {
        jugadores = jugadoresResp as Jugador[];
        console.log(
          "Lista de jugadores cargada (snapshot):",
          JSON.stringify(jugadores)
        );
      } else {
        console.warn(
          "No se pudieron obtener jugadores: respuesta vacía o inválida"
        );
        jugadores = [];
      }
      btnIniciar.classList.add("oculto");
    } catch (error) {
      console.error("Error al iniciar partida:", error);
      btnIniciar.disabled = false;
      btnIniciar.innerText = "EMPEZAR PARTIDA";
    }
  });
}

export function pintarMensaje(usuario: string, texto: string) {
  const div = document.createElement("div");
  const miUsuario = getJugador();
  const yo = usuario === miUsuario;

  div.classList.add("msg");
  if (yo) {
    div.classList.add("propio");
    div.innerHTML = `<strong>Tú:</strong> ${texto}`;
  } else {
    div.innerHTML = `<strong>${usuario}:</strong> ${texto}`;
  }

  listaMensajes.appendChild(div);
  listaMensajes.scrollTop = listaMensajes.scrollHeight;
}

function pintarMensajeSistema(texto: string) {
  const div = document.createElement("div");
  div.classList.add("msg", "sistema");
  div.innerHTML = `${texto}`;
  listaMensajes.appendChild(div);
  listaMensajes.scrollTop = listaMensajes.scrollHeight;
}

async function comprobarVictoria() {
  if (host) {
    if (lobos.length >= aliados.length) {
      lobosTotales.forEach((lobo) => {
        ganarPartida(id_partida, lobo.id_jugador);
      });
      aliadosTotales.forEach((aliado) => {
        perderPartida(id_partida, aliado.id_jugador);
      });
      finalizarPartida(id_partida, "lobos");
      console.log("Han ganado los lobos");
    }
    if (lobos.length === 0) {
      lobosTotales.forEach((lobo) => {
        perderPartida(id_partida, lobo.id_jugador);
      });
      aliadosTotales.forEach((aliado) => {
        ganarPartida(id_partida, aliado.id_jugador);
      });
      console.log("Han ganado los aldeanos");
      finalizarPartida(id_partida, "aldeanos");
    }
  }
  console.log("Se ha comprobado la victoria?");

  return false;
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
