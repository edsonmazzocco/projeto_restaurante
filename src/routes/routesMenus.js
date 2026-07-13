import Router from "express";

import Menu from "../classes/Menu.js";
import { SUCCESS_REQUEST, CREATED_SUCCESS_REQUEST, BAD_REQUEST_ERROR, NOT_FOUND_ERROR, INTERNAL_SERVER_ERROR} from "../constants/server.js";
import { MenusEntity } from "../entidades/Menus.js";
import { AppDataSource } from "../config/database_postgres.js";

const routesMenus = new Router();
const menusRepository = AppDataSource.getRepository(MenusEntity);

//Rota para listar todos os menus
routesMenus.get('/menus', async (request, response) => {
    response.status(SUCCESS_REQUEST).send(await menusRepository.find());
});

//Rota para listar um menu específico por ID
routesMenus.get('/menu/:id', async (request, response) => {
    const id = parseInt(request.params.id);
    const menu = await menusRepository.findOneBy({ id: id });

    if (!menu) {
        return response.status(NOT_FOUND_ERROR).send({ error: 'Menu não encontrado!' });
    } else {
        response.status(SUCCESS_REQUEST).send(menu);
    }
});

//Rota para cadastrar menus
routesMenus.post('/menu', async (request, response) => {
    const dados = request.body;

    if ((!dados.nome) || (typeof dados.nome !== 'string') || (dados.nome.trim() === '')) {
        return response.status(BAD_REQUEST_ERROR).send({ error: 'Nome Inválido!' });
    } else if ((!dados.preco) || (typeof dados.preco !== 'number') || (dados.preco < 0)) {
        return response.status(BAD_REQUEST_ERROR).send({ error: 'Preço Inválido!' });
    } else if ((!dados.categoria) || (typeof dados.categoria !== 'string') || (dados.categoria.trim() === '')) {
        return response.status(BAD_REQUEST_ERROR).send({ error: 'Categoria Inválida!' });
    } else if (dados.tamanho !== "P" && dados.tamanho !== "M" && dados.tamanho !== "G") {
        return response.status(BAD_REQUEST_ERROR).send({ error: 'Tamanho Inválido! Valores aceitos: P, M ou G' });
    } else {
        const menuCriado = await menusRepository.save(dados);
        response.status(CREATED_SUCCESS_REQUEST).send(menuCriado);
    } 
});

//Rota para deletar um menu
routesMenus.delete('/menu/:id', async (request, response) => {
    const id = parseInt(request.params.id);

    const menu = await menusRepository.findOneBy({ id: id });
    if (!menu) {
        return response.status(NOT_FOUND_ERROR).send({ error: 'Menu não encontrado!' });
    } else {
        await menusRepository.delete(id);
        response.status(SUCCESS_REQUEST).send({ message: 'Menu deletado com sucesso!' });
    }
});

//Rota para atualizar um menu
routesMenus.put('/menu/:id', async (request, response) => {
    const id = parseInt(request.params.id);
    const novosDados = request.body;

    if (novosDados.hasOwnProperty('nome')) {
        if (!novosDados.nome || typeof novosDados.nome !== 'string' || novosDados.nome.trim() === '') {
            return response.status(BAD_REQUEST_ERROR).send({ error: 'Nome Inválido!' });
        }
    }

    if (novosDados.hasOwnProperty('preco')) {
        if (typeof novosDados.preco !== 'number' || novosDados.preco < 0) {
            return response.status(BAD_REQUEST_ERROR).send({ error: 'Preço Inválido!' });
        }
    }

    if (novosDados.hasOwnProperty('categoria')) {
        if (!novosDados.categoria || typeof novosDados.categoria !== 'string' || novosDados.categoria.trim() === '') {
            return response.status(BAD_REQUEST_ERROR).send({ error: 'Categoria Inválida!' });
        }
    }

    if (novosDados.hasOwnProperty('tamanho')) {
        if (novosDados.tamanho !== "P" && novosDados.tamanho !== "M" && novosDados.tamanho !== "G") {
            return response.status(BAD_REQUEST_ERROR).send({ error: 'Tamanho Inválido! Valores aceitos: P, M ou G' });
        }
    }

    const menu = await menusRepository.findOneBy({ id });
    if (!menu) {
        return response.status(NOT_FOUND_ERROR).send({ error: 'Menu não encontrado!' });
    }

    await menusRepository.update(id, novosDados);
    const menuAtualizado = await menusRepository.findOneBy({ id });
    return response.status(SUCCESS_REQUEST).send(menuAtualizado);
});

export default routesMenus;