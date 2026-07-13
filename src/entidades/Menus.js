import {EntitySchema} from "typeorm";

export const MenusEntity = new EntitySchema({
    name: "Menus", //nome simbólico da entidade, usado internamente pelo TypeORM
    tableName: "menus", //nome exato da tabela no banco de dados
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
        preco: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: false,
            default: 0,
        },
        categoria: {
            type: "varchar",
            length: 100,
            nullable: true,
        },
        tamanho: {
            type: "enum",
            enum: ["P", "M", "G"],
            nullable: true,
        },
        porcoes: {
            type: "int",
            nullable: true,
        },
        vegetariano: {
            type: "boolean",
            nullable: true,
            default: false,
        },
        descricao: {
            type: "text",
            nullable: true,
        },
        criado_em: {
            type: "timestamp",
            nullable: false,
            default: () => "CURRENT_TIMESTAMP",
        },
        atualizado_em: {
            type: "timestamp",
            nullable: false,
            default: () => "CURRENT_TIMESTAMP",
        },
    }
});