import { getPartidaId } from "../../autenticacion/ts/auth";
import { pusher } from "./reverb";
import { pintarMensaje } from "./chatAldea";
import { voltearCartasLobo } from "../../Personajes/ts/voltearCartaPersonaje";
import type { Jugador } from "./Jugador";

const id_partida = getPartidaId()!;

export const chatLobos = async (lobos: Jugador[]) => {
  const canal = conectarLobos();

  jugadoresLoboFaseNoche(lobos);
  configurarBind(canal);
  configurarVotos(canal);
};

const conectarLobos = () => {
  return pusher.subscribe("lobos" + id_partida);
};

const configurarBind = (canal: any) => {
  canal.bind("nuevo-mensaje-lobos", (data: any) => {
    pintarMensaje(data.usuario, data.mensaje);
  });
};

const configurarVotos = (canal: any) => {
  canal.bind("votos-lobos", (data: any) => {
    pintarVotoLobo(data.idVotante, data.idVotado);
  });
};

export const jugadoresLoboFaseNoche = async (lobos: Jugador[]) => {
  setTimeout(() => {
    lobos.forEach((lobo: Jugador) => {
      if (lobo.id_personaje) {
        voltearCartasLobo(lobo.nickname, lobo.id_personaje);
      }
    });
  }, 1000);
};

const pintarVotoLobo = (votante: string, votado: string) => {
  const listaMensajes = document.getElementById("lista-mensajes");

  if (listaMensajes) {
    const div = document.createElement("div");

    div.classList.add("msg", "sistema");
    div.style.borderLeft = "3px solid #d9534f";
    div.style.backgroundColor = "rgba(217, 83, 79, 0.1)";
    div.style.color = "#d9534f";
    div.style.padding = "5px";
    div.style.marginBottom = "5px";

    div.innerHTML = `<strong>${votante}</strong> ha votado a <strong>${votado}</strong>`;

    listaMensajes.appendChild(div);
    listaMensajes.scrollTop = listaMensajes.scrollHeight;
  }
};
