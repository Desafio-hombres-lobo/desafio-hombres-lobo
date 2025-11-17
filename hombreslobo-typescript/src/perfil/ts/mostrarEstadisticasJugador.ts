import { obtenerEstadisticasJugador } from "../../providers/obtenerEstadisticasJugador";

const asideEstadisticasJugador =
  document.querySelector<HTMLElement>(".stats-card")!;

export const renderizarEstadisticasJugador = (
  estadisticasJugador: any
): void => {
  asideEstadisticasJugador.innerHTML = `
    <div class="profile-pic" aria-hidden="true">
            <img></img>
          </div>

          <h3 class="nickname">${estadisticasJugador.nickname}</h3>

          <h4>Estadísticas</h4>
          <ul>
            <li>
              <span>P. Jugadas</span>
              <span>${estadisticasJugador.partidas_jugadas}</span>
            </li>
            <li>
              <span>P. Ganadas</span>
              <span>${estadisticasJugador.partidas_ganadas}</span>
            </li>
            <li>
              <span>P. Perdidas</span>
              <span>${estadisticasJugador.partidas_perdidas}</span>
            </li>
          </ul>`;
};

const cargarYMostrarEstadisticas = async () => {
  const datos = await obtenerEstadisticasJugador();

  if (datos) {
    renderizarEstadisticasJugador(datos);
  } else {
    if (asideEstadisticasJugador) {
      asideEstadisticasJugador.innerHTML = `<p class="error-mensaje" style="color:var(--error)">Error al cargar estadísticas. Por favor, inicia sesión de nuevo.</p>`;
    }
  }
};

document.addEventListener("DOMContentLoaded", cargarYMostrarEstadisticas);
