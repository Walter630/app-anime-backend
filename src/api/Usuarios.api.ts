import { UsuariosController } from "../controller/Usuarios.controller";
import { UsuariosDao } from "../Dao/Usuarios.dao";
import { UsuariosServices } from "../services/Usuarios.services";
import { Api } from "./Api";

export class UsuariosApi {
    readonly usuarioController: UsuariosController;

    constructor(readonly api: Api){
        this.usuarioController = new UsuariosController(new UsuariosServices( new UsuariosDao()))
    }

    public static build(api: Api){
        const instance = new UsuariosApi(api);
        instance.addRotas()
    }

    public addRotas() {
        this.api.addRota('/usuario', 'POST', this.usuarioController.salvar.bind(this.usuarioController))
        this.api.addRota('/usuario', 'GET', this.usuarioController.listar.bind(this.usuarioController))
        this.api.addRota('/usuario/:id', 'GET', this.usuarioController.buscarPorId.bind(this.usuarioController))
        this.api.addRota('/usuario/:id', 'DELETE', this.usuarioController.deletar.bind(this.usuarioController))
        this.api.addRota('/usuario/:id', 'PUT', this.usuarioController.atualizar.bind(this.usuarioController))
    }
}