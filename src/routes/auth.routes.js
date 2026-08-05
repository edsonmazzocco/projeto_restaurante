import { Router } from "express";
import bcrypt from "bcrypt"; // necessário rodar o comando npm install bcrypt para instalar a biblioteca bcrypt
import jwt from "jsonwebtoken"; // necessário rodar o comando npm install jsonwebtoken para instalar a biblioteca jsonwebtoken
import { AppDataSource } from "../config/database_postgres.js";
import { UsuarioEntity } from "../entidades/Usuario.js";
import { BAD_REQUEST_ERROR, CONFLICT_ERROR, CREATED_SUCCESS_REQUEST, SUCCESS_REQUEST } from "../constants/server.js";

const authRoutes = new Router();

const usuarioRepository = AppDataSource.getRepository(UsuarioEntity);


//Rota de Login
authRoutes.post("/auth/login", async (request, response) => {
    const dados = request.body;

    //verifica se o email e a senha foram fornecidos
    if (!dados.email || !dados.senha) {
        response
        .status(BAD_REQUEST_ERROR)
        .send({ error: "E-mail e Senha são obrigatórios" });
        return;
    }

    //busca o usuário no banco de dados pelo email
    const usuario = await usuarioRepository.findOneBy({ email: dados.email });

    if (!usuario) { //se não encontrar o usuário, retorna erro
        response.status(BAD_REQUEST_ERROR).send({ error: "E-mail ou Senha inválidos" });
    } else {
        //compara a senha fornecida com a senha armazenada no banco de dados (hash) e retorna true ou false
        const senhaCorreta = await bcrypt.compare(dados.senha, usuario.senha);

        if (!senhaCorreta) { //se for false: senha incorreta
            response.status(BAD_REQUEST_ERROR).send({ error: "E-mail ou Senha inválidos" });
        } else { // se for true: senha correta
            const tokenUsuario = jwt.sign( // sign cria o token JWT
                { id: usuario.id, role: usuario.role }, "senai2026", { expiresIn: "24h" }); // senai2026 é a chave secreta para gerar o token, e expiresIn define o tempo de expiração do token (24h)
            response.status(SUCCESS_REQUEST).send({ message: "Login com sucesso", nome: usuario.nome, role: usuario.role, token: tokenUsuario });
        }
    }
});


//Rota de cadastro de usuários
authRoutes.post("/auth/usuarios", async (request, response) => {
  const dados = request.body;

  const usuarioExiste = await usuarioRepository.existsBy({ email: dados.email });

  if (usuarioExiste) {
    response.status(CONFLICT_ERROR).send({ error: 'O email já está cadastrado!' });
  } else {

        //VALIDAR OS DADOS DE ENTRADA (nome, email, senha, role) AQUI

        //Transforma a senha em hash usando bcrypt, com 12 rounds de salt
        const senhaHash = await bcrypt.hash(dados.senha, 12);

        //cria um objeto a partir do body, porém substituindo a senha pelo hash gerado
        const dadosUsuario = {
            nome: dados.nome,
            email: dados.email,
            senha: senhaHash,
            role: dados.role,
        };
        /*Forma alternativa usando o operador spread para criar o objeto dadosUsuario
            const dadosUsuario = {...dados, senha: senhaHash,}; */

        const usuario = await usuarioRepository.save(dadosUsuario);

        response.status(CREATED_SUCCESS_REQUEST).send(usuario);
    }


});

export default authRoutes;