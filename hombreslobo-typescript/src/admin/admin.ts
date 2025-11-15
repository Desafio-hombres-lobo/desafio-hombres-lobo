import "./css/admin.css";
import {
  cogerTodosLosUsuarios,
  cogerUnUsuario,
  borrarUsuario,
  actualizarUsuario,
} from "../providers/envioDatosAdmin";
const SESSIONSTORAGE = "auth_token";
const ROL_USUARIO = "auth_rol";
const CLAVE_USUARIO = "auth_usuario";
const LOCALSTORAGE = "credenciales";

const btnVerUsuarios = document.getElementById("btn-mostrar-todos")!;
const btnEncontrarUsuario = document.getElementById("btn-buscar-uno")!;
const btnBorrarUsuario = document.getElementById("btn-borrar-uno")!;
const entradaUsuario = document.getElementById(
  "input-usuario"
) as HTMLInputElement;
const resultado = document.getElementById("salida-resultados")!;
const nicknameInput = document.getElementById(
  "nickname-usuario"
) as HTMLInputElement;
const emailInput = document.getElementById("email-usuario") as HTMLInputElement;
const contraseñaInput = document.getElementById(
  "contraseña-usuario"
)! as HTMLInputElement;
const btnActualizar = document.getElementById("actualizar-usuario")!;

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

//Api responses
let idUsuarioSeleccionado: number | string | null = null;

function mostrarResultados(data: any) {
  if (resultado) resultado.textContent = JSON.stringify(data, null, 2); //El dos trabaja el indent del JSON para que se vea mas bonito
}

btnVerUsuarios.addEventListener("click", async () => {
  try {
    resultado.textContent = "Buscando...";
    const data = await cogerTodosLosUsuarios();
    mostrarResultados(data);
  } catch (error) {
    mostrarResultados({ error: (error as Error).message });
  }
});

btnEncontrarUsuario.addEventListener("click", async () => {
  idUsuarioSeleccionado = entradaUsuario.value;
  if (!idUsuarioSeleccionado) {
    alert("Por favor, introduce un ID o Nickname."); //En admin si que veo bien algun alert
    return;
  }
  try {
    resultado.textContent = "Buscando...";
    const data = await cogerUnUsuario(idUsuarioSeleccionado);
    mostrarResultados(data);

    nicknameInput.value = data.nickname;
    emailInput.value = data.email;
  } catch (error) {
    mostrarResultados({ error: (error as Error).message });
    nicknameInput.value = "";
    emailInput.value = "";
  }
});

btnActualizar.addEventListener("click", async (e) => {
  e.preventDefault();
  idUsuarioSeleccionado = entradaUsuario.value;
  if (!idUsuarioSeleccionado) {
    alert("Por favor, introduce un ID o Nickname.");
    return;
  }
  const password = contraseñaInput.value;
  const datosParaActualizar: {
    nickname: string;
    email: string;
    password?: string;
  } = {
    nickname: nicknameInput.value,
    email: emailInput.value,
  };
  if (password) {
    datosParaActualizar.password = password;
  }

  try {
    resultado.textContent = "Actualizando...";
    const data = await actualizarUsuario(
      idUsuarioSeleccionado,
      datosParaActualizar
    );

    mostrarResultados(data);
    nicknameInput.value = "";
    emailInput.value = "";
    contraseñaInput.value = "";
    entradaUsuario.value = "";
  } catch (error) {
    mostrarResultados({ error: (error as Error).message });
  }
});

btnBorrarUsuario.addEventListener("click", async () => {
  idUsuarioSeleccionado = entradaUsuario.value;
  if (!idUsuarioSeleccionado) {
    alert("Por favor, introduce un ID o Nickname.");
    return;
  }

  try {
    resultado.textContent = "Borrando...";
    const data = await borrarUsuario(idUsuarioSeleccionado);
    mostrarResultados(data);

    nicknameInput.value = "";
    emailInput.value = "";
    contraseñaInput.value = "";
    entradaUsuario.value = "";
    idUsuarioSeleccionado = null;
  } catch (error) {
    mostrarResultados({ error: (error as Error).message });
  }
});
