import { getJugador } from "../../autenticacion/ts/auth";
import { pusher } from "./reverb";
import { enviarMensaje } from "../../providers/envioDatosChat";
import "../css/partida.css";
import "../../css/base.css";

const listaMensajes = document.getElementById("lista-mensajes")!;
const formChat = document.getElementById("form-chat") as HTMLFormElement;
const inputMensaje = document.getElementById(
  "input-mensaje"
) as HTMLInputElement;
const centroInfo = document.querySelector(".centro-info") as HTMLElement;

let dia: boolean = true;

function actualizarFaseVisual() {
  if (dia) {
    centroInfo.classList.remove("fase-noche");
    centroInfo.classList.add("fase-dia");
    // Opcional: Cambiar texto o iconos si quieres
  } else {
    centroInfo.classList.remove("fase-dia");
    centroInfo.classList.add("fase-noche");
  }
}

const canal = pusher.subscribe("chat");

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
    await enviarMensaje(mensaje);
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
