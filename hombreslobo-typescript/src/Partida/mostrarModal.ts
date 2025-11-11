
export function initModal() {
  const modal = document.getElementById('modalJuego')
  const openBtn = document.getElementById('empezar-juego')

  if (!modal || !openBtn) return;

  openBtn.addEventListener('click', () => modal.style.display = 'block');

  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });


}

