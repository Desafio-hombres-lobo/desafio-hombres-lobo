export function initModal() {
  const modal = document.getElementById('modalJuego');
  const openBtn = document.getElementById('empezar-juego');
  

  if (!modal || !openBtn) return;

  // Abrir modal
  openBtn.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  // Cerrar haciendo clic fuera
  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });
}


