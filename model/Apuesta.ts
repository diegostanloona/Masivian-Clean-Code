export default interface Apuesta{
	id_apuesta?: string;
	id_usuario: string | null | undefined;
	numero_apuesta?: number;
	valor_apuesta: number;
	color_apuesta?: string;
}