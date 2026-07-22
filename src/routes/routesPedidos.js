import { Router } from "express";
import { AppDataSource } from "../config/database_postgres.js";
import { PedidosEntity } from "../entidades/Pedidos.js";
import { SUCCESS_REQUEST, CREATED_SUCCESS_REQUEST, BAD_REQUEST_ERROR, NOT_FOUND_ERROR, INTERNAL_SERVER_ERROR} from "../constants/server.js";
import { MesaEntity } from "../entidades/Mesas.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const routesPedidos = new Router();
const pedidoRepository = AppDataSource.getRepository(PedidosEntity);
const mesaRepository = AppDataSource.getRepository(MesaEntity);

routesPedidos.post("/pedidos", asyncHandler(async (request, response) => {
  const dados = request.body;
  /* Validacao AQUI */
  const mesa = await mesaRepository.findOneBy({ id: dados.mesa_id });

  if (mesa.reservado === true) {
    response.status(409).send({ error: "A mesa já está reservada" });
  } else {
    const novoPedido = await pedidoRepository.save(dados);
    await mesaRepository.update(dados.mesa_id, { reservado: true });

    response.status(CREATED_SUCCESS_REQUEST).send(novoPedido);
  }
}));

/* Fazer uma rota que lista todos pedidos */
routesPedidos.get("/pedidos", asyncHandler(async (request, response) => {
  const todosPedidos = await pedidoRepository.find({
    relations: { mesa: true }, // faz o join com tabela mesas
  });
  response.send(todosPedidos);
}));

/* Fazer uma rota que lista que um pedido pelo ID */
routesPedidos.get("/pedidos/:id", asyncHandler(async (request, response) => {
  const id = request.params.id;

  const pedidoEncontrado = await pedidoRepository.findOne({
    where: { id },
    relations: { mesa: true }, // faz o join com tabela mesas
  });

  if (pedidoEncontrado) {
    response.send(pedidoEncontrado);
  } else {
    response
      .status(NOT_FOUND_ERROR)
      .send({ error: "Nao foi encontrado pedido com esse Id" });
  }
}));

/* Uma rota POST para /pedidos que receba mesa_id, nome_cliente e data */

/* Rota para fechar o pedido*/
routesPedidos.put("/pedidos/:id/fechar", asyncHandler(async (request, response) => {
    const idPedido = request.params.id;

    //verifica se o pedido existe
    const pedidoEncontrado = await pedidoRepository.findOneBy({id: idPedido });
    if (!pedidoEncontrado) {
        response.status(NOT_FOUND_ERROR).send({ error: "O id do pedido não existe no banco de dados" });
    } else {

        //soma o total dos itens do pedido e retorna um objeto com o nome "total" e o valor da soma
        const resultado = await AppDataSource
        .createQueryBuilder()
        .select("SUM(total_item)", "total")
        .from((subQuery) => {
            return subQuery
            .select("ic.nome", "nome")
            .addSelect("ip.quantidade * ic.preco", "total_item")
            .from("items_pedidos", "ip")
            .innerJoin("menus", "ic", "ip.item_cardapio_id = ic.id")
            .where("ip.pedido_id = :pedidoId", { pedidoId: idPedido });
        }, "pedido_items")
        .getRawOne();

        //atualiza a coluna total da tabela pedidos e seta a coluna fechado como true
        await pedidoRepository.update(idPedido, { total: resultado.total || 0, fechado: true }); // se o total for null, seta como 0

        //atualiza a coluna reservado da tabela mesas para false
        await mesaRepository.update(pedidoEncontrado.mesa_id, { reservado: false });

        response.send({ message: "Pedido fechado com sucesso", total: resultado.total });
    }

    
}));


export default routesPedidos;
