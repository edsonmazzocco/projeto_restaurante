import db from "../config/database.js";

class Mesa {
    constructor(nome) {
        this.nome = nome;
    }

    async criar(){
        const novaMesa = { id: db.data.contador_mesas++, nome: this.nome };

        db.data.mesas.push(novaMesa);
        await db.write();
    
        return novaMesa;
    }

    static async listarTodos() { // o método estático pode ser chamado diretamente pela classe, sem precisar instanciar
        return db.data.mesas;
    }
}

export default Mesa;