import { obtenerAccionesPersonaje } from "../../providers/obtenerAccionesPersonaje";
import { ejecutarAccion } from "./accionesCartaPersonaje";
import "../css/styles.css";
import loboImg from "../../imagenes/cartas/lobo.png";
import aldeanoImg from "../../imagenes/cartas/aldeano.png";
import reversoCarta from "../../imagenes/cartas/reverso-carta.jpeg";
import { obtenerPersonajes } from "../../providers/obtenerPersonajes";

let ID_ALDEANO = 1;
let ID_LOBO = 2;
const IMG_HOMBRE_LOBO = loboImg;
const IMG_ALDEANO = aldeanoImg;

const personajes = await obtenerPersonajes();

export const renderizarCartaLobo = async (
  contenedor: HTMLElement
): Promise<void> => {
  const datosAccionesPersonaje: any = await obtenerAccionesPersonaje(ID_LOBO);

  if (!datosAccionesPersonaje) {
    contenedor.innerHTML = "<p>Error al cargar Lobo</p>";
    return;
  }

  const listaAcciones = datosAccionesPersonaje.acciones;
  const nombrePersonaje = listaAcciones[0]?.nombre_personaje || "Lobo";
  const idAccion = listaAcciones[0]?.id_accion;
  const idJugador = listaAcciones[0]?.id_jugador;
  const idPersonaje = listaAcciones[0]?.id_personaje;

  const carta = document.createElement("div");
  carta.classList.add("carta-rol", "carta-lobo");
  carta.innerHTML = `
      <div class="carta-img-container">
          <img src="${IMG_HOMBRE_LOBO}" alt="${nombrePersonaje}">
      </div>
      <p class="carta-titulo">${nombrePersonaje}</p>
  `;

  contenedor.appendChild(carta);
};

export const renderizarCartaAldeano = async (
  contenedor: HTMLElement
): Promise<void> => {
  const datosAccionesPersonaje: any = await obtenerAccionesPersonaje(
    ID_ALDEANO
  );

  if (!datosAccionesPersonaje) {
    contenedor.innerHTML = "<p>Error al cargar Aldeano</p>";
    return;
  }

  const listaAcciones = datosAccionesPersonaje.acciones;
  const nombrePersonaje = listaAcciones[0]?.nombre_personaje || "Aldeano";
  const idAccion = listaAcciones[0]?.id_accion;
  const idJugador = listaAcciones[0]?.id_jugador;
  const idPersonaje = listaAcciones[0]?.id_personaje;

  const carta = document.createElement("div");
  carta.classList.add("carta-rol", "carta-aldeano");
  carta.innerHTML = `
      <div class="carta-img-container">
          <img src="${IMG_ALDEANO}" alt="${nombrePersonaje}">
      </div>
      <p class="carta-titulo">${nombrePersonaje}</p>
  `;

  contenedor.appendChild(carta);
};

export const renderizarReverso = async (
  contenedor: HTMLElement,
  nombreJugador: string
) => {
  const divReverso = document.createElement("div");
  divReverso.className = "carta-rol carta-reverso";

  divReverso.innerHTML = `
        <div class="carta-img-container">
            <img src="${reversoCarta}" alt="reverso-carta">
        </div>
        <p class="carta-titulo">${nombreJugador}</p>
    `;

  contenedor.appendChild(divReverso);
};
