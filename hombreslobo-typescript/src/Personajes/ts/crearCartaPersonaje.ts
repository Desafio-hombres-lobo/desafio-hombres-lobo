import { obtenerAccionesPersonaje } from "../../providers/obtenerAccionesPersonaje";
import "../css/styles.css";
import loboImg from "../../imagenes/cartas/lobo.png";
import niñaImg from "../../imagenes/cartas/niña.png";
import aldeanoImg from "../../imagenes/cartas/aldeano.png";
import reversoCarta from "../../imagenes/cartas/reverso-carta.jpeg";
import videnteImg from "../../imagenes/cartas/vidente.png";

let ID_ALDEANO = 1;
let ID_LOBO = 2;
let ID_VIDENTE = 3;
const IMG_HOMBRE_LOBO = loboImg;
const IMG_ALDEANO = aldeanoImg;
const IMG_VIDENTE = videnteImg;
const IMG_NIÑA = niñaImg;

export const renderizarCartaLobo = async (
  contenedor: HTMLElement,
  nickname: string
): Promise<void> => {
  const datosAccionesPersonaje: any = await obtenerAccionesPersonaje(ID_LOBO);

  if (!datosAccionesPersonaje) {
    contenedor.innerHTML = "<p>Error al cargar Lobo</p>";
    return;
  }

  const listaAcciones = datosAccionesPersonaje.acciones;
  const nombrePersonaje = listaAcciones[0]?.nombre_personaje || "Lobo";

  const carta = document.createElement("div");
  carta.classList.add("carta-rol", "carta-lobo");
  carta.innerHTML = `
      <div class="carta-img-container">
          <img src="${IMG_HOMBRE_LOBO}" alt="${nombrePersonaje}">
      </div>
      <p class="carta-titulo">${nickname}</p>
  `;

  contenedor.appendChild(carta);
};

export const renderizarCartaAldeano = async (
  contenedor: HTMLElement,
  nickname: string
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

  const carta = document.createElement("div");
  carta.classList.add("carta-rol", "carta-aldeano");
  carta.innerHTML = `
      <div class="carta-img-container">
          <img src="${IMG_ALDEANO}" alt="${nombrePersonaje}">
      </div>
      <p class="carta-titulo">${nickname}</p>
  `;

  contenedor.appendChild(carta);
};

export const renderizarCartaVidente = async (
  contenedor: HTMLElement,
  nickname: string
): Promise<void> => {
  const datosAccionesPersonaje: any = await obtenerAccionesPersonaje(
    ID_VIDENTE
  );

  if (!datosAccionesPersonaje) {
    contenedor.innerHTML = "<p>Error al cargar Lobo</p>";
    return;
  }

  const listaAcciones = datosAccionesPersonaje.acciones;
  const nombrePersonaje = listaAcciones[0]?.nombre_personaje || "Vidente";

  const carta = document.createElement("div");
  carta.classList.add("carta-rol", "carta-vidente");
  carta.innerHTML = `
      <div class="carta-img-container">
          <img src="${IMG_VIDENTE}" alt="${nombrePersonaje}">
      </div>
      <p class="carta-titulo">${nickname}</p>
  `;

  console.log("Renderizando carta Vidente...");
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

export const renderizarCartaNiña = async (
  contenedor: HTMLElement,
  nickname: string
): Promise<void> => {
  const datosAccionesPersonaje: any = await obtenerAccionesPersonaje(ID_LOBO);

  if (!datosAccionesPersonaje) {
    contenedor.innerHTML = "<p>Error al cargar Lobo</p>";
    return;
  }

  const listaAcciones = datosAccionesPersonaje.acciones;
  const nombrePersonaje = listaAcciones[0]?.nombre_personaje || "Niña";
  // const idAccion = listaAcciones[0]?.id_accion;
  // const idJugador = listaAcciones[0]?.id_jugador;
  // const idPersonaje = listaAcciones[0]?.id_personaje;

  const carta = document.createElement("div");
  carta.classList.add("carta-rol", "carta-niña");
  carta.innerHTML = `
      <div class="carta-img-container">
          <img src="${IMG_NIÑA}" alt="${nombrePersonaje}">
      </div>
      <p class="carta-titulo">${nickname}</p>
  `;

  contenedor.appendChild(carta);
};
