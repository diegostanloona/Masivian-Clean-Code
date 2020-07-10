import { Application } from "https://deno.land/x/oak/mod.ts";
import apiRoutes from './routes/api.ts';

const port = 3000;
const app = new Application();

app.use(apiRoutes.routes());
app.use(apiRoutes.allowedMethods());


const server = await app.listen({port:port});
console.log("Hola");