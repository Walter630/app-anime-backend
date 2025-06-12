import { AdminDao } from '../Dao/Admin.dao';
import { AdminServices } from '../services/Admin.services';
import { AdminController } from './../controller/Admin.controller';
import { Api } from "./Api";

export class adminApi {
    private adminController: AdminController;
    constructor(readonly api: Api) {
        this.adminController = new AdminController(new AdminServices(new AdminDao()));
    }

    public static build(api: Api) {
        const instancia = new adminApi(api);
        instancia.addRotas();
    }

    private addRotas() {
        this.api.addRota('/admin', 'POST', this.adminController.cadastrar.bind(this.adminController));
        this.api.addRota('/admin/login', 'POST', this.adminController.login.bind(this.adminController));
        this.api.addRota('/admin', 'GET', this.adminController.listar.bind(this.adminController));
        this.api.addRota('/admin/:id', 'GET', this.adminController.buscarPorId.bind(this.adminController));
        this.api.addRota('/admin/:id', 'PUT', this.adminController.atualizar.bind(this.adminController));
        this.api.addRota('/admin/:id', 'DELETE', this.adminController.deletar.bind(this.adminController));
    }
}