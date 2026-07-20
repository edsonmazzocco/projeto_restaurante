import {EntitySchema} from "typeorm";

export const ChefsEntity = new EntitySchema({
    name: "Chef", //nome simbólico da entidade, usado internamente pelo TypeORM
    tableName: "chefs", //nome exato da tabela no banco de dados
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: "increment",
        },
        nome: {
            type: "varchar",
            length: 100,
            nullable: false,
        },
        faz_sobremesa: {
            type: "boolean",
            nullable: true,
            default: false,
        },
        especializacao: {
            type: "text",
            nullable: true,
        },
        criado_em: {
            type: "timestamp with time zone",
            nullable: false,
            default: () => "NOW()",
        },
        atualizado_em: {
            type: "timestamp with time zone",
            nullable: false,
            default: () => "NOW()",
        },
    }
});