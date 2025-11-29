import { getJugador, getPartidaId } from "../../autenticacion/ts/auth";
import { pusher } from "./reverb";
import { enviarMensaje } from "../../providers/envioDatosChat";
import "../css/partida.css";
import "../../css/base.css";
import { cambiarFasePartida } from "../../providers/cambiarFasePartida";
import { verificarHost } from "../../providers/verificarHost";
// PRUEBAS
import { obtenerJugadoresPartida } from "../../providers/obtenerJugadoresPartida";
import {
  renderizarCartaLobo,
  renderizarCartaAldeano,
} from "../../Personajes/ts/crearCartaPersonaje";
import reversoCarta from "../../imagenes/cartas/reverso-carta.jpeg";
import { getJSONHeaders } from "../../autenticacion/ts/header";
import { construirApi } from "../../autenticacion/ts/apiFetch";

const listaMensajes = document.getElementById("lista-mensajes")!;
const formChat = document.getElementById("form-chat") as HTMLFormElement;
const inputMensaje = document.getElementById(
  "input-mensaje"
) as HTMLInputElement;
const centroInfo = document.querySelector(".centro-info") as HTMLElement;
const spanFase = document.getElementById("fase-partida")!;
const headerChat = document.getElementById("h3-chat")!;
const reloj = document.getElementById("reloj-partida")!;
const btnIniciar = document.getElementById("btn-iniciar")! as HTMLButtonElement;
const partida_id = getPartidaId()!;
const textoEspera = document.getElementById("texto-espera")!;

// RENDERIZAR CARTAS AQUÍ
const contenedorCarta = document.querySelector(".grid-tablero") as HTMLElement;

let temporizador: number | null = null;
let dia: boolean = true;
let host = false;

// PRUEBAS
const datosJugadoresPartida = await obtenerJugadoresPartida(partida_id);
const listaJugadores = datosJugadoresPartida.listaJugadores;
const numeroJugadoresPartida = datosJugadoresPartida.jugadoresActuales;
const miNickname = getJugador();

const renderizarReverso = (contenedor: HTMLElement) => {
  const divReverso = document.createElement("div");
  divReverso.className = "carta-rol carta-reverso";

  divReverso.innerHTML = `
        <div class="carta-img-container">
            <img src="${reversoCarta}" alt="reverso-carta">
        </div>
        <p class="carta-titulo">Jugador</p>
    `;

  contenedor.appendChild(divReverso);
};

const repartirCartasJugadores = async (
  numeroJugadoresPartida: number
): Promise<void> => {
  let miRolId = null;

  try {
    const headers = getJSONHeaders();
    const response = await fetch(construirApi(`partida/miRol`), {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ partida_id: partida_id }),
    });

    if (response.ok) {
      const data = await response.json();
      miRolId = data.rol_id;
      console.log("Rol obtenido del servidor: ", miRolId);
    }
  } catch (error) {
    console.error("Error obteniendo rol: ", error);
  }

  for (let i = 0; i < listaJugadores.length; i++) {
    // const jugador = listaJugadores[i];
    const nombreJugador = String(listaJugadores[i]);
    const numSlot = i + 1;

    const slotDiv = document.createElement("div");
    slotDiv.className = `jugador slot-${numSlot}`;
    const miUsuario = nombreJugador.trim() === miNickname?.trim();

    // Renderizar cartas
    if (miUsuario) {
      if (miRolId === 2) {
        await renderizarCartaLobo(slotDiv);
      } else if (miRolId === 1) {
        await renderizarCartaAldeano(slotDiv);
      } else {
        renderizarReverso(slotDiv);
      }

      contenedorCarta.appendChild(slotDiv);
    }
  }

  // PRUEBAS
  console.log("Jugadores totales partida: " + numeroJugadoresPartida);

  //Se ejecuta nada más cargar el script, del que te cuento
  (async () => {
    host = await verificarHost(partida_id);
    console.log("¿Soy el creador de la partida?", host);
    if (host) {
      btnIniciar.classList.remove("oculto");
    }
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

  canal.bind("cambio-fase", async (data: any) => {
    if (data.fase === "dia") {
      dia = true;
    } else {
      dia = false;
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
        // PRUEBAS
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

  function pintarMensaje(usuario: string, texto: string) {
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
};
