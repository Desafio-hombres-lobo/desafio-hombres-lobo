import { obtenerJugadorActual } from "../../providers/obtenerJugadorActual";
import { getPartidaId, getToken } from "../../autenticacion/ts/auth";
import { pusher } from "../../Partida/ts/reverb";
import { construirApi } from "../../autenticacion/ts/apiFetch";

const txtMensaje =
  document.querySelector<HTMLInputElement>(".chat-input input");
const btnEnviar = document.querySelector<HTMLButtonElement>("#enviar");
const ulMessages = document.querySelector<HTMLUListElement>(
  ".chat-input .mensajes"
);

if (!txtMensaje || !btnEnviar || !ulMessages) {
  throw new Error("No se encontraron todos los elementos del DOM necesarios.");
}

const partidaId = getPartidaId();
const token = getToken();
const endpoint = "/chat/send";
const apiUrl = construirApi(endpoint);

const resJugador = await obtenerJugadorActual();
if (!resJugador.ok) {
  console.error("Error obteniendo jugador:", resJugador.error);
  throw new Error("No se pudo obtener el jugador actual");
}
const jugador = resJugador.datos;

const channel = pusher.subscribe("lobby." + partidaId);

channel.bind("message.sent", (data: { message: string; username: string }) => {
  const li = document.createElement("li");
  li.classList.add("mensaje");

  if (data.username == jugador.nickname) {
    li.classList.add("propio");
    li.innerHTML = `</span> ${data.message}`;
  } else {
    li.classList.add("otros");
    li.innerHTML = `
        <span>${jugador.nickname}:</span> ${data.message}`;
  }
  ulMessages.appendChild(li);
  ulMessages.scrollTop = ulMessages.scrollHeight;
});

btnEnviar.addEventListener("click", () => {
  const mensaje = txtMensaje.value.trim();
  if (!mensaje) return;

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      message: mensaje,
      partida_id: partidaId,
    }),
  })
    .then((res) => res.json())
    .then((resp) => {
      console.log("Confirmación del servidor:", resp);
      txtMensaje.value = "";
    })
    .catch((err) => console.error("Error al enviar:", err));
});
