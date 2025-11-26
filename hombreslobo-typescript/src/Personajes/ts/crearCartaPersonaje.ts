import { obtenerAccionesPersonaje } from "../../providers/obtenerAccionesPersonaje";
import { ejecutarAccion } from "./accionesCartaPersonaje";
import "../css/styles.css";
import loboImg from "../../imagenes/cartas/lobo.png";
import aldeanoImg from "../../imagenes/cartas/aldeano.png";
// BORRAR PRUEBAS
import { obtenerDatosJugadorPartida } from "../../providers/obtenerDatosJugador";

const ID_ALDEANO = 1;
const ID_LOBO = 2;
const IMG_HOMBRE_LOBO = loboImg;
const IMG_ALDEANO = aldeanoImg;
// BORRAR PRUEBAS
const idPartida = sessionStorage.getItem("partida_id");
const intIdPartida = Number(idPartida);

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
  const idJugador = listaAcciones[0]?.id_jugador;
  const idPersonaje = listaAcciones[0]?.id_personaje;
  const contenedorCarta = document.createElement("div");

  contenedorCarta.innerHTML = `
        <div class="carta-rol carta-lobo" data-id="${idAccion}"> <div class="carta-img-container">
                <img src="${IMG_HOMBRE_LOBO}" alt="${nombrePersonaje}">
            </div>

            <p class="carta-titulo">${nombrePersonaje}</p>
        </div>
    `;

  contenedor.appendChild(contenedorCarta);
  ejecutarAccion(contenedorCarta, idAccion, idJugador, idPersonaje);
  // Datos Jugador Partida
  const datosJugadorPartida = await obtenerDatosJugadorPartida(
    idJugador,
    intIdPartida
  );
  console.log(datosJugadorPartida);
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
  const contenedorCarta = document.createElement("div");

  contenedorCarta.innerHTML = `
        <div class="carta-rol carta-aldeano" data-id=""${idAccion}> <div class="carta-img-container">
              <img src="${IMG_ALDEANO}" alt="${nombrePersonaje}">
          </div>

          <p class="carta-titulo">${nombrePersonaje}</p>
      </div>
    `;

  contenedor.appendChild(contenedorCarta);
  ejecutarAccion(contenedorCarta, idAccion, idJugador, idPersonaje);
};
