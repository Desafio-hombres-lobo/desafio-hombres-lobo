import { cerrarSesion } from "./cerrarSesion";
import { abrirModalJugar } from "../../Partida/ts/mostrarModal";
import { getToken, getRol, getJugador } from "./auth";
import { cargarFoto } from "../../perfil/ts/cargarFotoPerfil";
export const actualizarHeader = () => {
  const menu = document.querySelector(".menu");
  const token = getToken();
  const rolUsuario = getRol();
  const contenedorFinal = document.getElementById("contenedor-final");
  const botonesJugarAhora =
    document.querySelectorAll<HTMLElement>(".btn-jugar");

  if (!menu) return;

  if (token) {
    if (contenedorFinal) {
      contenedorFinal.classList.add("oculto");
    }
    if (botonesJugarAhora.length > 0) {
      botonesJugarAhora.forEach((boton: HTMLElement) => {
        boton.addEventListener("click", (e) => {
          e.preventDefault();
          abrirModalJugar();
        });
      });
    }
    if (rolUsuario == "admin") {
      const enlaceAdmin = document.createElement("a");
      enlaceAdmin.href = "/src/admin/htmls/admin.html";
      enlaceAdmin.textContent = "Panel de administracion";
      menu.appendChild(enlaceAdmin);
    }

    const nombreJugador = getJugador();
    const loginLink = menu.querySelector(
      'a[href="/src/autenticacion/htmls/login.html"]'
    );
    const registerLink = menu.querySelector(
      'a[href="/src/autenticacion/htmls/registro.html"]'
    );

    if (loginLink) {
      menu.removeChild(loginLink);
    }
    if (registerLink) {
      menu.removeChild(registerLink);
    }

    // 2. Crear y añadir el span del nombre-usuario (solo si no existe ya)
    if (!menu.querySelector(".div-sesion-iniciada")) {
      const divSesion = document.createElement("div");
      divSesion.className = "div-sesion-iniciada";

      const fotoLink = document.createElement("a");
      fotoLink.href = "/src/perfil/html/perfil.html";
      fotoLink.className = "profile-pic";

      const fotoImg = document.createElement("img");
      fotoImg.alt = "Foto perfil";
      fotoLink.appendChild(fotoImg);
      cargarFoto()
      const cerrarSesionBoton = document.createElement("a");
      cerrarSesionBoton.href = "#";
      cerrarSesionBoton.id = "logout-button";
      cerrarSesionBoton.className = "material-symbols-outlined";
      cerrarSesionBoton.innerHTML = "logout";

      // 4. Añadir el listener para el logout
      cerrarSesionBoton.addEventListener("click", (e) => {
        e.preventDefault();
        cerrarSesion();
      });
      divSesion.appendChild(fotoLink);
      divSesion.appendChild(cerrarSesionBoton);
      menu.appendChild(divSesion);
    }
  } else {
    // --- USUARIO NO LOGUEADO ---
    if (contenedorFinal) {
      contenedorFinal.classList.remove("oculto");
    }
    if (botonesJugarAhora.length > 0) {
      botonesJugarAhora.forEach((boton: HTMLElement) => {
        boton.addEventListener("click", (e) => {
          e.preventDefault();
          window.location.href = "/src/autenticacion/htmls/login.html";
        });
      });
    }
    // 1. Quitar los elementos de "nombre-usuario" y "Cerrar Sesión"
    const divSesion = menu.querySelector(".div-sesion-iniciada");
    //const nombreUsuarioLink = menu.querySelector(".nav-nombre-usuario");
    //const cerrarSesionBoton = menu.querySelector("#cerrar-sesion-boton");

    if (divSesion) {
      menu.removeChild(divSesion);
    }

    // 2. Crear y añadir los links de "Iniciar Sesión" y "Registrarse" (solo si no existen)
    if (!menu.querySelector('a[href="/src/autenticacion/htmls/login.html"]')) {
      const loginLink = document.createElement("a");
      loginLink.href = "/src/autenticacion/htmls/login.html";
      loginLink.textContent = "Iniciar Sesión";
      menu.appendChild(loginLink);
    }

    if (
      !menu.querySelector('a[href="/src/autenticacion/htmls/registro.html"]')
    ) {
      const registerLink = document.createElement("a");
      registerLink.href = "/src/autenticacion/htmls/registro.html";
      registerLink.textContent = "Registrate";
      menu.appendChild(registerLink);
    }
  }
};
