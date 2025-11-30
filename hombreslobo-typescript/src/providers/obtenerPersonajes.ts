import { construirApi } from "../autenticacion/ts/apiFetch";
import { getToken } from "../autenticacion/ts/auth";
import { getJSONHeaders } from "../autenticacion/ts/header";

let personajes = [];

export const obtenerPersonajes = async () => {
    const token = getToken();

    if(!token) return false;

      try {
        const header = getJSONHeaders();
        const endpoint = "/personajes";
        const response = await fetch(construirApi(endpoint), {
          method: "GET",
          headers: header,
        });
    
        const data = await response.json();
        personajes = data;
    
        if (!response.ok) {
          const errorDatos = data.message || "Error desconocido";
          alert("Error al mostrar las partidas: " + errorDatos);
          return null;
        }
    
        return personajes;
      } catch (error) {
        console.error("Error en la solicitud: " + error);
        return null;
      }
}