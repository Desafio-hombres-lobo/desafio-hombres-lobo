import { obtenerNuevaPassword } from "../../providers/obtenerNuevaPassword";

export const cambiarPasswordUsuario = async (): Promise<void> => {
  //   Pedir confirmación antes de cambiar la contraseña
  const confirmacion = confirm(
    "¿Estás seguro de que quieres solicitar una nueva contraseña? Se enviará a tu correo."
  );

  if (!confirmacion) {
    return;
  } else {
    alert("Contraseña reestablecida correctamente, mira tu email.");
    await obtenerNuevaPassword();
  }
};
