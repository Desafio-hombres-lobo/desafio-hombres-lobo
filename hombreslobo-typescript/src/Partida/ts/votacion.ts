const overlay = document.getElementById("resultado") as HTMLDivElement;

export function mostrarVotacion(mensaje: string) {
  const textoElemento = document.getElementById("texto-votacion");
  if (textoElemento) textoElemento.textContent = mensaje;

  overlay.classList.add("show");
}

export function cerrarVotacion() {
  overlay?.classList.remove("show");
}
