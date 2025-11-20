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

  const cargarPartida = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/partida/${partidaId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const datos = await res.json();
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
      contadorEl.textContent = `1/${datos.num_jugadores}`;

    } catch (error) {
      console.error("Error cargando partida:", error);
    }
  };

  btnCopiarCodigo.addEventListener("click", async() => {
    const codigo = codigoLabel.textContent || ""; 
    await navigator.clipboard.writeText(codigo);});

  botonAbandonar.addEventListener("click", () => {
    localStorage.removeItem("partida_id");
    window.location.href = "/";
  });

  if (partidaId) {
  cargarPartida();
}


};
