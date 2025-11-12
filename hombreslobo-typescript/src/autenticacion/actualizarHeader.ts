import { cerrarSesion } from "./cerrarSesion";

cerrarSesion;

export const actualizarHeader = (sesion: string, clave: string) => {
  const menu = document.querySelector(".menu");
  const token = sessionStorage.getItem(sesion);

  if (!menu) return;

  if (token) {
    const nombreUsuario = sessionStorage.getItem(clave);
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

      const nombreUsuarioLink = document.createElement("a");
      nombreUsuarioLink.className = "nombre-usuario";
      nombreUsuarioLink.innerHTML = `${nombreUsuario}`;

      const verPerfil = document.createElement("a");
      verPerfil.className = "ver-perfil";
      verPerfil.textContent = "Ver perfil";
      divSesion.appendChild(nombreUsuarioLink);
      divSesion.appendChild(verPerfil);

      const cerrarSesionBoton = document.createElement("a");
      cerrarSesionBoton.href = "#";
      cerrarSesionBoton.id = "logout-button";
      cerrarSesionBoton.innerHTML = `
  <span class="material-symbols-outlined">
    logout
  </span>
`;

      // 4. Añadir el listener para el logout
      cerrarSesionBoton.addEventListener("click", (e) => {
        e.preventDefault();
        cerrarSesion(sesion, clave);
      });
      divSesion.appendChild(cerrarSesionBoton);
      menu.appendChild(divSesion);
    }
  } else {
    // --- USUARIO NO LOGUEADO ---

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
