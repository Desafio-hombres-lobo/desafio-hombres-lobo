import { Jugador } from "./Jugador";
import {
  ROL_ALDEANO,
  ROL_LOBO,
  ROL_NINIA,
  ROL_VIDENTE,
  ROL_BRUJA,
} from "../../Personajes/ts/constantes_roles";

export class estadoJuego {
  public idPartida: string;
  public miNickname: string;

  public dia: boolean = true;
  public ronda: number = 0;
  public soyHost: boolean = false;
  public miRolId: number | null = null;
  public votos: number = 0;
  public chatLobosInicializado: boolean = false;
  public yaHasVotado: boolean = false;
  public rondaFinalizada: boolean = false;
  public pocionRevivir: boolean = true;
  public pocionMatar: boolean = true;

  private _jugadores: Jugador[] = [];

  constructor(idPartida: string, miNickname: string) {
    this.idPartida = idPartida;
    this.miNickname = miNickname;
  }

  public setJugadores(jugadores: Jugador[]) {
    this._jugadores = jugadores;
  }

  public setRol(rolId: number) {
    this.miRolId = rolId;
  }

  public nuevaRonda(esDia: boolean) {
    this.dia = esDia;
    this.yaHasVotado = false;
    this.rondaFinalizada = false;
    this.ronda++;
  }

  get jugadores(): Jugador[] {
    return this._jugadores;
  }

  get vivos(): Jugador[] {
    return this._jugadores.filter((j) => j.estado !== 0);
  }

  get muertos(): Jugador[] {
    return this._jugadores.filter((j) => j.estado === 0);
  }

  get lobos(): Jugador[] {
    return this.vivos.filter((j) => j.id_personaje === ROL_LOBO);
  }

  get aldeanos(): Jugador[] {
    return this.vivos.filter((j) => j.id_personaje === ROL_ALDEANO);
  }

  get bots(): Jugador[] {
    return this.vivos.filter((j) => j.bot);
  }

  get botsLobo(): Jugador[] {
    return this.bots.filter((j) => j.id_personaje === ROL_LOBO);
  }

  get aliados(): Jugador[] {
    return this.vivos.filter((j) => j.id_personaje !== ROL_LOBO);
  }

  get estoyMuerto(): boolean {
    return this.muertos.some((j) => j.nickname === this.miNickname);
  }

  get soyLobo(): boolean {
    return this.miRolId === ROL_LOBO;
  }

  get soyVidente(): boolean {
    return this.miRolId === ROL_VIDENTE;
  }

  get soyNinia(): boolean {
    return this.miRolId === ROL_NINIA;
  }
  get soyBruja(): boolean {
    return this.miRolId === ROL_BRUJA;
  }

  get puedoHablar(): boolean {
    if (this.estoyMuerto) return false;
    if (this.dia) return true;
    if (!this.dia && this.soyLobo) return true;
    return false;
  }
}
