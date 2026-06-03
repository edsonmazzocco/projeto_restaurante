import db from "../config/database.js";

class Menu {
    constructor(nome, preco, categoria) {
        this.nome = nome;
        this.preco = preco;
        this.categoria = categoria;
    }

    async criar(){
        const novoMenu = { id: db.data.contador_menus++, nome: this.nome, preco: this.preco, categoria: this.categoria };
        
        db.data.menus.push(novoMenu);
        await db.write();

        return novoMenu;
    }

    static async listarTodos() {
        return db.data.menus;
    }
}

export default Menu;