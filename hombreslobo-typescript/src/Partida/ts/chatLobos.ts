import { getPartidaId } from "../../autenticacion/ts/auth";
import { pusher } from "./reverb";
import { pintarMensaje } from "./chatAldea";
import { voltearCartasLobo } from "../../Personajes/ts/voltearCartaPersonaje";
import { obtenerJugadoresLobos } from "../../providers/obtenerJugadoresLobo";
import { obtenerJugadoresPartida } from "../../providers/obtenerJugadoresPartida";

const id_partida = getPartidaId()!;

export const chatLobos = async () => {
  const canal = conectarLobos();
  const jugadoresLobo = await obtenerJugadoresLobos();

  jugadoresLoboFaseNoche(jugadoresLobo);
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
    // console.log("Jugadores lobo: ", jugadoresLobo);
    pintarVotoLobo(data.idVotante, data.idVotado);
  });
};

const jugadoresLoboFaseNoche = async (jugadoresLobo: any[]) => {
  const respuestaPartida = await obtenerJugadoresPartida(id_partida);
  const listaDeJugadores = (respuestaPartida as any).listaJugadores || [];

  setTimeout(() => {
    jugadoresLobo.forEach((datosLobo: any) => {
      if (datosLobo && datosLobo.id_personaje === 2) {
        const jugadorEncontrado = listaDeJugadores.find(
          (j: any) => j.id === datosLobo.id_jugador
        );

        if (jugadorEncontrado) {
          voltearCartasLobo(jugadorEncontrado.nickname, 2);
        } else {
          console.warn(
            `No encontré el nombre para el ID ${datosLobo.id_jugador}`
          );
        }
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
