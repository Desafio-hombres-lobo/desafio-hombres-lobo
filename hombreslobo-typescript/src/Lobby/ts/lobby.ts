import Pusher from "pusher-js";
import { obtenerPartida } from "../../providers/obtenerPartida";
import { obtenerCreador } from "../../providers/obtenerCreadorPartida";
import { obtenerJugadorActual } from "../../providers/obtenerJugadorActual";
import { obtenerJugador } from "../../providers/obtenerJugador";
import { unirsePartida } from "../../providers/unirsePartida";
import { obtenerJugadoresPartida } from "../../providers/obtenerJugadoresPartida";
import { salirPartida} from "../../providers/abandonarPartida";

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
  const contadorEl = document.querySelector(".contador") as HTMLElement;
  const botonAbandonar = document.getElementById("abandonar") as HTMLButtonElement;
  const btnCopiarCodigo = document.getElementById("copiarCodigo") as HTMLButtonElement;

  let jugadoresActuales = 0;
  let jugadoresMaximos = 0;

  const wsHost = 'localhost';
  const wsPort = 8080;

  const pusher = new Pusher('cw5xkporz11sccbkkxni', {
    wsHost,
    wsPort,
    forceTLS: false,
    enabledTransports: ['ws'],
    cluster: 'mt1',
    disableStats: true,
  });

  pusher.connection.bind('connected', () => {
    console.info('Conectado correctamente a Reverb');
  });

  pusher.connection.bind('error', (err: any) => {
    if (err.data.code === 1006) {
      console.warn('Conexión perdida con Reverb');
    } else {
      console.error('Error WebSocket:', err);
    }
  });

  const channel = pusher.subscribe('game.' + partidaId);

  channel.bind('player.joined', (data: any) => {
    console.log('Jugador unido:', data.player);
    const notificacion = document.createElement('div');
    notificacion.textContent = `${data.player} se ha unido a la partida`;
    notificacion.classList.add('notificacion');
    document.body.appendChild(notificacion);

    setTimeout(() => {
      notificacion.remove();
    }, 3000);

    jugadoresActuales++;
    contadorEl.textContent = `${jugadoresActuales}/${jugadoresMaximos}`;
  });

  channel.bind('jugador.abandono', (data: any) => {
    console.log('Jugador abandonó:', data.jugador);
    const notificacion = document.createElement('div');
    notificacion.textContent = `${data.jugador} ha abandonado la partida`;
    notificacion.classList.add('notificacion');
    document.body.appendChild(notificacion);

    setTimeout(() => {
      notificacion.remove();
    }, 3000);

    jugadoresActuales--;
    if (jugadoresActuales < 0) jugadoresActuales = 0;
    contadorEl.textContent = `${jugadoresActuales}/${jugadoresMaximos}`;
  });

  const cargarPartida = async () => {
    const res = await obtenerPartida(token, partidaId);
    const datos = res.datos;
    jugadoresMaximos = datos.num_jugadores;

    const respuestaCreador = await obtenerCreador(token, partidaId);
    const idCreador = await respuestaCreador.json();
    console.log(idCreador);

    let respuestaNombreCreador;
    try {
      respuestaNombreCreador = await obtenerJugador(token, idCreador);
    } catch (error) {
      console.error("Error cargando creador de la partida:", error);
      return;
    }

    const creador = await respuestaNombreCreador.json();
    const nombreCreador = creador.nickname;
    codigoPartida.textContent = `Lobby de partida de: ${nombreCreador}`;
    codigoLabel.textContent = datos.codigo;

    notificarUnion();
  };

  const notificarUnion = async () => {
    const resJugador = await obtenerJugadorActual(token);
    const jugador = await resJugador.json();

    const payload = {
      game_id: partidaId,
      player: jugador.nickname,
      timestamp: new Date().toISOString(),
    };

    const response = await unirsePartida(token, payload);
    console.log('Unión notificada al servidor:', response);


    const resultado = await obtenerJugadoresPartida(token, partidaId);
    
    if (resultado.ok) {
      jugadoresActuales = resultado.jugadoresActuales;
      jugadoresMaximos = resultado.jugadoresMaximos;
      contadorEl.textContent = `${jugadoresActuales}/${jugadoresMaximos}`;
      
      if (jugadoresActuales === jugadoresMaximos) {
        contadorEl.classList.add('iniciar');
      }
    } else {
      console.error('Error obteniendo jugadores:', resultado.error);
    }
  };

  const abandonarPartida = async () => {
    const resultado = await salirPartida(token, partidaId);
    
    if (resultado.ok) {
      pusher.unsubscribe('game.' + partidaId);
      localStorage.removeItem("partida_id");
      window.location.href = "/";
    } else {
      console.error('Error abandonando partida:', resultado.error);
    }
  };

  btnCopiarCodigo.addEventListener("click", async() => {
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
