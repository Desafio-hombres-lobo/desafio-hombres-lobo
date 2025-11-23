import Pusher from "pusher-js";

export const initLobby = () => {
  const partidaId = localStorage.getItem("partida_id");
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
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/partida/${partidaId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const datos = await res.json();
      jugadoresMaximos = datos.num_jugadores;
      
      let respuestaCreador;
      try {
        respuestaCreador = await fetch(`http://127.0.0.1:8000/api/jugador/${datos.creador_id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error("Error cargando creador de la partida:", error);
        return;
      }
      const creador = await respuestaCreador.json();
      const nombreCreador = creador.nickname;
      codigoPartida.textContent = `Lobby de partida de: ${nombreCreador}`;
      codigoLabel.textContent = datos.codigo;
      contadorEl.textContent = `0/${jugadoresMaximos}`;

      notificarUnion();

    } catch (error) {
      console.error("Error cargando partida:", error);
    }
  };

  const notificarUnion = async () => {
    try {
      const resJugador = await fetch(`http://127.0.0.1:8000/api/jugador`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const jugador = await resJugador.json();

      const payload = {
        game_id: partidaId,
        player: jugador.nickname,
        timestamp: new Date().toISOString(),
      };

      const response = await fetch('http://127.0.0.1:8000/api/game/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log('Unión notificada al servidor:', result);

      const resJugadores = await fetch(`http://127.0.0.1:8000/api/partida/${partidaId}/jugadores`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const datosJugadores = await resJugadores.json();
      jugadoresActuales = datosJugadores.jugadores_actuales;
      jugadoresMaximos = datosJugadores.jugadores_maximos;

      contadorEl.textContent = `${jugadoresActuales}/${jugadoresMaximos}`;
    if(jugadoresActuales == jugadoresMaximos){
      contadorEl.classList.add('iniciar')
    }

    } catch (error) {
      console.error('Error notificando unión:', error);
    }
  };


  const abandonarPartida = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/partida/abandonar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          partida_id: partidaId
        }),
      });


      pusher.unsubscribe('game.' + partidaId);
      localStorage.removeItem("partida_id");
      window.location.href = "/";

    } catch (error) {
      console.error('Error abandonando partida:', error);
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
