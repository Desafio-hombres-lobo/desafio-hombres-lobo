import { obtenerAccionesPersonaje } from "../../providers/obtenerAccionesPersonaje";
import "../css/styles.css";

const ID_ALDEANO = 1;
const ID_LOBO = 2;
const IMG_HOMBRE_LOBO = "imagenes/cartas/lobo.png";
const IMG_ALDEANO = "imagenes/cartas/aldeano.png";

export const renderizarCartaLobo = async (
  contenedorCirculo: HTMLElement
): Promise<void> => {
  const datosAccionesPersonaje: any = await obtenerAccionesPersonaje(ID_LOBO);

  if (!datosAccionesPersonaje) {
    contenedorCirculo.innerHTML = "<p>Error al cargar Hombre Lobo</p>";
    return;
  }

  const listaAcciones = datosAccionesPersonaje.acciones;
  const nombrePersonaje = listaAcciones[0]?.nombre_personaje || "Hombre Lobo";

  contenedorCirculo.innerHTML = `
        <div class="carta-rol carta-lobo"> <div class="carta-img-container">
                <img src="${IMG_HOMBRE_LOBO}" alt="${nombrePersonaje}">
            </div>

            <h3 class="carta-titulo">${nombrePersonaje}</h3>

            <div class="carta-acciones">
                ${listaAcciones
                  .map(
                    (accion: any) => `
                    <button class="btn-accion btn-lobo">
                        ${accion.nombre_accion}
                    </button>
                `
                  )
                  .join("")}
            </div>
        </div>
    `;
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

  contenedorCirculo.innerHTML = `
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
};
