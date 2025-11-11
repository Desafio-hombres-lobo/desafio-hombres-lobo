import "./css/base.css";
import "./css/index.css";
import { validarFormulario } from "./autenticacion/validarFormulario";
import { validarLogin } from "./autenticacion/validarLogin";
import { cerrarSesion } from "./autenticacion/cerrarSesion";
const SESSIONSTORAGE = "auth_token";
const CLAVE_USUARIO = "auth_usuario";
const LOCALSTORAGE = "credenciales";

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.querySelector<HTMLFormElement>("#formulario");
  const formularioLogin =
    document.querySelector<HTMLFormElement>("#formulario-login");
  actualizarHeader();
  if (formulario) {
    validarFormulario(formulario);
  }
  if (formularioLogin) {
    validarLogin(formularioLogin, sacarCredenciales(LOCALSTORAGE));
  }
});

const sacarCredenciales = (storage: string) => {
  const credencial = localStorage.getItem(storage);
  if (credencial) {
    return credencial;
  } else {
    return false;
  }
};

/**
 * Función que comprueba el estado de autenticación y actualiza el <nav>.
 * Versión con appendChild/removeChild
 */
const actualizarHeader = () => {
  const menu = document.querySelector(".menu");
  const token = sessionStorage.getItem(SESSIONSTORAGE);

  if (!menu) return;

  if (token) {
    const nombreUsuario = sessionStorage.getItem(CLAVE_USUARIO);
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
    if (!menu.querySelector(".nav-nombre-usuario")) {
      const nombreUsuarioSpan = document.createElement("span");
      nombreUsuarioSpan.className = "nav-nombre-usuario";
      nombreUsuarioSpan.textContent = `Hola, ${nombreUsuario}`;
      menu.appendChild(nombreUsuarioSpan);
    }

    // 3. Crear y añadir el botón de "Cerrar Sesión" (solo si no existe ya)
    if (!menu.querySelector("#cerrar-sesion-button")) {
      const cerrarSesionBoton = document.createElement("a");
      cerrarSesionBoton.href = "#";
      cerrarSesionBoton.id = "logout-button";
      cerrarSesionBoton.textContent = "Cerrar Sesión";

      // 4. Añadir el listener para el logout
      cerrarSesionBoton.addEventListener("click", (e) => {
        e.preventDefault();
        cerrarSesion(SESSIONSTORAGE, CLAVE_USUARIO);
      });

      menu.appendChild(cerrarSesionBoton);
    }
  } else {
    // --- USUARIO NO LOGUEADO ---

    // 1. Quitar los elementos de "nombre-usuario" y "Cerrar Sesión"
    const nombreUsuarioSpan = menu.querySelector(".nav-nombre-usuario");
    const cerrarSesionBoton = menu.querySelector("#cerrar-sesion-boton");

    if (nombreUsuarioSpan) {
      menu.removeChild(nombreUsuarioSpan);
    }
    if (cerrarSesionBoton) {
      menu.removeChild(cerrarSesionBoton);
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
