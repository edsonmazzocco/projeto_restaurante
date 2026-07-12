import Router from "express";

import Mesa from "../classes/Mesa.js";
import { BAD_REQUEST_ERROR, CREATED_SUCCESS_REQUEST, SUCCESS_REQUEST} from "../constants/server.js";
import { MesaEntity } from "../entidades/Mesa.js";
import { AppDataSource } from "../config/database_postgres.js";

const routesMesas = new Router();

//Rota para listar todas as mesas
routesMesas.get('/mesas', async (request, response) => {
    const mesaRepository = AppDataSource.getRepository(MesaEntity);
    response.status(SUCCESS_REQUEST).send(await mesaRepository.find());
});

//Rota para cadastrar mesas
routesMesas.post('/mesa', async (request, response) => {
    const dados = request.body;

    if ((!dados.nome) || (typeof dados.nome !== 'string') || (dados.nome.trim() === '')) {
        return response.status(BAD_REQUEST_ERROR).send({ error: 'Nome Inválido!' });
    } else {
        const mesaRepository = AppDataSource.getRepository(MesaEntity);
        const mesaCriada = await mesaRepository.save(dados);
        response.status(CREATED_SUCCESS_REQUEST).send(mesaCriada);
    }
});

export default routesMesas;