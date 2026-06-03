import Router from "express";

import Mesa from "../classes/Mesa.js";
import { BAD_REQUEST_ERROR, CREATED_SUCCESS_REQUEST, SUCCESS_REQUEST} from "../constants/server.js";

const routesMesas = new Router();

//Rota para listar todas as mesas
routesMesas.get('/mesas', async (request, response) => {
    response.status(SUCCESS_REQUEST).send(await Mesa.listarTodos());
});

//Rota para cadastrar mesas
routesMesas.post('/mesa', async (request, response) => {
    const dados = request.body;

    if ((!dados.nome) || (typeof dados.nome !== 'string') || (dados.nome.trim() === '')) {
        return response.status(BAD_REQUEST_ERROR).send({ error: 'Nome Inválido!' });
    } else {
        const mesa = new Mesa(dados.nome);
        const data = await mesa.criar();
        response.status(CREATED_SUCCESS_REQUEST).send(data);
    }
});

export default routesMesas;