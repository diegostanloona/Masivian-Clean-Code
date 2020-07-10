import { Router } from "https://deno.land/x/oak/mod.ts";
import Ruleta from '../model/Ruleta.ts';
import Apuesta from '../model/Apuesta.ts';
import Db from '../mongo_connection/Db.ts';
import { config } from "https://deno.land/x/dotenv/mod.ts";

const USERNAME = config().USERNAME;
const PASSWORD = config().PASSWORD;
const DATABASE_NAME = config().DATABASE_NAME
const db = new Db(`mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.6jn2j.mongodb.net/${DATABASE_NAME}?retryWrites=true&w=majority`, `${DATABASE_NAME}`);
const router = new Router();

router.put('/api/creacion_nueva_ruleta', async (ctx) => {
	const nueva_ruleta:Ruleta = {
		estado_ruleta: "Cerrada",
		apuestas: []
	};
	const id_ruleta = await db.createDocument('ruletas', nueva_ruleta);
	ctx.response.body = {id_ruleta: id_ruleta};
	console.log(id_ruleta);
});

router.post('/api/apertura_ruleta', async (ctx) => {
	const data = await ctx.request.body();
	const id_ruleta = data.value.id_ruleta;
	const success = await db.updateDocument('ruletas', id_ruleta, 'estado_ruleta', 'Abierta');
	ctx.response.body = {success:success}
});

router.post('/api/apuesta_numero', async (ctx) => {
	const data = await ctx.request.body();
	const id_ruleta = data.value.id_ruleta;
	const id_usuario = await ctx.request.headers.get('id_usuario');
	const numero_apuesta = data.value.numero_apuesta?data.value.numero_apuesta:undefined;
	const valor_apuesta = data.value.valor_apuesta;
	const color_apuesta = data.value.color_apuesta?data.value.color_apuesta:undefined;
	console.log(data.value.numero_apuesta)
	const nueva_apuesta:Apuesta = {
		numero_apuesta: numero_apuesta,
		id_usuario: id_usuario,
		valor_apuesta: valor_apuesta,
		color_apuesta: color_apuesta
	}
	const ruleta = await db.readSingleDocument('ruletas', id_ruleta);
	ruleta.apuestas.push(nueva_apuesta);
	const success = await db.updateDocument('ruletas', id_ruleta, 'apuestas', ruleta.apuestas);
	ctx.response.body = {resp:nueva_apuesta, success: success};
});

router.post('/api/cerrar_apuesta', async (ctx) => {
	const data = await ctx.request.body();
	const id_ruleta = data.value.id_ruleta;
	const success = await db.updateDocument('ruletas', id_ruleta, 'estado_ruleta', 'Terminada');
	const ruleta = await db.readSingleDocument('ruletas', id_ruleta);
	ctx.response.body = {apuestas: ruleta.apuestas, success: success}
});

router.get('/api/listado_ruletas', async (ctx) => {
	const ruletas = await db.readAllDocuments('ruletas')
	ctx.response.body = {ruletas: ruletas};
});

export default router;