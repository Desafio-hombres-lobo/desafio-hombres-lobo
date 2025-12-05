import { conectarLobos, desconectarChatLobos } from "./chatLobos";

export const verChatLobos = (btn: HTMLInputElement) => {
  btn.addEventListener("click", function () {
    conectarLobos();
    setTimeout(() => {
      desconectarChatLobos();
    }, 5000);
  });
};
