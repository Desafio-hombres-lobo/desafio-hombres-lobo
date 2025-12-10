import { estadoJuego } from "./estadoJuego";
import { interfazJuego } from "./interfazJuego";
import { logicaJuego } from "./logicaJuego";
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
import { voltearCartaPersonaje } from "../../Personajes/ts/voltearCartaPersonaje";
import { enviarAccionBruja } from "../../providers/enviarAccionBruja";
import { obtenerDatosJugadoresPartida } from "../../providers/obtenerDatosJugadores";
import { verChatLobos } from "./funcionNinia";
import {
  ROL_ALDEANO,
  ROL_BRUJA,
  ROL_LOBO,
  ROL_NINIA,
  ROL_VIDENTE,
} from "../../Personajes/ts/constantes_roles";

let temporizador: number | null = null;
//logica
export const logica = new logicaJuego();
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

let host = await verificarHost(id_partida);
if (host) {
  ui.toggleBtnIniciar(true, "Iniciar partida");
}

if (ui.btnIniciarElement) {
  ui.btnIniciarElement.addEventListener("click", async () => {
    ui.deshabilitarBtnIniciar("Iniciando...");
    await empezarPartida(id_partida);
    ui.toggleBtnIniciar(false);
  });
}

const repartirCartasJugadores = async (): Promise<void> => {
  const miRolId = await obtenerRolPersonajeJugador();
  estado.setRol(miRolId);

  // Usamos Promise.all para que todas las cartas se calculen en paralelo, del gpt
  const promesasRenderizado = estado.jugadores.map(async (jugador, i) => {
    const nombreJugador = String(jugador.nickname).trim();
    const numSlot = i + 1;
    const esMiUsuario = nombreJugador === miNickname;

    let slotDiv = ui.contenedorTablero.querySelector(
      `.slot-${numSlot}`
    ) as HTMLElement;

    if (!slotDiv) {
      slotDiv = document.createElement("div");
      slotDiv.className = `jugador slot-${numSlot}`;
      ui.contenedorTablero.appendChild(slotDiv);

      slotDiv.addEventListener("click", async () => {
        if (esMiUsuario) return;
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
          estado.yaHasVotado = false;
        }
      });
    }

    slotDiv.dataset.jugador = nombreJugador;
    slotDiv.dataset.id = jugador.id_jugador.toString();

    const jugadorEstaMuerto = jugador.estado === 0;
    const esCompiLobo = estado.soyLobo && jugador.id_personaje === ROL_LOBO;
    const deboVerCarta =
      esMiUsuario || jugadorEstaMuerto || estado.estoyMuerto || esCompiLobo;
    if (jugadorEstaMuerto) {
      slotDiv.classList.add("jugador-eliminado");
    } else {
      slotDiv.classList.remove("jugador-eliminado");
    }
    slotDiv.innerHTML = "";

    if (esMiUsuario) slotDiv.classList.add("mi-jugador");

    if (deboVerCarta && jugador.id_personaje) {
      await renderizarCartaPorId(slotDiv, nombreJugador, jugador.id_personaje);

      if (esMiUsuario && estado.soyLobo && !estado.chatLobosInicializado) {
        chatLobos().then(() => {
          estado.chatLobosInicializado = true;
        });
      }
    } else {
      renderizarReverso(slotDiv, nombreJugador);
    }
  });

  await Promise.all(promesasRenderizado);
};

function actualizarFaseVisual() {
  ui.actualizarFase(estado.dia);

  if (estado.estoyMuerto) {
    ui.configurarInputChat(false, "No puedes hablar, estás muerto.");
  } else if (estado.dia) {
    ui.configurarInputChat(true, "Escribe en la aldea...");
  } else {
    if (estado.soyLobo) {
      ui.configurarInputChat(true, "Habla con los lobos...");
    } else {
      ui.configurarInputChat(false, "Solo los lobos pueden hablar de noche.");
    }
  }

  const modoNocheActivo = !estado.dia && !estado.soyLobo;
  ui.toggleModoChatNoche(modoNocheActivo);

  if (estado.soyNinia && !estado.estoyMuerto && !estado.dia) {
    ui.toggleBotonNinia(true, () => {
      verChatLobos(ui.btnNiniaElement, ui.listaMensajesElement);
    });
  } else {
    ui.toggleBotonNinia(false);
  }

  // Reset de estados lógicos
  estado.yaHasVotado = false;
  estado.rondaFinalizada = false;
}
// const iniciarJuego = async () => {
//   const datosServidor = await obtenerDatosJugadoresPartida(id_partida);
//   estado.setJugadores(datosServidor);

//   const esHost = await verificarHost(id_partida);
//   if (esHost) {
//     ui.toggleBtnIniciar(true, "Iniciar partida");
//   }

//   await repartirCartasJugadores();
// };

//iniciarJuego(); no lo usamos porque a veces duplica cartas, aunque no deberia

const canal = pusher.subscribe("aldea" + id_partida);

canal.bind("nuevo-mensaje", (data: any) => {
  const esMio = data.usuario === estado.miNickname;
  ui.pintarMensaje(data.usuario, data.mensaje, esMio);
});

canal.bind("cambio-fase", async (data: any) => {
  estado.setJugadores(await obtenerDatosJugadoresPartida(id_partida));
  if (data.ronda) {
    estado.ronda = parseInt(data.ronda);
  } else {
    estado.ronda++; // Solo por si acaso el back falla
  }
  // --- 🔍 LOG DE DEPURACIÓN ---
  console.group("🕵️ DEBUG FASE " + (data.fase || ""));
  console.log("Total Jugadores:", estado.jugadores.length);
  console.log("Total VIVOS:", estado.vivos.length);
  console.log(
    "Lista Vivos:",
    estado.vivos.map((j) => j.nickname)
  ); // <--- Aquí verás si estás tú
  console.log("¿Estoy muerto según el sistema?:", estado.estoyMuerto);
  console.groupEnd();
  // -----------------------------
  if (data.fase === "dia") {
    estado.dia = true;
    ui.pintarMensajeSistema("La aldea despierta, es hora de debatir.");
  } else {
    estado.dia = false;
    ui.pintarMensajeSistema("Los aldeanos se duermen...");

    logica.ejecutarVidente(
      estado.soyVidente,
      estado.estoyMuerto,
      estado.vivos,
      estado.miNickname,
      (msg) => ui.pintarMensajeSistema(msg) //este callback es del que te cuento, no lo entiendo del todo
    );
  }

  logica.gestionarBots(
    host,
    estado.bots,
    estado.botsLobo,
    id_partida,
    estado.ronda,
    estado.dia
  );

  ui.ocultarTextoEspera();
  actualizarFaseVisual();
  iniciarCuentaAtras(data.tiempoFin);
});

canal.bind("voto", (data: any) => {
  if (estado.dia) {
    ui.pintarMensajeSistema(`${data.idVotante} ha votado a ${data.idVotado}`);
  }
});

canal.bind("votacion-terminada", async (data: any) => {
  const jugadoresActualizados = await obtenerDatosJugadoresPartida(id_partida);
  estado.setJugadores(jugadoresActualizados);

  if (data.resultado === "eliminado") {
    mostrarVotacion(`¡${data.eliminado} ha sido eliminado!`);
    if (data.eliminado === miNickname) {
      await repartirCartasJugadores();
      ui.pintarMensajeSistema(
        "Has muerto. Ahora puedes ver la verdad de la aldea..."
      );
    }
    if (data.idPersonaje) {
      await voltearCartaPersonaje(data.eliminado, data.idPersonaje);
    }
  } else {
    mostrarVotacion("¡Empate! Nadie ha sido eliminado.");
  }

  if (!estado.dia) {
    await new Promise((r) => setTimeout(r, 2000));
    cerrarVotacion();
    ui.pintarMensajeSistema("La Bruja está actuando...");
    const bruja = estado.jugadores.find((j) => j.id_personaje === ROL_BRUJA);
    const brujaViva = bruja && bruja.estado !== 0;
    if (estado.soyBruja && !estado.estoyMuerto) {
      const idVictima = data.idEliminado ? parseInt(data.idEliminado) : 0;

      await logica.gestionarTurnoBruja(
        true,
        true,
        estado.pocionRevivir,
        estado.pocionMatar,
        idVictima,
        id_partida,
        ui
      );
    } else if (host) {
      // Si es Bot o no está viva, simplemente pasamos turno (acción: "nada")
      if ((brujaViva && bruja?.bot) || !brujaViva) {
        setTimeout(async () => {
          await enviarAccionBruja(id_partida, "nada", null);
        }, 2000);
      }
    }

    if (host) {
      setTimeout(async () => {
        if (!estado.dia) {
          const jugadoresActualizados = await obtenerDatosJugadoresPartida(
            id_partida
          );
          estado.setJugadores(jugadoresActualizados);
          await logica.comprobarVictoria(
            host,
            estado.lobos,
            estado.aliados,
            id_partida
          );
          await cambiarFasePartida(id_partida, !estado.dia);
        }
      }, 10000);
    }

    return;
  }

  const partidaTerminada = await logica.comprobarVictoria(
    host,
    estado.lobos,
    estado.aliados,
    id_partida
  );

  if (!partidaTerminada) {
    setTimeout(async () => {
      cerrarVotacion();
      if (host) {
        await cambiarFasePartida(id_partida, !estado.dia);
      }
    }, 3000);
  }
});

canal.bind("fin-partida", async (data: any) => {
  const miRol = await obtenerRolPersonajeJugador();
  const textoTitulo = `¡HAN GANADO LOS ${data.equipo.toUpperCase()}!`;
  let divFinal = ui.mostrarFinPartida(textoTitulo);
  let h2 = document.createElement("h2");

  if (miRol === ROL_LOBO) {
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
        ui.actualizarReloj('<i class="fas fa-clock"></i> 00:00');
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
    ui.actualizarReloj(`<i class="fas fa-clock"></i> ${minStr}:${segStr}`);
  }, 1000);
};

ui.formChat.addEventListener("submit", async (e) => {
  e.preventDefault();
  const mensaje = ui.mensajeInput;
  if (!mensaje) return;
  ui.limpiarInput();

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

const renderizarCartaPorId = async (
  div: HTMLElement,
  nickname: string,
  idPersonaje: number
) => {
  switch (idPersonaje) {
    case ROL_LOBO:
      await renderizarCartaLobo(div, nickname);
      break;
    case ROL_ALDEANO:
      await renderizarCartaAldeano(div, nickname);
      break;
    case ROL_VIDENTE:
      await renderizarCartaVidente(div, nickname);
      break;
    case ROL_NINIA:
      await renderizarCartaNiña(div, nickname);
      break;
    case ROL_BRUJA:
      await renderizarCartaBruja(div, nickname);
      break;
    default:
      renderizarReverso(div, nickname);
      break;
  }
};

canal.bind("bruja-accion", async (data: any) => {
  console.log("🧙‍♀️ Acción de Bruja recibida:", data);

  // 1. Limpieza de seguridad de la UI
  if (estado.soyBruja) {
    ui.limpiarOpcionesBruja();
    // Gastar pociones visualmente
    if (data.tipoAccion === "revivir") estado.pocionRevivir = false;
    if (data.tipoAccion === "matar") estado.pocionMatar = false;
  }

  // 2. ACTUALIZACIÓN CRÍTICA DE DATOS
  // Pedimos al servidor la lista OFICIAL de vivos/muertos tras la magia
  const nuevosDatos = await obtenerDatosJugadoresPartida(id_partida);
  estado.setJugadores(nuevosDatos);

  // --- LOGS DE DEBUG (Míralos en consola para ver si las cuentas salen) ---
  console.log(
    "📊 Estado tras Bruja -> Lobos:",
    estado.lobos.length,
    "Aldeanos:",
    estado.aliados.length
  );

  // 3. Feedback Visual
  if (data.tipoAccion === "revivir") {
    ui.pintarMensajeSistema(
      "¡Milagro! La Bruja ha usado su magia para revivir a alguien."
    );
    // Repintamos para quitar el gris (gracias al fix del paso 1)
    await repartirCartasJugadores();
  } else if (data.tipoAccion === "matar") {
    ui.pintarMensajeSistema(
      "Se escucha un grito agónico... La Bruja ha cobrado una vida."
    );
    if (data.idObjetivo) {
      const idVictima = parseInt(data.idObjetivo);
      const victima = estado.jugadores.find((j) => j.id_jugador === idVictima);
      if (victima?.id_personaje) {
        await voltearCartaPersonaje(victima.nickname, data.idObjetivo);
      }

      // Marcamos visualmente al nuevo muerto sin recargar todo
      const slotMuerto = ui.contenedorTablero.querySelector(
        `[data-id="${idVictima}"]`
      );
      if (slotMuerto) slotMuerto.classList.add("jugador-eliminado");
    }
  } else {
    ui.pintarMensajeSistema(
      "🌙 La noche continúa en silencio. La Bruja no ha actuado."
    );
  }
});
