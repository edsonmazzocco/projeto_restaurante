//validações da rota de update de menu

import { BAD_REQUEST_ERROR } from "../../../constants/server.js";

export function validateUpdateMenu(request, response, next) {
    const novosDados = request.body;

    if (novosDados.hasOwnProperty('nome')) {
        if (!novosDados.nome || typeof novosDados.nome !== 'string' || novosDados.nome.trim() === '') {
            response.status(BAD_REQUEST_ERROR).send({ error: 'Nome Inválido!' });
        }
    } else if
        (novosDados.hasOwnProperty('preco')) {
        if (typeof novosDados.preco !== 'number' || novosDados.preco < 0) {
            response.status(BAD_REQUEST_ERROR).send({ error: 'Preço Inválido!' });
        }
    } else if
        (novosDados.hasOwnProperty('categoria')) {
        if (!novosDados.categoria || typeof novosDados.categoria !== 'string' || novosDados.categoria.trim() === '') {
            response.status(BAD_REQUEST_ERROR).send({ error: 'Categoria Inválida!' });
        }
    } else if
        (novosDados.hasOwnProperty('tamanho')) {
        if (novosDados.tamanho !== "P" && novosDados.tamanho !== "M" && novosDados.tamanho !== "G") {
            response.status(BAD_REQUEST_ERROR).send({ error: 'Tamanho Inválido! Valores aceitos: P, M ou G' });
        }
    } else {
        next();
    }
}