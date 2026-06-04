import express from 'express';

import { PORTA } from './constants/server.js';
import routesMesas from './routes/routesMesas.js';
import routesMenus from './routes/routesMenus.js';

const app = express();
app.use(express.json()); // Habilita o servidor para reconhecer formato JSON no body das requisições
app.use(routesMesas); // Habilita as rotas de mesas
app.use(routesMenus); // Habilita as rotas de menus

app.listen(PORTA, () => {
  console.log(`🚀🚀🚀 Servidor rodando! Endereço: http://localhost:${PORTA}`);
});