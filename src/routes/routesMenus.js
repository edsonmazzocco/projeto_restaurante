import Router from "express";

import Menu from "../classes/Menu.js";
import { SUCCESS_REQUEST, CREATED_SUCCESS_REQUEST, BAD_REQUEST_ERROR, NOT_FOUND_ERROR, INTERNAL_SERVER_ERROR} from "../constants/server.js";

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
        const menuCriado = await menu.criar();
        response.status(CREATED_SUCCESS_REQUEST).send(menuCriado);
    } 
});

//Rota para deletar um menu
routesMenus.delete('/menu/:id', async (request, response) => {
    const id = parseInt(request.params.id);

    if (Menu.menuExiste(id) === false) {
        return response.status(NOT_FOUND_ERROR).send({ error: 'Menu não encontrado!' });
    } else {
        await Menu.deletar(id);
        response.status(SUCCESS_REQUEST).send({ message: 'Menu deletado com sucesso!' });
    };
});

//Rota para atualizar um menu
routesMenus.put('/menu/:id', async (request, response) => {
    const id = parseInt(request.params.id);
    const novosDados = request.body;

    if (Menu.menuExiste(id) === false) {
        return response.status(NOT_FOUND_ERROR).send({ error: 'Menu não encontrado!' });
    } else {
        const menuAtualizado = await Menu.atualizar(id, novosDados);
        response.status(SUCCESS_REQUEST).send(menuAtualizado);
    }
}); 

export default routesMenus;