import { AnimesController } from "../controller/Animes.controller";
import { AnimesDao } from "../Dao/animes.dao";
import { AnimeServices } from "../services/Animes.services";
import { Api } from "./Api"; // sua classe responsável por abstrair o Express

export class AnimesApi {
  readonly animeController: AnimesController;

  private constructor(readonly api: Api) {
    // Aqui injetamos manualmente cada dependência
    this.animeController = new AnimesController(
      new AnimeServices(new AnimesDao()),
    );
  }

  public static build(api: Api) {
    const instancia = new AnimesApi(api);
    instancia.addRotas();
  }

  private addRotas() {
    this.api.addRota(
      "/anime",
      "POST",
      this.animeController.salvar.bind(this.animeController),
    );
    this.api.addRota(
      "/anime",
      "GET",
      this.animeController.listar.bind(this.animeController),
    );
    this.api.addRota(
      "/anime/:id",
      "GET",
      this.animeController.buscarPorId.bind(this.animeController),
    );
    this.api.addRota(
      "/anime/:id",
      "DELETE",
      this.animeController.deletar.bind(this.animeController),
    );
    this.api.addRota(
      "/anime/:id",
      "PUT",
      this.animeController.atualizar.bind(this.animeController),
    );
  }
}
