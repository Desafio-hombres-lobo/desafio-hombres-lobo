export class Jugador {
  id_jugador: number;
  id_partida: number;
  id_personaje: number; // 1 = Aldeano, 2 = Lobo
  estado: number;
  nickname: string;
  bot: boolean;

  constructor(
    id_jugador: number,
    id_partida: number,
    id_personaje: number,
    estado: number,
    nickname: string,
    bot: boolean,
  ) {
    this.id_jugador = id_jugador;
    this.id_partida = id_partida;
    this.id_personaje = id_personaje;
    this.estado = estado;
    this.nickname = nickname;
    this.bot = bot;
  }
}
