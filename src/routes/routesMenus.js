import Router from "express";

import Menu from "../classes/Menu.js";
import { SUCCESS_REQUEST, CREATED_SUCCESS_REQUEST, BAD_REQUEST_ERROR, NOT_FOUND_ERROR, INTERNAL_SERVER_ERROR} from "../constants/server.js";
import { MenusEntity } from "../entidades/Menus.js";
import { AppDataSource } from "../config/database_postgres.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { verifyIdExistsHandler } from "../middlewares/verifyIdExistsHandler.js";
import { validateUpdateMenu } from "../middlewares/validations/menus/validateUpdateMenu.js";

const routesMenus = new Router();
const menusRepository = AppDataSource.getRepository(MenusEntity);

//Rota para listar todos os menus
routesMenus.get('/menus', asyncHandler(async (request, response) => {
    response.status(SUCCESS_REQUEST).send(await menusRepository.find());
    // É o mesmo que: send(await AppDataSource.queries(`SELECT * FROM menus`));
}));

//Rota para listar um menu específico por ID
routesMenus.get('/menu/:id',
    verifyIdExistsHandler(MenusEntity, "Menu"),
    asyncHandler(async (request, response) => {
        response.status(SUCCESS_REQUEST).send(request.registro);
}));

//Rota para cadastrar menus
routesMenus.post('/menu', asyncHandler(async (request, response) => {
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
}));

//Rota para deletar um menu
routesMenus.delete('/menu/:id',
    verifyIdExistsHandler(MenusEntity, "Menu"),
    asyncHandler(async (request, response) => {
        const id = parseInt(request.params.id);

        await menusRepository.delete(id);
        response.status(SUCCESS_REQUEST).send({ message: 'Menu deletado com sucesso!' });
}));

//Rota para atualizar um menu
routesMenus.put('/menu/:id', 
    verifyIdExistsHandler(MenusEntity, "Menu"), // verifica se o ID existe antes de atualizar
    validateUpdateMenu, // valida os dados antes de atualizar
    asyncHandler(async (request, response) => {
    const id = parseInt(request.params.id);
    const novosDados = request.body;

    await menusRepository.update(id, novosDados);
    const menuAtualizado = await menusRepository.findOneBy({ id });
    response.status(SUCCESS_REQUEST).send(menuAtualizado);
}));

export default routesMenus;