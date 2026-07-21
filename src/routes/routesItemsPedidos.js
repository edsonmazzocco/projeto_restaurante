import { Router } from "express";
import { AppDataSource } from "../config/database_postgres.js";
import { SUCCESS_REQUEST, CREATED_SUCCESS_REQUEST, BAD_REQUEST_ERROR, NOT_FOUND_ERROR, INTERNAL_SERVER_ERROR} from "../constants/server.js";

import { ItemPedidoEntity } from "../entidades/Items_pedidos.js";
import { PedidosEntity } from "../entidades/Pedidos.js";

const routesItemsPedidos = new Router();

const itemPedidoRepository = AppDataSource.getRepository(ItemPedidoEntity);
const pedidoRepository = AppDataSource.getRepository("Pedido");
const menuRepository = AppDataSource.getRepository("Menu");

routesItemsPedidos.post("/items-pedidos", async (request, response) => {
    const dados = request.body;

    if (dados.menus_id !== undefined) {
        dados.menu_id = dados.menus_id;
        delete dados.menus_id;
    }

    /*Validação */

    const pedidoEncontrado = await pedidoRepository.existsBy({ id: dados.pedido_id });
    const menuEncontrado = await menuRepository.existsBy({ id: dados.menu_id });

    if (!pedidoEncontrado) {
        response.status(NOT_FOUND_ERROR).send({ error: "O id do pedido não existe no banco de dados" });
    } else if (!menuEncontrado) {
        response.status(NOT_FOUND_ERROR).send({ error: "O id do menu não existe no banco de dados" });
    } else {
        const itemAdicionado = await itemPedidoRepository.save(dados);
        response.status(CREATED_SUCCESS_REQUEST).send(itemAdicionado);
    }

});

export default routesItemsPedidos;