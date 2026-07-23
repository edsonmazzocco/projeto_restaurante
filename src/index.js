import express from 'express';

import { PORTA } from './constants/server.js';

import {AppDataSource} from './config/database_postgres.js';

import routesMesas from './routes/routesMesas.js';
import routesMenus from './routes/routesMenus.js';
import routesChefs from './routes/routesChefs.js';
import routesPedidos from './routes/routesPedidos.js';
import routesItemsPedidos from './routes/routesItemsPedidos.js';
import authRoutes from './routes/auth.routes.js';

import { captureLog } from './middlewares/capturelog.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
app.use(express.json()); // Habilita o servidor para reconhecer formato JSON no body das requisições

app.use(captureLog); // Middleware para capturar logs de todas as requisições

app.use(authRoutes); // Habilita as rotas de autenticação
app.use(routesMesas); // Habilita as rotas de mesas
app.use(routesMenus); // Habilita as rotas de menus
app.use(routesChefs); // Habilita as rotas de chefs
app.use(routesPedidos); // Habilita as rotas de pedidos
app.use(routesItemsPedidos); // Habilita as rotas de items de pedidos

app.use(errorHandler); // Middleware para lidar com erros e enviar uma resposta adequada ao cliente

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

