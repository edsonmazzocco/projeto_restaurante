import {Router} from "express";
import { ChefsEntity } from "../entidades/Chefs.js";
import { AppDataSource } from "../config/database_postgres.js";
import { SUCCESS_REQUEST, CREATED_SUCCESS_REQUEST, BAD_REQUEST_ERROR, NOT_FOUND_ERROR, INTERNAL_SERVER_ERROR} from "../constants/server.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { verifyIdExistsHandler } from "../middlewares/verifyIdExistsHandler.js";

const routesChefs = new Router();
const chefsRepository = AppDataSource.getRepository(ChefsEntity);

//Rota para listar todos os chefs
routesChefs.get('/chefs', asyncHandler(async (request, response) => {
    response.status(SUCCESS_REQUEST).send(await chefsRepository.find());
}));

//Rota para listar um chef específico por ID
routesChefs.get('/chef/:id',
    verifyIdExistsHandler(ChefsEntity, "Chef"),
    asyncHandler(async (request, response) => {
        response.status(SUCCESS_REQUEST).send(request.registro);
}));

//Rota para cadastrar um chef
routesChefs.post('/chef', asyncHandler(async (request, response) => {
    const dados = request.body;

    if ((!dados.nome) || (typeof dados.nome !== 'string') || (dados.nome.trim() === '')) {
        response.status(BAD_REQUEST_ERROR).send({ error: 'Nome Inválido!' });
    } else if (typeof dados.faz_sobremesa !== 'boolean') {
        response.status(BAD_REQUEST_ERROR).send({ error: 'Obrigatório informar se o chef faz sobremesa!' });
    } else {
        const chefCriado = await chefsRepository.save(dados);
        response.status(CREATED_SUCCESS_REQUEST).send(chefCriado);
    } 
}));

//Rota para deletar um chef
routesChefs.delete('/chef/:id',
    verifyIdExistsHandler(ChefsEntity, "Chef"),
    asyncHandler(async (request, response) => {
        const id = parseInt(request.params.id);

        await chefsRepository.delete(id);
        response.status(SUCCESS_REQUEST).send({ message: 'Chef deletado com sucesso!' });
}));

// Rota Exemplo de Delete. Se o chef faz sobremesa, não pode ser deletado.
/*
routesChefs.delete('/chef/:id', async (request, response) => {
    const id = request.params.id;

    const chef = await chefsRepository.findOneBy({ id: id });
    if (!chef) {
        response.status(NOT_FOUND_ERROR).send({ error: 'Chef não encontrado!' });
    } else {
        if (chef.faz_sobremesa) {
            response.status(BAD_REQUEST_ERROR).send({ error: 'Não é possível deletar um chef que faz sobremesa!' });
        } else {
            await chefsRepository.delete(id);
            response.status(SUCCESS_REQUEST).send({ message: 'Chef deletado com sucesso!' });
        }
    }
});
*/


//Rota para atualizar um chef
routesChefs.put('/chef/:id',
    verifyIdExistsHandler(ChefsEntity, "Chef"),
    asyncHandler(async (request, response) => {
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

    await chefsRepository.update(id, novosDados);
    const chefAtualizado = await chefsRepository.findOneBy({ id });
    response.status(SUCCESS_REQUEST).send(chefAtualizado);
}));

export default routesChefs;