import { obtenerAccionesPersonaje } from "../../providers/obtenerAccionesPersonaje";
import { ejecutarAccion } from "./accionesCartaPersonaje";
import "../css/styles.css";
import loboImg from "../../imagenes/cartas/lobo.png";
import aldeanoImg from "../../imagenes/cartas/aldeano.png";

const ID_ALDEANO = 1;
const ID_LOBO = 2;
const IMG_HOMBRE_LOBO = loboImg;
const IMG_ALDEANO = aldeanoImg;

export const renderizarCartaLobo = async (
  contenedor: HTMLElement
): Promise<void> => {
  const datosAccionesPersonaje: any = await obtenerAccionesPersonaje(ID_LOBO);

  if (!datosAccionesPersonaje) {
    contenedor.innerHTML = "<p>Error al cargar Hombre Lobo</p>";
    return;
  }

  const listaAcciones = datosAccionesPersonaje.acciones;
  const nombrePersonaje = listaAcciones[0]?.nombre_personaje || "Hombre Lobo";
  const idAccion = listaAcciones[0]?.id_accion;
  const idPersonaje = listaAcciones[0]?.id_personaje;
  const contenedorCarta = document.createElement("div");

  contenedorCarta.innerHTML = `
        <div class="carta-rol carta-lobo" data-id="${idAccion}"> <div class="carta-img-container">
                <img src="${IMG_HOMBRE_LOBO}" alt="${nombrePersonaje}">
            </div>

            <h3 class="carta-titulo">${nombrePersonaje}</h3>
            <div class="carta-acciones">
              <p class="txt-accion txt-lobo">Cada noche devora a un aldeano. De día se hace pasar por uno de ellos.</p>
            </div>
        </div>
    `;

  contenedor.appendChild(contenedorCarta);
  ejecutarAccion(contenedorCarta, idAccion, idPersonaje);
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
  const idPersonaje = listaAcciones[0]?.id_personaje;
  const contenedorCarta = document.createElement("div");

  contenedorCarta.innerHTML = `
        <div class="carta-rol carta-aldeano" data-id=""${idAccion}> <div class="carta-img-container">
              <img src="${IMG_ALDEANO}" alt="${nombrePersonaje}">
          </div>

          <h3 class="carta-titulo">${nombrePersonaje}</h3>

          <div class="carta-acciones">
              <p class="txt-accion txt-aldeano">Su única arma es el análisis y su voto para linchar al culpable.</p>
          </div>
      </div>
    `;

  contenedor.appendChild(contenedorCarta);
  ejecutarAccion(contenedorCarta, idAccion, idPersonaje);
};

