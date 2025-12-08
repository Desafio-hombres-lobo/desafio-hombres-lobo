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
  renderizarCartaNiña,
  renderizarCartaVidente,
  renderizarCartaBruja,
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
import { voltearCartaPersonaje } from "../../Personajes/ts/voltearCartaPersonaje";
import { votarYHablarBotLobo } from "../../providers/votos/obtenerVotoBotsLobo";
import { obtenerDatosJugadoresPartida } from "../../providers/obtenerDatosJugadores";
import type { Jugador } from "./Jugador";
import { ganarPartida } from "../../providers/finalPartida/enviarDatosFinalPartida";
import { perderPartida } from "../../providers/finalPartida/enviarDatosFinalPartida";
import { finalizarPartida } from "../../providers/finalPartida/cambiarEstadoPartidaFinalizada";
import { verChatLobos } from "./funcionNinia";
import {
  ROL_ALDEANO,
  ROL_BRUJA,
  ROL_LOBO,
  ROL_NINIA,
} from "../../Personajes/ts/constantes_roles";
import { eliminarJugador } from "../../providers/RolBruja/enviarDatosEliminar";
import { revivirJugador } from "../../providers/RolBruja/enviarDatosRevivir";

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

let niñaEscuchando = false;
let temporizador: number | null = null;
let dia: boolean = true;
let host = false;
let chatLobosInicializado = false;
let jugadores: Jugador[] = [];
let yaHasVotado = false;
let muerto = false;
let ronda = 0;
let rondaFinalizada = false;
let votos = 0;
let lobo = false;
let miRolId: any = null;
let lobos: Jugador[] = [];
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
let brujaViva = false;
let pocionEliminar = true;
let pocionRevivir = true;


let brujaResolvio = false;

async function actualizarListas() {
  jugadores = await obtenerDatosJugadoresPartida(id_partida);
  vivos = jugadores.filter((j) => j.estado !== 0);
  muertos = jugadores.filter((j) => j.estado === 0);

  lobos = vivos.filter((j) => j.id_personaje === ROL_LOBO);
  aldeanos = vivos.filter((j) => j.id_personaje === ROL_ALDEANO);
  lobos = vivos.filter((j) => j.id_personaje === 2);
  aldeanos = vivos.filter((j) => j.id_personaje === 1);
  vidente = vivos.filter((j) => j.id_personaje === 3);

  bots = vivos.filter((j) => j.bot);
  humanos = vivos.filter((j) => !j.bot);

  botsLobo = bots.filter((j) => j.id_personaje === ROL_LOBO);

  aliados = vivos.filter((j) => j.id_personaje !== ROL_LOBO);
  if (muertos.some((j) => j.nickname === miNickname)) {
    muerto = true;
    if (!chatLobosInicializado) {
      chatLobos(lobos);
      chatLobosInicializado = true;
    }
  }

  aliadosTotales = jugadores.filter((j) => j.id_personaje !== ROL_LOBO);
  lobosTotales = jugadores.filter((j) => j.id_personaje == ROL_LOBO);
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
const miNickname = getJugador()!;
const jugadorActual = await obtenerJugadorActual();
const idJugador = jugadorActual.datos?.id;

actualizarListas();

host = await verificarHost(id_partida);
if (host) {
  btnIniciar.classList.remove("oculto");
}

const repartirCartasJugadores = async (): Promise<void> => {
  miRolId = await obtenerRolPersonajeJugador();
  await actualizarListas();
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
      if (miRolId == ROL_LOBO) {
        lobo = true;
        await renderizarCartaLobo(slotDiv, miNickname);
        await chatLobos(lobos);
      } else if (miRolId === ROL_ALDEANO) {
        await renderizarCartaAldeano(slotDiv, miNickname);
      } else if (miRolId === ROL_NINIA) {
        await renderizarCartaNiña(slotDiv, miNickname);
      } else if (miRolId === 3) {
        await renderizarCartaVidente(slotDiv, miNickname);
      } else if(miRolId === ROL_BRUJA){
        await renderizarCartaBruja(slotDiv, miNickname)
      }}else {
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
        dia: dia,
        idPersonaje: miRolId,
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
  const btnNiña = document.getElementById("btn-niña")! as HTMLInputElement;
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
    btnNiña.classList.add("oculto");
    if (!muerto) {
      inputMensaje.disabled = false;
      inputMensaje.placeholder = "Escribe en la aldea...";
    }
  } else {
    if (miRolId === ROL_NINIA && !muerto) {
      btnNiña.classList.remove("oculto");

      if (!niñaEscuchando) {
        verChatLobos(btnNiña, listaMensajes); // se puede agregar al boton un .onclick que sobreescribe lo anterior, por si acaso voy con lo que sabemos hacer// btnNiña.onclick = function()
        niñaEscuchando = true;
      }
    }
    spanFase.innerHTML = "FASE: NOCHE";
    headerChat.innerHTML = "CHAT DE LOS LOBOS";
    centroInfo.classList.remove("fase-dia");
    centroInfo.classList.add("fase-noche");
    if (!lobo && !muerto) {
      listaMensajes.classList.add("chat-noche");
      inputMensaje.disabled = true;
      inputMensaje.placeholder = "Solo los lobos pueden hablar de noche.";
    } else {
      listaMensajes.classList.remove("chat-noche");
    }
    if (lobo && !muerto) {
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
  brujaViva = vivos.some(j => j.id_personaje === ROL_BRUJA && !j.bot);

  console.log('Hemos llegado a este punto, brujaViva=', brujaViva);
  console.log(dia)
  if (brujaViva && !dia) {
    const cartaVictima = document.querySelector(`[data-id="${data.idEliminado}"]`) as HTMLElement | null;

    pintarMensajeSistema('La bruja está mezclando sus pociones');

    const res = await mostrarOpcionesBruja(
      data.idEliminado,
      data.eliminado,
      cartaVictima
    );

    if (res.accion === 'revivir') {
      brujaResolvio = true;

      mostrarVotacion(`¡La Bruja ha revivido a ${data.eliminado}!`);

      setTimeout(async () => {
        cerrarVotacion();
        if (host) {
          await cambiarFasePartida(id_partida, !dia);
        }
      }, 3000);

      return;
    }
    if (res.accion === 'matar') {
      brujaResolvio = true;

      if (data.resultado === "eliminado") {
        mostrarVotacion(`¡${data.eliminado} ha sido eliminado por los Lobos!`);
        if (data.idPersonaje) {
          await voltearCartaPersonaje(data.eliminado, data.idPersonaje);
        }
      } else {
        mostrarVotacion("¡Empate! Nadie ha sido eliminado por los Lobos.");
      }
      if (res.nombre) {
        await new Promise(r => setTimeout(r, 600));
        mostrarVotacion(`¡${res.nombre} ha sido eliminado por la Bruja!`);
        if (typeof res.idPersonaje !== "undefined") {
          await voltearCartaPersonaje(res.nombre, res.idPersonaje);
        }
      }

      await comprobarVictoria();

      setTimeout(async () => {
        cerrarVotacion();
        if (host) {
          await cambiarFasePartida(id_partida, !dia);
        }
      }, 3000);

      return;
    }
  }else if (data.resultado === "eliminado") {
    mostrarVotacion(`¡${data.eliminado} ha sido eliminado!`);
    await actualizarListas();

    if (data.idPersonaje) {
      await voltearCartaPersonaje(data.eliminado, data.idPersonaje);
    }
  } else if (data.resultado === "empate"){
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

canal.bind("bruja-elimina", async (data: any) => {
    brujaResolvio = true;

    mostrarVotacion(`¡${data.eliminado} ha sido eliminado!`);
    await actualizarListas();

    if (data.idPersonaje) {
        await voltearCartaPersonaje(data.eliminado, data.idPersonaje);
    }

    await comprobarVictoria();

    setTimeout(() => {
        cerrarVotacion();
    }, 3000);
});


canal.bind("bruja-revive", async (data: any) => {
    brujaResolvio = true;

    mostrarVotacion(`¡Nadie ha sido eliminado esta noche!`);

    await actualizarListas();
        setTimeout(() => {
        cerrarVotacion();
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
        rondaFinalizada = true;
        if (host && !brujaResolvio) {
          try {
            await finalizarVotacion(id_partida, ronda);
          } catch (error) {
            console.error("Error al cambiar fase por tiempo:", error);
          }
        }
        brujaResolvio = false;
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
canal.bind("iniciar-partida", async () => {
  await actualizarListas();
  await repartirCartasJugadores();
  if (host) {
    await cambiarFasePartida(id_partida, !dia);
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

export const pintarMensajeSistema = (texto: string) => {
  const div = document.createElement("div");
  div.classList.add("msg", "sistema");
  div.innerHTML = `${texto}`;
  listaMensajes.appendChild(div);
  listaMensajes.scrollTop = listaMensajes.scrollHeight;
};


type BrujaAccion = {
  accion: 'revivir' | 'matar' | 'nada';
  nombre?: string; 
  id?: number;        
  idPersonaje?: number;   
};

function mostrarOpcionesBruja(
  victimaLobos: number,
  nicknameEliminado: string,
  cartaVictima: HTMLElement | null
): Promise<BrujaAccion> {
  return new Promise(async (resolve) => {
    cerrarOpcionesBruja();
    if (!cartaVictima) {
      await new Promise(r => setTimeout(r, 50));
      cartaVictima = document.querySelector(`[data-id="${victimaLobos}"]`) as HTMLElement | null;
    }
    brujaResolvio=true;

    const nombreVictimaLobos = cartaVictima?.querySelector(".carta-titulo")?.textContent ?? "";

    if (miRolId !== ROL_BRUJA) {
      const timeoutMs = 20000;
      const timeout = window.setTimeout(() => {
        cerrarOpcionesBruja();
        resolve({ accion: 'nada' });
      }, timeoutMs);
      return;
    }
    if (victimaLobos && pocionRevivir) {
      if (nombreVictimaLobos === nicknameEliminado) {
        if (!cartaVictima?.querySelector(".btn-bruja-revivir")) {
          const btnRev = document.createElement("button");
          btnRev.className = "btn-bruja-revivir";
          btnRev.textContent = "Revivir";

          btnRev.onclick = async () => {
            try {
              brujaResolvio = true;

              await revivirJugador(id_partida, victimaLobos);
              pocionRevivir = false;
              mostrarVotacion('Nadie ha sido eliminado');
              cerrarOpcionesBruja();
              resolve({ accion: 'revivir' });
              return;
            } catch (e) {
              console.error(e);
              cerrarOpcionesBruja();
              resolve({ accion: 'nada' });
            }
          };

          cartaVictima?.appendChild(btnRev);
        }
      }
    }

    if (pocionEliminar) {
      const brujaJugador = vivos.find(j => j.id_personaje === ROL_BRUJA);
      document.querySelectorAll<HTMLElement>(".carta-rol").forEach(cartaEl => {
        const idStr = cartaEl.closest(".jugador")?.getAttribute("data-id") || cartaEl.getAttribute("data-id");
        const idTarget = idStr ? Number(idStr) : null;
        if (!idTarget) return;
        if (idTarget === victimaLobos) return;
        if (brujaJugador && idTarget === brujaJugador.id_jugador) return;
        if (cartaEl.querySelector(".btn-bruja-matar")) return;

        const btnKill = document.createElement("button");
        btnKill.className = "btn-bruja-matar";
        btnKill.textContent = "Eliminar";

        btnKill.onclick = async () => {
          try {
            brujaResolvio = true;

            await eliminarJugador(id_partida, idTarget);
            pocionEliminar = false;
            await actualizarListas();
            const victima = jugadores.find(j => j.id_jugador === idTarget);

            const nombreVictimaBruja = victima ? String(victima.nickname) : cartaEl.querySelector(".carta-titulo")?.textContent ?? "Desconocido";
            const idPersonajeVictima = victima ? victima.id_personaje : undefined;
            cerrarOpcionesBruja();
            resolve({
              accion: 'matar',
              nombre: nombreVictimaBruja,
              id: idTarget,
              idPersonaje: idPersonajeVictima
            });
            return;
          } catch (e) {
            console.error(e);
            cerrarOpcionesBruja();
            resolve({ accion: 'nada' });
          }
        };

        cartaEl.appendChild(btnKill);
      });
    }
    const timeoutMs = 20000;
    const timeout = window.setTimeout(() => {
      cerrarOpcionesBruja();
      resolve({ accion: 'nada' });
    }, timeoutMs);
  });
}




function cerrarOpcionesBruja() {
  document.querySelectorAll(".btn-bruja-revivir, .btn-bruja-matar").forEach(btn => btn.remove());
}


async function comprobarVictoria() {
  if (host) {
    if (lobos.length >= aliados.length) {
      finalizarPartida(id_partida, "lobos");
      console.log("Han ganado los lobos");
    }
    if (lobos.length === 0) {
      finalizarPartida(id_partida, "aldeanos");
    }
    console.log("Se ha comprobado la victoria?");
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