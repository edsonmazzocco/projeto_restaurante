import { FORBIDDEN_ERROR } from "../constants/server.js";

// funcao de alta ordem
export const autorizarHandler =
  (...rolesPermitidas) =>
  (request, response, next) => {

    if (!request.usuario || !rolesPermitidas.includes(request.usuario.role)) {
      return response
        .status(FORBIDDEN_ERROR)
        .send({ error: "Você não tem permissão para acessar este recurso" });
    }

    next();
  };