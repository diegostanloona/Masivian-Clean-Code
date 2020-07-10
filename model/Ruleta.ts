import Apuesta from './Apuesta.ts';

export default interface Ruleta {
	id_ruleta?: string;
	estado_ruleta: string;
	apuestas: Apuesta[];
}