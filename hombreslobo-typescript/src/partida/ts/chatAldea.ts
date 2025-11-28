import { getJugador, getPartidaId } from "../../autenticacion/ts/auth";
import { pusher } from "./reverb";
import { enviarMensaje } from "../../providers/envioDatosChat";
import "../css/partida.css";
import "../../css/base.css";
import { cambiarFasePartida } from "../../providers/cambiarFasePartida";
import { verificarHost } from "../../providers/verificarHost";
import { obtenerJugadoresPartida } from "../../providers/obtenerJugadoresPartida";

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

let temporizador: number | null = null;
let dia: boolean = true;
let host = false;
let jugadores = [];

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
  } else {
    spanFase.innerHTML = "FASE: NOCHE";
    headerChat.innerHTML = "CHAT DE LOS LOBOS";
    centroInfo.classList.remove("fase-dia");
    centroInfo.classList.add("fase-noche");
  }
}

const canal = pusher.subscribe("aldea" + partida_id);

canal.bind("nuevo-mensaje", (data: any) => {
  pintarMensaje(data.usuario, data.mensaje);
});

canal.bind("cambio-fase", (data: any) => {
  if (data.fase === "dia") {
    dia = true;
  } else {
    dia = false;
  }
  if (textoEspera) {
    textoEspera.classList.add("oculto");
  }
  actualizarFaseVisual();
  iniciarCuentaAtras(data.tiempoFin);
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
        reloj.innerHTML = '<i class="fas fa-clock"></i> 00:00';
        if (host) {
          try {
            await cambiarFasePartida(partida_id, !dia);
          } catch (error) {
            console.error();
          }
        }
      }
    }

    // Cálculos matemáticos
    const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

    // Formato con ceros a la izquierda (02:05)
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
    //placeholder, lo haremos con el reverb
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
    await enviarMensaje(mensaje, partida_id);
  } catch {
    alert("Error");
  }
});

if (btnIniciar) {
  btnIniciar.addEventListener("click", async () => {
    btnIniciar.disabled = true;
    btnIniciar.innerText = "Iniciando...";

    try {
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
