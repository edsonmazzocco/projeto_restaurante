import express from 'express';

import { PORTA } from './constants/server.js';

import {AppDataSource} from './config/database_postgres.js';
import routesMesas from './routes/routesMesas.js';
import routesMenus from './routes/routesMenus.js';
import routesChefs from './routes/routesChefs.js';

const app = express();
app.use(express.json()); // Habilita o servidor para reconhecer formato JSON no body das requisições
app.use(routesMesas); // Habilita as rotas de mesas
app.use(routesMenus); // Habilita as rotas de menus
app.use(routesChefs); // Habilita as rotas de chefs

try {
  await AppDataSource.initialize();
  
  app.listen(PORTA, () => {
  console.log(`🚀🚀🚀 Servidor rodando! Endereço: http://localhost:${PORTA}`);
});
}

catch (error) {
  console.error("Erro ao conectar com o banco de dados:", error);
  process.exit(1); // Encerra o processo com código de erro
}

