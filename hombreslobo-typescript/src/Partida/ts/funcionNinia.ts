import { verNinia } from "../../providers/enviarDatosNinia";
import {
  conectarLobos,
  configurarBind,
  desconectarChatLobos,
} from "./chatLobos";
import { getPartidaId } from "../../autenticacion/ts/auth";
export const verChatLobos = (btn: HTMLInputElement, chat: HTMLElement) => {
  const partida = getPartidaId()!;
  btn.classList.add("oculto");
  const canal = conectarLobos();
  configurarBind(canal);
  chat.classList.remove("chat-noche");
  verNinia(partida);
  setTimeout(() => {
    desconectarChatLobos();
    chat.classList.add("chat-noche");
  }, 5000);
};
