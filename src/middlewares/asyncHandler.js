// Middleware para lidar com funções assíncronas e capturar erros
export const asyncHandler = (fn) => (request, response, next) => {
  Promise.resolve(fn(request, response, next)).catch(next); // em caso de erro, passa o erro para o próximo middleware (errorHandler) para tratamento de erros
};