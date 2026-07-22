// Middleware para capturar logs toda vez que uma requisição for feita para o servidor
export function captureLog(request, response, next) {
  const timestamp = new Date().toISOString();
  const message = `[captureLog] 
     Data/Hora:${timestamp} 
     Método: ${request.method} 
     Path: ${request.path}
     `;

  console.log(message);

  next(); // chama a próxima função de middleware ou rota
}

//incluir a função no index.js do servidor para que seja executada em todas as rotas