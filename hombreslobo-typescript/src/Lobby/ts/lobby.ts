import { obtenerPartida } from "../../providers/obtenerPartida";
import {
  obtenerCreadorPartida,
  verificarHost,
} from "../../providers/obtenerCreadorPartida";
import { obtenerJugadorActual } from "../../providers/obtenerJugadorActual";
import { obtenerJugador } from "../../providers/obtenerJugador";
import { unirsePartida } from "../../providers/unirsePartida";
import { obtenerJugadoresPartida } from "../../providers/obtenerJugadoresPartida";
import { salirPartida } from "../../providers/abandonarPartida";
import { actualizarEstadoPartida } from "../../providers/actualizarEstadoPartida";
import { iniciarPartida } from "../../providers/iniciarPartida";
import { getPartidaId, getToken } from "../../autenticacion/ts/auth";
import { pusher } from "../../Partida/ts/reverb";
import { rellenarBotsPartida } from "../../providers/rellenarBots";

export const initLobby = () => {
  const partidaId = getPartidaId();
  const token = getToken();
  const jugadorActual = obtenerJugadorActual();

  if (!partidaId) {
    console.error("No existe esa partida");
    return;
  }
  if (!token) {
    console.error("No hay token de autenticación");
    return;
  }

  const codigoPartida = document.getElementById(
    "codigo-partida"
  ) as HTMLElement;
  const codigoLabel = document.querySelector(".code strong") as HTMLElement;
  const contadorJugadores = document.querySelector(".contador") as HTMLElement;
  const listaJugadoresEl = document.querySelector(
    ".jugadores-lista"
  ) as HTMLElement;
  const botonAbandonar = document.getElementById(
    "abandonar"
  ) as HTMLButtonElement;
  const btnCopiarCodigo = document.getElementById(
    "copiarCodigo"
  ) as HTMLButtonElement;
  const botonIniciar = document.getElementById("btnJugar") as HTMLButtonElement;

  let jugadoresActuales = 0;
  let jugadoresMaximos = 0;

  let jugadoresArray: string[] = [];

  const channel = pusher.subscribe("lobby." + partidaId);

  const actualizarContador = () => {
    contadorJugadores.textContent = `${jugadoresActuales}/${jugadoresMaximos}`;

    if (jugadoresActuales === jugadoresMaximos) {
      contadorJugadores.classList.add("lleno");
      actualizarEstadoPartida(partidaId, 2);
      iniciarPartida(partidaId);
    } else {
      contadorJugadores.classList.remove("lleno");
      actualizarEstadoPartida(partidaId, 0);
    }
  };

  const actualizarListaJugadores = () => {
    listaJugadoresEl.innerHTML = "";
    jugadoresArray.forEach((j) => {
      const item = document.createElement("div");
      item.textContent = j;
      item.classList.add("jugador-item");
      listaJugadoresEl.appendChild(item);
    });
  };

  channel.bind("player.joined", (data: any) => {
    const notificacion = document.createElement("div");
    notificacion.textContent = `${data.player} se unió a la partida`;
    notificacion.classList.add("notificacion");
    document.body.appendChild(notificacion);
    setTimeout(() => notificacion.remove(), 3000);

    jugadoresActuales++;
    jugadoresArray.push(data.player);
    actualizarContador();
    actualizarListaJugadores();
  });

  channel.bind("jugador.abandono", (data: any) => {
    console.log("Jugador abandonó:", data.jugador);
    const notificacion = document.createElement("div");
    notificacion.textContent = `${data.jugador} ha abandonado la partida`;
    notificacion.classList.add("notificacion");
    document.body.appendChild(notificacion);
    setTimeout(() => notificacion.remove(), 3000);

    jugadoresArray = jugadoresArray.filter((j) => j !== data.jugador);

    jugadoresActuales = jugadoresArray.length;
    actualizarContador();
    actualizarListaJugadores();
  });

  channel.bind("iniciar.juego", (data: any) => {
    console.log("Evento recibido, iniciando partida...", data);
    rellenarBotsPartida(partidaId, jugadoresActuales);
    setTimeout(
      () => (window.location.href = "/src/Partida/htmls/partida.html"),
      4000
    );
    const overlay = document.getElementById("iniciando");
    overlay?.classList.add("mostrar");
  });

  const cargarPartida = async () => {
    jugadoresArray = [];
    const datos = await obtenerPartida(partidaId);
    if (!datos) return;

    jugadoresMaximos = datos.num_jugadores;
    codigoLabel.textContent = datos.codigo;
    const resCreador = await obtenerCreadorPartida(partidaId);
    if (!resCreador.ok) {
      console.error("Error obteniendo creador:", resCreador.error);
      return;
    }
    const idCreador = resCreador.datos;

    const respuestaNombreCreador = await obtenerJugador(idCreador);
    const creador = await respuestaNombreCreador.json();

    codigoPartida.textContent = `Lobby de partida de: ${creador.nickname}`;

    if ((await jugadorActual).datos.nickname !== creador.nickname) {
      botonIniciar.disabled = true;
      botonIniciar.innerHTML = "Iniciando...";
      botonIniciar.classList.add("no-hover");
    } else {
      botonIniciar.innerHTML = "Iniciar Partida";
    }
    codigoLabel.textContent = datos.codigo;

    notificarUnion();
  };

  const notificarUnion = async () => {
    if (jugadoresArray.includes((await jugadorActual).datos.nickname)) return;

    const payload = {
      game_id: partidaId,
      player: (await jugadorActual).datos.nickname,
      timestamp: new Date().toISOString(),
    };

    await unirsePartida(payload);

    const resultado = await obtenerJugadoresPartida(partidaId);
    if (resultado.ok) {
      jugadoresActuales = resultado.jugadoresActuales;
      jugadoresMaximos = resultado.jugadoresMaximos;
      jugadoresArray = resultado.listaJugadores || [];
      actualizarContador();
      actualizarListaJugadores();
    }
  };

  const abandonarPartida = async () => {
    const resultado = await salirPartida(partidaId);
    if (resultado.ok) {
      pusher.unsubscribe("game." + partidaId);
      localStorage.removeItem("partida_id");
      window.location.href = "/";
      sessionStorage.removeItem("partida_id");
    } else {
      console.error("Error abandonando partida:", resultado.error);
    }
  };

  btnCopiarCodigo.addEventListener("click", async () => {
    const codigo = codigoLabel.textContent || "";
    await navigator.clipboard.writeText(codigo);
  });

  botonAbandonar.addEventListener("click", () => {
    abandonarPartida();
  });

  botonIniciar.addEventListener("click", async () => {
    const host = await verificarHost(partidaId);
    if (host) {
      await iniciarPartida(partidaId);
    }
  });

  if (partidaId) {
    cargarPartida();
  }
};
