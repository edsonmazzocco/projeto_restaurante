//Variável da porta do servidor
export const PORTA = 8888;

//Variáveis de status HTTP
export const SUCCESS_REQUEST = 200; // SUCESSO
export const CREATED_SUCCESS_REQUEST = 201; // CRIADO COM SUCESSO
export const SUCESS_NO_CONTENT_REQUEST = 204; // SUCESSO SEM CONTEÚDO NA RESPOSTA
export const BAD_REQUEST_ERROR = 400; // REQUISIÇÃO INVÁLIDA
export const UNAUTHORIZED_ERROR = 401; // NÃO AUTORIZADO
export const FORBIDDEN_ERROR = 403; // PROIBIDO
export const NOT_FOUND_ERROR = 404; // NÃO ENCONTRADO
export const CONFLICT_ERROR = 409;  // CONFLITO (ex: email já cadastrado)
export const INTERNAL_SERVER_ERROR = 500; // ERRO INTERNO DO SERVIDOR
