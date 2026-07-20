import { Router } from "express";
import { AppDataSource } from "../config/database_postgres.js";
import { ItemPedidoEntity } from "../entidades/Items_pedidos.js";
import { SUCCESS_REQUEST, CREATED_SUCCESS_REQUEST, BAD_REQUEST_ERROR, NOT_FOUND_ERROR, INTERNAL_SERVER_ERROR} from "../constants/server.js";

const routesItemsPedidos = new Router();

const itemPedidoRepository = AppDataSource.getRepository(ItemPedidoEntity);

routesItemsPedidos.post("/items-pedidos", async (request, response) => {
    const dados = request.body;

    if (dados.menus_id !== undefined) {
        dados.menu_id = dados.menus_id;
        delete dados.menus_id;
    }

    /*Validação */
    /*Verificar se existe o id do pedido e o id do menu no banco de dados*/

    const itemAdicionado = await itemPedidoRepository.save(dados);
    response.status(CREATED_SUCCESS_REQUEST).send(itemAdicionado);

});

export default routesItemsPedidos;