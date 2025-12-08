import { renderizarReverso } from "../../Personajes/ts/crearCartaPersonaje";
import type { Jugador } from "./Jugador";

const repartirCartasJugadores = async (jugadores: Jugador[]): Promise<void> => {

  miRolId = await obtenerRolPersonajeJugador();
  await actualizarListas();
    let contador=0;
    jugadores.forEach(jugador => {
        contador ++;
    const slotDiv = document.createElement("div");
    slotDiv.className = `jugador slot-${contador}`;
    slotDiv.dataset.jugador = jugador.nickname;
    slotDiv.dataset.id = jugador.id_jugador.toString();
    if(jugador.estado == 1){


    const esMiUsuario = jugador.nickname === miNickname;

        renderizarReverso(slotDiv, jugador.nickname)

    slotDiv.addEventListener("click", async () => {
      if (esMiUsuario) return;
      // Votar si es de día, o si es de noche y soy lobo
      if (!dia && !lobo) return;
      if (yaHasVotado) return;
      if (muerto) return;
      const idVotado = parseInt(slotDiv.dataset.id!);
      const payload = {
        id_jugador: idJugador,
        id_jugador_votado: idVotado,
        ronda,
        dia: dia,
        idPersonaje: miRolId,
      };
      
       });

      const resultado = await votar(id_partida, payload);
      yaHasVotado = true;
      if (!resultado.ok) {
        alert(`Error al votar: ${resultado.error}`);
      }
    
    
    contenedorCarta.appendChild(slotDiv);
    });

    muertos.forEach(muerto => {
        contador ++;
    const slotDiv = document.createElement("div");
    slotDiv.className = `jugador slot-${contador}`;
    slotDiv.dataset.jugador = vivo.nickname;
    slotDiv.dataset.id = muerto.id_jugador.toString();

    const esMiUsuario = muerto.nickname === miNickname;

        renderizarReverso(slotDiv, vivo.nickname)

    slotDiv.addEventListener("click", async () => {
      if (esMiUsuario) return;
      // Votar si es de día, o si es de noche y soy lobo
      if (!dia && !lobo) return;
      if (yaHasVotado) return;
      if (muerto) return;
      const idVotado = parseInt(slotDiv.dataset.id!);
      const payload = {
        id_jugador: idJugador,
        id_jugador_votado: idVotado,
        ronda,
        dia: dia,
        idPersonaje: miRolId,
      };
      
       });

      const resultado = await votar(id_partida, payload);
      yaHasVotado = true;
      if (!resultado.ok) {
        alert(`Error al votar: ${resultado.error}`);
      }
    
    
    contenedorCarta.appendChild(slotDiv);
    });
  };