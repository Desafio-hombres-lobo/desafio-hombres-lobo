import { getPartidaId } from "../../autenticacion/ts/auth";
import { pusher } from "./reverb";
import { pintarMensaje } from "./chatAldea";
import { formChat, inputMensaje } from "./chatAldea";

const partida_id = getPartidaId();

export const chatLobos = () => {
  const canal = conectarLobos();
};

const conectarLobos = () => {
  return pusher.subscribe("lobos" + partida_id);
};

const configurarBind = (canal: any) => {
  canal.bind("nuevo-mensaje-lobos", (data: any) => {});
};

formChat.addEventListener("submit", async (e) => {
  e.preventDefault();

  const mensaje = inputMensaje.value.trim();
  if (!mensaje) return;

  inputMensaje.value = "";
  try {
    await enviarMensaje(mensaje, partida_id);
  } catch {
    alert("Error");
  }
});
