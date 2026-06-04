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

    static menuExiste(id) {

        return db.data.menus.some(menu => menu.id === id);
    }

    static async deletar(id) {
        const menusFiltrados = db.data.menus.filter(menu => menu.id !== id);
        db.data.menus = menusFiltrados;
        await db.write();
    }

    static async atualizar(id, novosDados) {
        const menusAtualizados = db.data.menus.map(menu => {
            if (menu.id === id){
                if (novosDados.nome !== undefined) menu.nome = novosDados.nome;
                if (novosDados.preco !== undefined) menu.preco = novosDados.preco;
                if (novosDados.categoria !== undefined) menu.categoria = novosDados.categoria;
            }
            return menu;
        });

        db.data.menus = menusAtualizados;
        await db.write();
        return db.data.menus.find(menu => menu.id === id);
    }
}

export default Menu;