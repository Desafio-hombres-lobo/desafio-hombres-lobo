import { getPartidaId } from "../../autenticacion/ts/auth";
import { pusher } from "./reverb";
import { pintarMensaje } from "./chatAldea";
import { formChat, inputMensaje } from "./chatAldea";
import { enviarMensajeLobos } from "../../providers/envioDatosChatLobos";

const partida_id = getPartidaId();

export const chatLobos = () => {
  const canal = conectarLobos();
  configurarBind(canal);
};

const conectarLobos = () => {
  return pusher.subscribe("lobos" + partida_id);
};

const configurarBind = (canal: any) => {
  canal.bind("nuevo-mensaje-lobos", (data: any) => {
    pintarMensaje(data.usuario, data.mensaje);
  });
};
