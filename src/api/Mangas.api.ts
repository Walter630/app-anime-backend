import { MangasController } from "../controller/Mangas.controller";
import { MangasDao } from "../Dao/Mangas.dao";
import { MangasServices } from "../services/Mangas.services";
import { Api } from "./Api";

export class MangasApi {
  private mangasController: MangasController;

  constructor(readonly api: Api) {
    this.mangasController = new MangasController(
      new MangasServices(new MangasDao()),
    );
  }

  public static build(api: Api) {
    const instancia = new MangasApi(api);
    instancia.addRotas();
  }

  private addRotas() {
    this.api.addRota(
      "/mangas",
      "POST",
      this.mangasController.salvar.bind(this.mangasController),
    );
    this.api.addRota(
      "/mangas",
      "GET",
      this.mangasController.listarMangas.bind(this.mangasController),
    );
    this.api.addRota(
      "/mangas/:id",
      "GET",
      this.mangasController.buscarMangasPorId.bind(this.mangasController),
    );
    this.api.addRota(
      "/mangas/:id",
      "DELETE",
      this.mangasController.deletarManga.bind(this.mangasController),
    );
    this.api.addRota(
      "/mangas/:id",
      "PUT",
      this.mangasController.atualizarManga.bind(this.mangasController),
    );
  }
}
