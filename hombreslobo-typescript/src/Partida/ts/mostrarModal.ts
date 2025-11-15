export function initModal() {
  const modal = document.getElementById('modalJuego');
  const openBtn = document.getElementById('empezar-juego');
  const modalCrear = document.getElementById("modalCrear");
  const modalUnirse = document.getElementById("modalUnirse");
  const cerrar = document.getElementById('cerrarModal');  

  if (!modal || !openBtn) return;


  openBtn.addEventListener('click', () => {
    const token = sessionStorage.getItem("auth_token");
    if (!token) {
      window.location.href = "/src/autenticacion/htmls/login.html";
      return;
    }

    modalUnirse.style.display = "none";
    modalCrear.style.display = "none";
    modal.style.display = 'block';

  });

  cerrar.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });
}


