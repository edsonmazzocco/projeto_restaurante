import Router from "express";

import Menu from "../classes/Menu.js";
import { BAD_REQUEST_ERROR, CREATED_SUCCESS_REQUEST, SUCCESS_REQUEST} from "../constants/server.js";

const routesMenus = new Router();

//Rota para listar todos os menus
routesMenus.get('/menus', async (request, response) => {
    response.status(SUCCESS_REQUEST).send(await Menu.listarTodos());
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
    } else {
        const menu = new Menu(dados.nome, dados.preco, dados.categoria);
        const data = await menu.criar();
        response.status(CREATED_SUCCESS_REQUEST).send(data);
    } 
});

export default routesMenus;