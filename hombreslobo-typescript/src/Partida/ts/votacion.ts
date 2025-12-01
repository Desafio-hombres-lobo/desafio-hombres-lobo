import { votar } from "../../providers/votos/enviarDatosVoto";

const overlay = document.getElementById("resultado") as HTMLDivElement;

export function mostrarVotacion(mensaje: string) {
  const textoElemento = document.getElementById("texto-votacion");
  if (textoElemento) textoElemento.textContent = mensaje;

  overlay.classList.add("show");
}

export function cerrarVotacion() {
  overlay?.classList.remove("show");
}

let yaHasVotado = false;

export const voto = (
  contenedorCarta: HTMLElement,
  idVotado: number,
  ronda: number,
  idPartida: number,
  idJugador: number
) => {
  contenedorCarta.addEventListener("click", async () => {
    if (yaHasVotado) return;

    const resultado = await votar(idPartida, {
      id_jugador: idJugador,
      id_jugador_votado: idVotado,
      ronda: ronda,
    });

    if (!resultado.ok) {
      mostrarVotacion(resultado.error?.message || "No puedes votar dos veces.");
      return;
    }

    yaHasVotado = true;
    mostrarVotacion("Tu voto ha sido registrado.");
  });
};
