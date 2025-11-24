import Pusher from "pusher-js";

Pusher.logToConsole = true;

export const pusher = new Pusher("cwun5aql87erbilklzk7", {
  wsHost: "127.0.0.1",
  wsPort: 8080,
  forceTLS: false,
  enabledTransports: ["ws"],
  cluster: "mt1",
  disableStats: true, // Evita llamadas externas
  // Evitamos reconexión automática infinita
  //reconnectAttempts: 0,
  //reconnectDelay: 0,
});
