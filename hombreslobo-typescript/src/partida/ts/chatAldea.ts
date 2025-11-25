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

  try {
    await enviarMensaje(mensaje);
  } catch {
    alert("Cagaste");
  }
});

function pintarMensaje(usuario: string, texto: string) {
  const div = document.createElement("div");

  const miUsuario = getJugador();
  const yo = usuario === miUsuario;

  div.classList.add("mensaje");
  div.classList.add(yo ? "mensaje-propio" : "mensaje-otro");

  if (yo) {
    div.innerHTML = `<p>${texto}</p>`;
  } else {
    div.innerHTML = `<strong class="remitente">${usuario}:</strong> <p>${texto}</p>`;
  }

  listaMensajes.appendChild(div);
  listaMensajes.scrollTop = listaMensajes.scrollHeight;
}
