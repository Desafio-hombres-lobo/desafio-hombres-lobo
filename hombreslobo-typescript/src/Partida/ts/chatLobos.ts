import { getPartidaId } from "../../autenticacion/ts/auth";
import { pusher } from "./reverb";
import { pintarMensaje } from "./chatAldea";
import { voltearCartasLobo } from "../../Personajes/ts/voltearCartaPersonaje";
import { obtenerJugadoresLobos } from "../../providers/obtenerJugadoresLobo";

const partida_id = getPartidaId();
const jugadoresLobo = await obtenerJugadoresLobos();

export const chatLobos = () => {
  const canal = conectarLobos();
  // jugadoresLobo.forEach((jugadorLobo: any) => {
  //   if (jugadorLobo) {
  //     voltearCartasLobo(jugadorLobo.nickname, jugadorLobo.id_personaje);
  //   } else {
  //     console.warn("No se encuentra al jugador lobo");
  //   }
  // });

  console.log("Jugadores lobo: ", jugadoresLobo);
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
    jugadoresLobo.forEach((jugadorLobo: any) => {
      if (jugadorLobo) {
        voltearCartasLobo(data.nickname, jugadorLobo.id_personaje);
      } else {
        console.warn("No se encuentra al jugador lobo");
      }
    });

    console.log("Jugadores lobo: ", jugadoresLobo);
    pintarVotoLobo(data.idVotante, data.idVotado);
  });
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
