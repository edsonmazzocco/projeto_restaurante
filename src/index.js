import express from 'express';

import { PORTA } from './constants/server.js';
import { BAD_REQUEST_ERROR, CREATED_SUCCESS_REQUEST } from './constants/server.js';

import Mesa from './classes/Mesa.js';

const app = express();
app.use(express.json()); // Habilita o servidor para reconhecer formato JSON no body das requisições

//Rota para cadastrar mesas
app.post('/mesas', async(request, response) => {
    const dados = request.body;

    if ((!dados.nome) || (typeof dados.nome !== 'string') || (dados.nome.trim() === '')) {
        return response.status(BAD_REQUEST_ERROR).send({ error: 'Dados inválidos!' });
    } else {
        const mesa = new Mesa(dados.nome);
        const data = await mesa.criar();
        response.status(CREATED_SUCCESS_REQUEST).send(data);
    }

});

app.listen(PORTA, () => {
  console.log(`🚀🚀🚀 Servidor rodando! Endereço: http://localhost:${PORTA}`);
});