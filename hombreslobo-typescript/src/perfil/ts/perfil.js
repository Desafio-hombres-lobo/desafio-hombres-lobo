const formCambiarNickname = document.querySelector("#form-nickname");

const nuevoNicknameUsuario = formCambiarNickname.querySelector(
  'input[name="nuevo-nickname"]'
);

formCambiarNickname?.addEventListener("submit", () => {
  console.log("Botón cambiar nickname pulsado");

  if (nuevoNicknameUsuario.value.length <= 0) {
    alert("El nickname no puede estar vacío");
    return;
  } else {
    alert("Nickname cambiado correctamente");
  }
});
