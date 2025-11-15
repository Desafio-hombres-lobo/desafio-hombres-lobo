import "./css/admin.css";

const SESSIONSTORAGE = "auth_token";
const ROL_USUARIO = "auth_rol";
const CLAVE_USUARIO = "auth_usuario";
const LOCALSTORAGE = "credenciales";

const btnVerUsuario = document.getElementById("btn-mostrar-todos");
const btnEncontrarUsuario = document.getElementById("btn-buscar-uno");
const btnBorrarUsuario = document.getElementById("btn-borrar-uno");
const entradaUsuario = document.getElementById(
  "input-usuario"
) as HTMLInputElement;
const resultado = document.getElementById("salida-resultados");

const rolUsuario = sessionStorage.getItem(ROL_USUARIO);
const panel = document.getElementById("panel-admin");

if (rolUsuario !== "admin" && panel) {
  panel.classList.add("oculto");
  const body = document.getElementById("response");
  const texto = document.createElement("h1");
  texto.innerHTML = "No tienes permiso para ver esta página";
  if (body) body.appendChild(texto);
} else {
  panel?.classList.remove("oculto");
}
