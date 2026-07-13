import {EntitySchema} from "typeorm";

export const MesaEntity = new EntitySchema({
    name: "Mesa", //nome simbólico da entidade, usado internamente pelo TypeORM
    tableName: "mesas", //nome exato da tabela no banco de dados
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: "increment",
        },
        nome: {
            type: "varchar",
            length: 50,
            nullable: false,
        },
        reservado: {
            type: "boolean",
            default: false,
            nullable: false,
        },
        quant_lugares: {
            type: "int",
            nullable: true,
        },
        criado_em: {
            type: "timestamp with time zone",
            createDate: true, // O TypeORM vai preencher automaticamente no INSERT
            default: () => "NOW()",
        },
        atualizado_em: {
            type: "timestamp with time zone",
            updateDate: true, // O TypeORM vai preencher automaticamente no UPDATE
            default: () => "NOW()",
        },
    }
});