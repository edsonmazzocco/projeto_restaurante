import { UNAUTHORIZED_ERROR } from "../constants/server.js";
import jwt from "jsonwebtoken";

export function validateJwtHandler(request, response, next) {
    const header = request.headers.authorization; // captura o token enviado no cabeçalho da requisição
    
    // verifica se o token foi fornecido
    if (!header) {
        return response.status(UNAUTHORIZED_ERROR).send({ error: "Token não fornecido" });
    }

    const token = header.split(" ")[1]; // separa o token do tipo de autenticação (Bearer)

    // verificar se o token é valido
    try {
        const conteudoDoToken = jwt.verify(token, "senai2026");

        // colocando dentro da requisicao o perfil do usuario extraido do token
        request.usuario = {
        id: conteudoDoToken.id,
        role: conteudoDoToken.role,
        };

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
        response.status(UNAUTHORIZED_ERROR).send({ error: "Token Expirado" });
        return;
        }

        if (error.name === "JsonWebTokenError") {
        response.status(UNAUTHORIZED_ERROR).send({ error: "Token Inválido" });
        return;
        }

        if (error.name === "NotBeforeError") {
        response
            .status(UNAUTHORIZED_ERROR)
            .send({ error: "Token ainda não Ativo" });
        return;
        }

        response
        .status(UNAUTHORIZED_ERROR)
        .send({ error: "Falha na Validação do Token" });
    }
}
