import { initModalUnirse } from './unirsePartida';
import { initModalCrearPartida } from './crearPartida';

export function initModal() {
  const modal = document.getElementById('modalJuego');
  const cerrar = document.getElementById('cerrarModal');  

  if (!modal) return;


  initModalUnirse();
  initModalCrearPartida();


  if (cerrar) {
    cerrar.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });
}

export function abrirModalJugar() {
  const modal = document.getElementById('modalJuego');
  const modalCrear = document.getElementById("modalCrear");
  const modalUnirse = document.getElementById("modalUnirse");
  const token = sessionStorage.getItem("auth_token");

  if (!modal) return;

  if (!token) {
    window.location.href = "/src/autenticacion/htmls/login.html";
    return;
  }

  if (modalCrear) modalCrear.style.display = "none";
  if (modalUnirse) modalUnirse.style.display = "none";
  modal.style.display = 'block';
}



