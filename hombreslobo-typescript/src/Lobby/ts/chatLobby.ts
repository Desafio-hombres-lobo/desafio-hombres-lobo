import { obtenerJugadorActual } from "../../providers/obtenerJugadorActual";
import { getPartidaId } from "../../autenticacion/ts/auth";
import { pusher } from "../../Partida/ts/reverb";
import { enviarMensaje } from "../../providers/enviarMensaje";

const txtMensaje =
  document.querySelector<HTMLInputElement>(".chat-input input");
const btnEnviar = document.querySelector<HTMLButtonElement>("#enviar");
const ulMessages = document.querySelector<HTMLUListElement>(
  ".chat-input .mensajes"
);

if (!txtMensaje || !btnEnviar || !ulMessages) {
  throw new Error("No se encontraron todos los elementos del DOM necesarios.");
}

const partidaId = getPartidaId()!;

const resJugador = await obtenerJugadorActual();
if (!resJugador.ok) {
  console.error("Error obteniendo jugador:", resJugador.error);
  throw new Error("No se pudo obtener el jugador actual");
}
const jugador = resJugador.datos;

const channel = pusher.subscribe("lobby" + partidaId);

channel.bind("message.sent", (data: { message: string; username: string }) => {
  const li = document.createElement("li");
  li.classList.add("mensaje");

  if (data.username == jugador.nickname) {
    li.classList.add("propio");
    li.innerHTML = `</span> ${data.message}`;
  } else {
    li.classList.add("otros");
    li.innerHTML = `
        <span>${data.username}:</span> ${data.message}`;
  }
  ulMessages.appendChild(li);
  ulMessages.scrollTop = ulMessages.scrollHeight;
});

btnEnviar.addEventListener("click", async () => {
  const mensaje = txtMensaje.value.trim();
  if (!mensaje) return;

  const resp = await enviarMensaje({ message: mensaje, id_partida: partidaId });

  if (resp.ok) {
    console.log("Confirmación del servidor:", resp.data);
    txtMensaje.value = "";
  } else {
    console.error("Error al enviar:", resp.error);
  }
});

txtMensaje.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    const mensaje = txtMensaje.value.trim();
    if (!mensaje) return;

    const resp = await enviarMensaje({
      message: mensaje,
      id_partida: partidaId,
    });

    if (resp.ok) {
      console.log("Confirmación del servidor:", resp.data);
      txtMensaje.value = "";
    } else {
      console.error("Error al enviar:", resp.error);
    }
  }
});
