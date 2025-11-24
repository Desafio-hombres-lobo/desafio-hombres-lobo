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
  const contenedorCarta = document.createElement("div");

  contenedorCarta.innerHTML = `
        <div class="carta-rol carta-lobo"> <div class="carta-img-container">
                <img src="${IMG_HOMBRE_LOBO}" alt="${nombrePersonaje}">
            </div>

            <h3 class="carta-titulo">${nombrePersonaje}</h3>

            <div class="carta-acciones">
                ${listaAcciones
                  .map(
                    (accion: any) => `
                    <button class="btn-accion btn-lobo" data-id="${accion.id}">
                        ${accion.nombre_accion}
                    </button>
                `
                  )
                  .join("")}
            </div>
        </div>
    `;

  // contenedor.innerHTML = '';

  contenedor.appendChild(contenedorCarta);

  accionesBotones();
};

export const renderizarCartaAldeano = async (
  contenedorCirculo: HTMLElement
): Promise<void> => {
  const datosAccionesPersonaje: any = await obtenerAccionesPersonaje(
    ID_ALDEANO
  );

  if (!datosAccionesPersonaje) {
    contenedorCirculo.innerHTML = "<p>Error al cargar Aldeano</p>";
    return;
  }

  const listaAcciones = datosAccionesPersonaje.acciones;
  const nombrePersonaje = listaAcciones[0]?.nombre_personaje || "Aldeano";
  const contenedorCarta = document.createElement("div");

  contenedorCarta.innerHTML = `
        <div class="carta-rol carta-aldeano"> <div class="carta-img-container">
              <img src="${IMG_ALDEANO}" alt="${nombrePersonaje}">
          </div>

          <h3 class="carta-titulo">${nombrePersonaje}</h3>

          <div class="carta-acciones">
              ${listaAcciones
                .map(
                  (accion: any) => `
                  <button class="btn-accion btn-aldeano">
                      ${accion.nombre_accion}
                  </button>
              `
                )
                .join("")}
          </div>
      </div>
    `;

  // contenedor.innerHTML = '';

  contenedorCirculo.appendChild(contenedorCarta);
  accionesBotones();
};

const accionesBotones = () => {
  document.querySelectorAll(".btn-accion").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idAccion = btn.getAttribute("data-id");

      if (!idAccion) {
        console.warn("El botón no tiene data-id");
        return;
      }

      const idAccionInt = parseInt(idAccion);

      ejecutarAccion(idAccionInt);
    });
  });
};
