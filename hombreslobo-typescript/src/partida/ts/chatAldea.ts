import { getJugador, getPartidaId } from "../../autenticacion/ts/auth";
import { pusher } from "./reverb";
import { enviarMensaje } from "../../providers/envioDatosChat";
import "../css/partida.css";
import "../../css/base.css";
import {
  renderizarCartaAldeano,
  renderizarCartaLobo,
} from "../../Personajes/ts/crearCartaPersonaje";

const listaMensajes = document.getElementById("lista-mensajes")!;
const formChat = document.getElementById("form-chat") as HTMLFormElement;
const inputMensaje = document.getElementById(
  "input-mensaje"
) as HTMLInputElement;
const centroInfo = document.querySelector(".centro-info") as HTMLElement;
// PRUEBAS BORRAR LUEGO
const tablero = document.querySelector(".grid-tablero") as HTMLElement;
const spanFase = document.getElementById("fase-partida")!;
const headerChat = document.getElementById("h3-chat")!;

// PRUEBAS BORRAR LUEGO
renderizarCartaLobo(tablero);
renderizarCartaAldeano(tablero);
renderizarCartaAldeano(centroInfo);

const partida_id = getPartidaId();

let dia: boolean = true;

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
  console.log("mensaje", data);

  pintarMensaje(data.usuario, data.mensaje);
});

formChat.addEventListener("submit", async (e) => {
  e.preventDefault();

  const mensaje = inputMensaje.value.trim();
  if (!mensaje) return;

  inputMensaje.value = "";

  if (mensaje === "/cambiar") {
    //placeholder, lo haremos con el reverb
    dia = !dia;
    actualizarFaseVisual();
    inputMensaje.value = "";
    return;
  }
  try {
    await enviarMensaje(mensaje, partida_id);
  } catch {
    alert("Error");
  }
});

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
