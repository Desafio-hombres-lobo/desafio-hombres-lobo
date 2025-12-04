export class Jugador {
  id_jugador: number;
  id_partida: number;
  id_personaje: number; // 1 = Aldeano, 2 = Lobo
  estado: string;
  nickname: string;
  bot: boolean;
  eliminado?: boolean;

  constructor(
    id_jugador: number,
    id_partida: number,
    id_personaje: number,
    estado: string,
    nickname: string,
    bot: boolean,
    eliminado: boolean = false
  ) {
    this.id_jugador = id_jugador;
    this.id_partida = id_partida;
    this.id_personaje = id_personaje;
    this.estado = estado;
    this.nickname = nickname;
    this.bot = bot;
    this.eliminado = eliminado;
  }
}
