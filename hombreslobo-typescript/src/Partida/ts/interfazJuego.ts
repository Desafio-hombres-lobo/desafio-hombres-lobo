import { getJugador } from "../../autenticacion/ts/auth";

export class interfazJuego {
  // Elementos del DOM
  private listaMensajes: HTMLElement;
  private inputMensaje: HTMLInputElement;
  public formChat: HTMLFormElement; // Public para el EventListener
  private centroInfo: HTMLElement;
  private spanFase: HTMLElement;
  private headerChat: HTMLElement;
  private reloj: HTMLElement;
  private btnIniciar: HTMLButtonElement;
  private textoEspera: HTMLElement;
  private contenedorCarta: HTMLElement;
  private btnNinia: HTMLButtonElement;

  constructor() {
    this.listaMensajes = document.getElementById("lista-mensajes")!;
    this.inputMensaje = document.getElementById(
      "input-mensaje"
    ) as HTMLInputElement;
    this.formChat = document.getElementById("form-chat") as HTMLFormElement;
    this.centroInfo = document.querySelector(".centro-info") as HTMLElement;
    this.spanFase = document.getElementById("fase-partida")!;
    this.headerChat = document.getElementById("h3-chat")!;
    this.reloj = document.getElementById("reloj-partida")!;
    this.btnIniciar = document.getElementById(
      "btn-iniciar"
    ) as HTMLButtonElement;
    this.textoEspera = document.getElementById("texto-espera")!;
    this.contenedorCarta = document.querySelector(
      ".grid-tablero"
    ) as HTMLElement;
    this.btnNinia = document.getElementById("btn-niña") as HTMLButtonElement;
  }

  // --- MÉTODOS VISUALES ---

  public actualizarFase(esDia: boolean) {
    if (esDia) {
      this.spanFase.innerHTML = "FASE: DÍA";
      this.headerChat.innerHTML = "CHAT DE LA ALDEA";
      this.centroInfo.classList.remove("fase-noche");
      this.centroInfo.classList.add("fase-dia");
      this.listaMensajes.classList.remove("chat-noche");
      this.btnNinia.classList.add("oculto");
    } else {
      this.spanFase.innerHTML = "FASE: NOCHE";
      this.headerChat.innerHTML = "CHAT DE LOS LOBOS";
      this.centroInfo.classList.remove("fase-dia");
      this.centroInfo.classList.add("fase-noche");
    }
  }

  public configurarInputChat(habilitado: boolean, placeholder: string) {
    this.inputMensaje.disabled = !habilitado;
    this.inputMensaje.placeholder = placeholder;
  }

  public toggleModoChatNoche(activar: boolean) {
    if (activar) {
      this.listaMensajes.classList.add("chat-noche");
    } else {
      this.listaMensajes.classList.remove("chat-noche");
    }
  }

  public toggleBotonNinia(mostrar: boolean, callbackClick?: () => void) {
    if (mostrar) {
      this.btnNinia.classList.remove("oculto");
      if (callbackClick) {
        this.btnNinia.onclick = callbackClick;
      }
    } else {
      this.btnNinia.classList.add("oculto");
    }
  }

  public pintarMensaje(usuario: string, texto: string, esPropio: boolean) {
    const div = document.createElement("div");
    div.classList.add("msg");

    if (esPropio) {
      div.classList.add("propio");
      div.innerHTML = `<strong>Tú:</strong> ${texto}`;
    } else {
      div.innerHTML = `<strong>${usuario}:</strong> ${texto}`;
    }

    this.listaMensajes.appendChild(div);
    this.listaMensajes.scrollTop = this.listaMensajes.scrollHeight;
  }

  public pintarMensajeSistema(texto: string) {
    const div = document.createElement("div");
    div.classList.add("msg", "sistema");
    div.innerHTML = texto;
    this.listaMensajes.appendChild(div);
    this.listaMensajes.scrollTop = this.listaMensajes.scrollHeight;
  }

  public actualizarReloj(texto: string) {
    this.reloj.innerHTML = texto;
  }

  public ocultarTextoEspera() {
    if (this.textoEspera) this.textoEspera.classList.add("oculto");
  }

  public toggleBtnIniciar(mostrar: boolean, texto: string = "Iniciar") {
    if (!mostrar) {
      this.btnIniciar.classList.add("oculto");
    } else {
      this.btnIniciar.classList.remove("oculto");
      this.btnIniciar.disabled = false;
      this.btnIniciar.innerText = texto;
    }
  }

  public deshabilitarBtnIniciar(textoCarga: string) {
    this.btnIniciar.disabled = true;
    this.btnIniciar.innerText = textoCarga;
  }

  public mostrarFinPartida(
    textoTitulo: string,
    divDestino: HTMLElement | null
  ) {
    const overlay = document.createElement("div");
    overlay.classList.add("fin-overlay");
    overlay.innerHTML = `
        <div class="fin-contenedor" id="contenedor-final">
          <h1>${textoTitulo}</h1>
        </div>
      `;
    document.body.appendChild(overlay);

    return document.getElementById("contenedor-final");
  }

  public get mensajeInput(): string {
    return this.inputMensaje.value.trim();
  }

  public limpiarInput() {
    this.inputMensaje.value = "";
  }

  public get contenedorTablero(): HTMLElement {
    return this.contenedorCarta;
  }

  public get listaMensajesElement(): HTMLElement {
    return this.listaMensajes;
  }

  public get btnNiniaElement(): HTMLButtonElement {
    return this.btnNinia;
  }
}
