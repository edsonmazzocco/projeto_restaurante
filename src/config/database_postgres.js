import {DataSource} from "typeorm";
import {MesaEntity} from "../entidades/Mesa.js";
import {MenusEntity} from "../entidades/Menus.js";

export const AppDataSource = new DataSource({
    type: "postgres", // qual o banco de dados que será utilizado
    host: "localhost", // onde o banco de dados está hospedado
    port: 5432, // porta padrão do PostgreSQL
    username: "postgres", // usuário do banco de dados criado na instalação do PostgreSQL
    password: "senai2026", // senha do banco de dados criada na instalação do PostgreSQL
    database: "Restaurante", // nome da base de dados
    synchronize: false,
    logging: true, // exibir os comandos SQL que estão sendo executados no console
    entities: [MesaEntity, MenusEntity], // deixa a conexão do banco ciente da existência da entidade Mesa
});