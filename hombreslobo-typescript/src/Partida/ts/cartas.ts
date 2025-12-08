import { renderizarReverso } from "../../Personajes/ts/crearCartaPersonaje";
import { voltearCartaPersonaje } from "../../Personajes/ts/voltearCartaPersonaje";
import type { Jugador } from "./Jugador";

const repartirCartasJugadores = async (jugadores: Jugador[]): Promise<void> => {
  miRolId = await obtenerRolPersonajeJugador();
  //await actualizarListas();
  let contador = 0;
  jugadores.forEach((jugador) => {
    contador++;
    const slotDiv = document.createElement("div");
    slotDiv.className = `jugador slot-${contador}`;
    slotDiv.dataset.jugador = jugador.nickname;
    slotDiv.dataset.id = jugador.id_jugador.toString();

    if (jugador.estado == 1) {
      const esMiUsuario = jugador.nickname === miNickname;
      if (esMiUsuario) {
        slotDiv.classList.add("mi-jugador");
        if (miRolId == ROL_LOBO) {
          lobo = true;
          await renderizarCartaLobo(slotDiv, jugador.nickname);
        } else if (miRolId === ROL_ALDEANO) {
          await renderizarCartaAldeano(slotDiv, jugador.nickname);
        } else if (miRolId === ROL_NINIA) {
          await renderizarCartaNiña(slotDiv, jugador.nickname);
        } else if (miRolId === 3) {
          await renderizarCartaVidente(slotDiv, jugador.nickname);
        } else if (miRolId === ROL_BRUJA) {
          await renderizarCartaBruja(slotDiv, jugador.nickname);
        }
      } else {
        renderizarReverso(slotDiv, jugador.nickname);
      }
      slotDiv.addEventListener("click", async () => {
        if (esMiUsuario) return;
        // Votar si es de día, o si es de noche y soy lobo
        if (!dia && !lobo) return;
        if (yaHasVotado) return;
        if (muerto) return;
        const idVotado = parseInt(slotDiv.dataset.id!);
        const payload = {
          id_jugador: jugador.id_jugador,
          id_jugador_votado: idVotado,
          ronda,
          dia: dia,
          idPersonaje: miRolId,
        };

        const resultado = await votar(id_partida, payload);
        yaHasVotado = true;
        if (!resultado.ok) {
          alert(`Error al votar: ${resultado.error}`);
        }
      });
    } else {
      voltearCartaPersonaje(jugador.nickname, jugador.id_personaje, slotDiv);
    }
    contenedorCarta.appendChild(slotDiv);
  });
};
