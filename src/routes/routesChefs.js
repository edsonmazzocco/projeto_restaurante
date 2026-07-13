import Router from "express";

import { SUCCESS_REQUEST, CREATED_SUCCESS_REQUEST, BAD_REQUEST_ERROR, NOT_FOUND_ERROR, INTERNAL_SERVER_ERROR} from "../constants/server.js";
import { ChefsEntity } from "../entidades/Chefs.js";
import { AppDataSource } from "../config/database_postgres.js";

const routesChefs = new Router();
const chefsRepository = AppDataSource.getRepository(ChefsEntity);

//Rota para listar todos os chefs
routesChefs.get('/chefs', async (request, response) => {
    response.status(SUCCESS_REQUEST).send(await chefsRepository.find());
});

//Rota para listar um chef específico por ID
routesChefs.get('/chef/:id', async (request, response) => {
    const id = parseInt(request.params.id);
    const chef = await chefsRepository.findOneBy({ id: id });

    if (!chef) {
        return response.status(NOT_FOUND_ERROR).send({ error: 'Chef não encontrado!' });
    } else {
        response.status(SUCCESS_REQUEST).send(chef);
    }
});

//Rota para cadastrar um chef
routesChefs.post('/chef', async (request, response) => {
    const dados = request.body;

    if ((!dados.nome) || (typeof dados.nome !== 'string') || (dados.nome.trim() === '')) {
        response.status(BAD_REQUEST_ERROR).send({ error: 'Nome Inválido!' });
    } else if (typeof dados.faz_sobremesa !== 'boolean') {
        response.status(BAD_REQUEST_ERROR).send({ error: 'Obrigatório informar se o chef faz sobremesa!' });
    } else {
        const chefCriado = await chefsRepository.save(dados);
        response.status(CREATED_SUCCESS_REQUEST).send(chefCriado);
    } 
});

//Rota para deletar um chef
routesChefs.delete('/chef/:id', async (request, response) => {
    const id = parseInt(request.params.id);

    const chef = await chefsRepository.findOneBy({ id: id });
    if (!chef) {
        return response.status(NOT_FOUND_ERROR).send({ error: 'Chef não encontrado!' });
    } else {
        await chefsRepository.delete(id);
        response.status(SUCCESS_REQUEST).send({ message: 'Chef deletado com sucesso!' });
    }
});

//Rota para atualizar um chef
routesChefs.put('/chef/:id', async (request, response) => {
    const id = parseInt(request.params.id);
    const novosDados = request.body;

    if (novosDados.hasOwnProperty('nome')) {
        if (!novosDados.nome || typeof novosDados.nome !== 'string' || novosDados.nome.trim() === '') {
            return response.status(BAD_REQUEST_ERROR).send({ error: 'Nome Inválido!' });
        }
    }

    if (novosDados.hasOwnProperty('faz_sobremesa')) {
        if (typeof novosDados.faz_sobremesa !== 'boolean') {
            return response.status(BAD_REQUEST_ERROR).send({ error: 'Obrigatório informar se o chef faz sobremesa!' });
        }
    }
    
    const chef = await chefsRepository.findOneBy({ id });
    if (!chef) {
        response.status(NOT_FOUND_ERROR).send({ error: 'Chef não encontrado!' });
    } else {
        await chefsRepository.update(id, novosDados);
        const chefAtualizado = await chefsRepository.findOneBy({ id });
        response.status(SUCCESS_REQUEST).send(chefAtualizado);
    } 
});

export default routesChefs;