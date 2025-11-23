import Pusher from "pusher-js";


const txtMensaje = document.querySelector<HTMLInputElement>('.chat-input input');
const btnEnviar = document.querySelector<HTMLButtonElement>('#enviar');
const ulMessages = document.querySelector<HTMLUListElement>('.chat-input .mensajes');


if (!txtMensaje || !btnEnviar || !ulMessages) {
    throw new Error('No se encontraron todos los elementos del DOM necesarios.');
}


const partidaId = localStorage.getItem("partida_id");
const token = sessionStorage.getItem("auth_token");
const wsHost = 'localhost';
const wsPort = 8080;
const apiPort = 8000;
const apiUrl = `http://${wsHost}:${apiPort}/api/chat/send`;


const pusher = new Pusher('cw5xkporz11sccbkkxni', {
    wsHost,
    wsPort,
    forceTLS: false,
    enabledTransports: ['ws'],
    cluster: 'mt1',
    disableStats: true,
});


const channel = pusher.subscribe('chat.'+partidaId);


channel.bind('message.sent', (data: { message: string }) => {
    console.log('Mensaje recibido desde servidor:', data.message);
    const li = document.createElement('li');
    li.textContent = data.message;
    li.classList.add('list-group-item');
    ulMessages.appendChild(li);
});


btnEnviar.addEventListener('click', () => {
    const mensaje = txtMensaje.value.trim();
    if (!mensaje) return;

    const payload = {
        message: mensaje,
        timestamp: new Date().toISOString(),
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            message: mensaje,
            partida_id: partidaId
        }),
    })
    
    .then(res => res.json())
    .then(resp => {
        console.log('Confirmación del servidor:', resp);
        txtMensaje.value = '';
    })
    .catch(err => console.error('Error al enviar:', err));
});


