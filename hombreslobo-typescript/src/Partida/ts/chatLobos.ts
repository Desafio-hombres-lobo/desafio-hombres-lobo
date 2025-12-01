import { getPartidaId } from "../../autenticacion/ts/auth";
import { pusher } from "./reverb";
import { pintarMensaje } from "./chatAldea";

const partida_id = getPartidaId();

export const chatLobos = () => {
  const canal = conectarLobos();
  configurarBind(canal);
  configurarVotos(canal);
};

const conectarLobos = () => {
  return pusher.subscribe("lobos" + partida_id);
};

const configurarBind = (canal: any) => {
  canal.bind("nuevo-mensaje-lobos", (data: any) => {
    pintarMensaje(data.usuario, data.mensaje);
  });
};

const configurarVotos = (canal: any) => {
  canal.bind("votos-lobos", (data: any) => {
    console.log("Mensaje lobo ha votado");
  });
};
