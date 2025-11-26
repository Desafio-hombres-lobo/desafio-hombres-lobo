import Pusher from "pusher-js";
import { obtenerPartida } from "../../providers/obtenerPartida";
import { obtenerCreadorPartida } from "../../providers/obtenerCreadorPartida";
import { obtenerJugadorActual } from "../../providers/obtenerJugadorActual";
import { obtenerJugador } from "../../providers/obtenerJugador";
import { unirsePartida } from "../../providers/unirsePartida";
import { obtenerJugadoresPartida } from "../../providers/obtenerJugadoresPartida";
import { salirPartida } from "../../providers/abandonarPartida";
import { actualizarEstadoPartida } from "../../providers/actualizarEstadoPartida";

export const initLobby = () => {
  const partidaId = sessionStorage.getItem("partida_id");
  const token = sessionStorage.getItem("auth_token");

  if (!partidaId) {
    console.error("No existe esa partida");
    return;
  }
  if(!token) {
    console.error("No hay token de autenticación");
    return;
  }

  const codigoPartida = document.getElementById("codigo-partida") as HTMLElement;
  const codigoLabel = document.querySelector(".code strong") as HTMLElement;
  const contadorJugadores = document.querySelector(".contador") as HTMLElement;
  const listaJugadoresEl = document.querySelector(".jugadores-lista") as HTMLElement;
  const botonAbandonar = document.getElementById("abandonar") as HTMLButtonElement;
  const btnCopiarCodigo = document.getElementById("copiarCodigo") as HTMLButtonElement;

  let jugadoresActuales = 0;
  let jugadoresMaximos = 0;

  const wsHost = 'localhost';
  const wsPort = 8080;
  let jugadoresArray: string[] = [];

  const pusher = new Pusher('cw5xkporz11sccbkkxni', {
    wsHost,
    wsPort,
    forceTLS: false,
    enabledTransports: ['ws'],
    cluster: 'mt1',
    disableStats: true,
  });

  const channel = pusher.subscribe('game.' + partidaId);

  const actualizarContador = () => {
    contadorJugadores.textContent = `${jugadoresActuales}/${jugadoresMaximos}`;

    if (jugadoresActuales === jugadoresMaximos) {
      contadorJugadores.classList.add("lleno");
      actualizarEstadoPartida(token, partidaId, 1);
    } else {
      contadorJugadores.classList.remove("lleno");
      actualizarEstadoPartida(token, partidaId, 0);
    }
  };

  const actualizarListaJugadores = () => {
    listaJugadoresEl.innerHTML = '';
    jugadoresArray.forEach(j => {
      const item = document.createElement('div');
      item.textContent = j;
      item.classList.add('jugador-item');
      listaJugadoresEl.appendChild(item);
    });
  };

  channel.bind('player.joined', (data: any) => {
    const notificacion = document.createElement('div');
    notificacion.textContent = `${data.player} se unió a la partida`;
    notificacion.classList.add('notificacion');
    document.body.appendChild(notificacion);
    setTimeout(() => notificacion.remove(), 3000);

    jugadoresActuales++;
    jugadoresArray.push(data.player);
    actualizarContador();
    actualizarListaJugadores();
  });

  channel.bind('jugador.abandono', (data: any) => {
    console.log('Jugador abandonó:', data.jugador);
    const notificacion = document.createElement('div');
    notificacion.textContent = `${data.jugador} ha abandonado la partida`;
    notificacion.classList.add('notificacion');
    document.body.appendChild(notificacion);
    setTimeout(() => notificacion.remove(), 3000);

    jugadoresArray = jugadoresArray.filter(j => j !== data.jugador);

    jugadoresActuales = jugadoresArray.length;
    actualizarContador();
    actualizarListaJugadores();
  });


  const cargarPartida = async () => {
    jugadoresArray = [];
    const datos = await obtenerPartida(partidaId);
    if (!datos) return;

    jugadoresMaximos = datos.num_jugadores;
    codigoLabel.textContent = datos.codigo;

    const resCreador = await obtenerCreadorPartida(token, partidaId);
    const idCreador = await resCreador.json(); 

    const respuestaNombreCreador = await obtenerJugador(idCreador);
    const creador = await respuestaNombreCreador.json();

    codigoPartida.textContent = `Lobby de partida de: ${creador.nickname}`;
    codigoLabel.textContent = datos.codigo;


    notificarUnion();
  };

  const notificarUnion = async () => {
    const resJugador = await obtenerJugadorActual(token);
    const jugador = await resJugador.json();

    if (jugadoresArray.includes(jugador.nickname)) return;

    const payload = {
      game_id: partidaId,
      player: jugador.nickname,
      timestamp: new Date().toISOString(),
    };

    await unirsePartida(token, payload);

    const resultado = await obtenerJugadoresPartida(token, partidaId);
    if (resultado.ok) {
      jugadoresActuales = resultado.jugadoresActuales;
      jugadoresMaximos = resultado.jugadoresMaximos;
      jugadoresArray = resultado.listaJugadores || [];
      actualizarContador();
      actualizarListaJugadores();
    }
  };

  const abandonarPartida = async () => {
    const resultado = await salirPartida(token, partidaId);
    if (resultado.ok) {
      pusher.unsubscribe('game.' + partidaId);
      localStorage.removeItem("partida_id");
      window.location.href = "/";
      sessionStorage.removeItem("partida_id");
    } else {
      console.error('Error abandonando partida:', resultado.error);
    }
  };

  btnCopiarCodigo.addEventListener("click", async () => {
    const codigo = codigoLabel.textContent || ""; 
    await navigator.clipboard.writeText(codigo);
  });

  botonAbandonar.addEventListener("click", () => {
    abandonarPartida();
  });

  if (partidaId) {
    cargarPartida();
  }
};
