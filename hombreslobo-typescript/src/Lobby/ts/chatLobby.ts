import Pusher from "pusher-js";
import { obtenerJugadorActual } from "../../providers/obtenerJugadorActual";

const txtMensaje = document.querySelector<HTMLInputElement>('.chat-input input');
const btnEnviar = document.querySelector<HTMLButtonElement>('#enviar');
const ulMessages = document.querySelector<HTMLUListElement>('.chat-input .mensajes');


if (!txtMensaje || !btnEnviar || !ulMessages) {
    throw new Error('No se encontraron todos los elementos del DOM necesarios.');
}


const partidaId = sessionStorage.getItem("partida_id");
const token = sessionStorage.getItem("auth_token");
const wsHost = 'localhost';
const wsPort = 8080;
const apiPort = 8000;
const apiUrl = `http://${wsHost}:${apiPort}/api/chat/send`;

const resJugador = await obtenerJugadorActual();
if (!resJugador.ok) {
    console.error("Error obteniendo jugador:", resJugador.error);
    throw new Error("No se pudo obtener el jugador actual");
}
const jugador = resJugador.datos; 




const pusher = new Pusher('cw5xkporz11sccbkkxni', {
    wsHost,
    wsPort,
    forceTLS: false,
    enabledTransports: ['ws'],
    cluster: 'mt1',
    disableStats: true,
});


const channel = pusher.subscribe('lobby.'+partidaId);


channel.bind('message.sent', (data: { message: string, username: string }) => {

    const li = document.createElement('li');
    li.classList.add('mensaje');

    if(data.username == jugador.nickname){    
        li.classList.add('propio');
        li.innerHTML = `</span> ${data.message}`;
    } else {
        li.classList.add('otros');
        li.innerHTML = `
        <span>${data.username}:</span> ${data.message}`;
    }
    ulMessages.appendChild(li);
    ulMessages.scrollTop = ulMessages.scrollHeight; 
});


btnEnviar.addEventListener('click', () => {
    const mensaje = txtMensaje.value.trim();
    if (!mensaje) return;

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

