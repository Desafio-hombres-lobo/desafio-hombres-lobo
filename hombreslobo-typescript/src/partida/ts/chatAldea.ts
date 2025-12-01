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
} from "../../Personajes/ts/crearCartaPersonaje";
import { obtenerRolPersonajeJugador } from "../../providers/obtenerRolJugador";
import { chatLobos } from "./chatLobos";
import { enviarMensajeLobos } from "../../providers/envioDatosChatLobos";
import { votar } from "../../providers/votos/enviarDatosVoto";
import { obtenerJugadorActual } from "../../providers/obtenerJugadorActual";
import { cerrarVotacion, mostrarVotacion } from "./votacion";
import { finalizarVotacion } from "../../providers/votos/finalizarVotacion";

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
const partida_id = getPartidaId()!;
const textoEspera = document.getElementById("texto-espera")!;
const contenedorCarta = document.querySelector(".grid-tablero") as HTMLElement;

let temporizador: number | null = null;
let dia: boolean = true;
let host = false;
let jugadores = [];

let ronda = 0;
let rondaFinalizada = false;
let votos = 0;
let lobo = false;

const datosJugadoresPartida = await obtenerJugadoresPartida(partida_id);
const listaJugadores = datosJugadoresPartida.listaJugadores;
const numeroJugadoresPartida = datosJugadoresPartida.jugadoresActuales;
const miNickname = getJugador();
const jugadorActual = await obtenerJugadorActual();
const idJugador = jugadorActual.datos?.id;

const repartirCartasJugadores = async (
  numeroJugadoresPartida: number
): Promise<void> => {
  const miRolId = await obtenerRolPersonajeJugador();

  for (let i = 0; i < listaJugadores.length; i++) {
    const jugador = listaJugadores[i];
    const nombreJugador = String(jugador.nickname).trim();
    const numSlot = i + 1;
    const idJugadorCarta = jugador.id;

    const slotDiv = document.createElement("div");
    slotDiv.className = `jugador slot-${numSlot}`;
    slotDiv.dataset.jugador = nombreJugador;
    slotDiv.dataset.id = idJugadorCarta.toString();

    const esMiUsuario = nombreJugador === miNickname;

    if (esMiUsuario) {
      slotDiv.classList.add("mi-jugador");
      if (miRolId === 2) {
        lobo = true;
        await renderizarCartaLobo(slotDiv);
        await chatLobos();
      } else if (miRolId === 1) {
        await renderizarCartaAldeano(slotDiv);
      } else {
        renderizarReverso(slotDiv, nombreJugador);
      }
    } else {
      renderizarReverso(slotDiv, nombreJugador);
    }

    slotDiv.addEventListener("click", async () => {
      if (!dia) return;
      const idVotado = parseInt(slotDiv.dataset.id!);
      const payload = {
        id_jugador: idJugador,
        id_jugador_votado: idVotado,
        ronda,
      };

      const resultado = await votar(partida_id, payload);
      if (!resultado.ok) {
        alert(`Error al votar: ${resultado.error}`);
      }
    });

    contenedorCarta.appendChild(slotDiv);
  }
};

//Se ejecuta nada más cargar el script, del que te cuento
(async () => {
  host = await verificarHost(partida_id);
  if (host) {
    btnIniciar.classList.remove("oculto");
  }
})();

(async () => {
  const lista = await obtenerJugadoresPartida(partida_id);
  jugadores = lista.listaJugadores;
})();

function actualizarFaseVisual() {
  if (dia) {
    spanFase.innerHTML = "FASE: DÍA";
    headerChat.innerHTML = "CHAT DE LA ALDEA";
    centroInfo.classList.remove("fase-noche");
    centroInfo.classList.add("fase-dia");
    listaMensajes.classList.remove("chat-noche");
    inputMensaje.disabled = false;
  } else {
    spanFase.innerHTML = "FASE: NOCHE";
    headerChat.innerHTML = "CHAT DE LOS LOBOS";
    centroInfo.classList.remove("fase-dia");
    centroInfo.classList.add("fase-noche");
    if (!lobo) {
      listaMensajes.classList.add("chat-noche");
      inputMensaje.disabled = true;
    }
  }
  ronda++;
  rondaFinalizada = true;
}

const canal = pusher.subscribe("aldea" + partida_id);

canal.bind("nuevo-mensaje", (data: any) => {
  pintarMensaje(data.usuario, data.mensaje);
});

canal.bind("cambio-fase", async (data: any) => {
  if (data.fase === "dia") {
    dia = true;
    pintarMensajeSistema("La aldea despierta, es hora de debatir.");
  } else {
    dia = false;
    pintarMensajeSistema("Los aldeanos se duermen...");
  }

  // PRUEBAS
  const cartaYaRepartida = contenedorCarta.querySelector(".carta-rol");

  if (!cartaYaRepartida) {
    console.log(
      "Inicio de partida detectado desde el servidor. Repartiendo carta..."
    );
    await repartirCartasJugadores(numeroJugadoresPartida);
  }

  if (textoEspera) {
    textoEspera.classList.add("oculto");
  }
  actualizarFaseVisual();
  iniciarCuentaAtras(data.tiempoFin);
});

canal.bind("voto", (data: any) => {
  pintarMensajeSistema(`${data.idVotante} ha votado a ${data.idVotado}`);
  votos++;
  if (host && votos >= numeroJugadoresPartida) {
    setTimeout(async () => {
      await finalizarVotacion(partida_id, ronda);
      await cambiarFasePartida(partida_id, !dia);
    }, 1000);
  }
});

canal.bind("votacion-terminada", (data: any) => {
  if (data.resultado === "eliminado") {
    mostrarVotacion(`¡${data.eliminado} ha sido eliminado!`);
  } else {
    mostrarVotacion("¡Empate! Nadie ha sido eliminado.");
  }
  setTimeout(() => cerrarVotacion(), 5000);
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
        temporizador = null; // Importante limpiar la variable
        reloj.innerHTML = '<i class="fas fa-clock"></i> 00:00';
        rondaFinalizada = true;

        // --- CORRECCIÓN AQUÍ ---
        // Si soy el HOST, yo me encargo de avisar al servidor
        if (host) {
          console.log("Tiempo agotado. Como host, cambio la fase.");
          try {
            // Opcional: Si es de día, quizás quieras cerrar votación antes
            // if (dia) await finalizarVotacion(partida_id, ronda);

            await cambiarFasePartida(partida_id, !dia);
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
        await cambiarFasePartida(partida_id, !dia);
        return;
      } catch {
        console.error;
      }
    }
  }
  try {
    if (!dia && lobo) {
      await enviarMensajeLobos(mensaje, partida_id);
    } else {
      await enviarMensaje(mensaje, partida_id);
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
      const response = await fetch(construirApi(`/${partida_id}/iniciar`), {
        method: "POST",
        headers: headers,
      });

      if (!response.ok) throw new Error("Error al iniciar en servidor");

      // El host se reparte la carta a sí mismo inmediatamente
      await repartirCartasJugadores(numeroJugadoresPartida);

      await cambiarFasePartida(partida_id, !dia);
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
  //Autoscroll
  listaMensajes.scrollTop = listaMensajes.scrollHeight;
}

function pintarMensajeSistema(texto: string) {
  const div = document.createElement("div");

  div.classList.add("msg", "sistema");

  div.innerHTML = `${texto}`;

  listaMensajes.appendChild(div);

  // Autoscroll
  listaMensajes.scrollTop = listaMensajes.scrollHeight;
}
